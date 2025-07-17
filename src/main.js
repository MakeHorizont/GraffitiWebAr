window.onload = async () => {
    const scene = document.querySelector('a-scene');
    const arButton = document.getElementById('ar-button');
    const fileInput = document.getElementById('file-input');
    const saveButton = document.getElementById('save-button');
    const visibilitySelect = document.getElementById('visibility-select');
    const markerEntity = document.getElementById('marker-entity');
    const mapContainer = document.getElementById('map-container');
    const mapDiv = document.getElementById('map');
    const accountButton = document.getElementById('account-button');
    const accountCreationContainer = document.getElementById('account-creation-container');
    const guestModeButton = document.getElementById('guest-mode-button');
    const createAccountFileButton = document.getElementById('create-account-file-button');
    const loginFileInput = document.getElementById('login-file-input');
    const loginFileButton = document.getElementById('login-file-button');

    let ipfs;
    let orbitdb;
    let db;
    let friendsDb;
    let fileContent;
    let selectedEntity = null;
    let currentPosition = null;
    let userDid;
    let map;
    let userMarker;

    // DID initialization
    const { DidKey } = DidKeyWebCrypto;
    const didKey = new DidKey();
    const storedDid = localStorage.getItem('userDid');
    if (storedDid) {
        userDid = await didKey.fromDid(storedDid);
    } else {
        userDid = await didKey.generate();
        localStorage.setItem('userDid', userDid.did);
        localStorage.setItem('privateKey', JSON.stringify(await userDid.export({
            type: 'JsonWebKey2020',
            privateKey: true
        })));
    }
    console.log('User DID:', userDid.did);

    function logError(error) {
        // Send error to a logging service
        console.error(error);
    }

    window.addEventListener('error', (event) => {
        logError(event.error);
    });

    // Map initialization
    map = L.map(mapDiv).setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    navigator.geolocation.getCurrentPosition((position) => {
        currentPosition = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        };
        map.setView([currentPosition.latitude, currentPosition.longitude], 13);
        if (userMarker) {
            userMarker.setLatLng([currentPosition.latitude, currentPosition.longitude]);
        } else {
            userMarker = L.marker([currentPosition.latitude, currentPosition.longitude]).addTo(map);
        }
    });

    const cv = require('opencv.js');

    arButton.addEventListener('click', async () => {
        if (scene.is('vr-mode')) {
            scene.exitVR();
            mapContainer.style.zIndex = -1;
        } else {
            try {
                const session = await navigator.xr.requestSession('immersive-ar', {
                    requiredFeatures: ['hit-test', 'local-floor', 'depth-sensing'],
                    optionalFeatures: ['dom-overlay', 'unbounded'],
                    domOverlay: { root: document.querySelector('#overlay') },
                    depthSensing: {
                        usagePreference: ["cpu-optimized", "gpu-optimized"],
                        dataFormatPreference: ["luminance-alpha", "float32"],
                    },
                });
                scene.xrSession = session;
                mapContainer.style.zIndex = 10;
            } catch (e) {
                console.error('Failed to create AR session', e);
                // Fallback to a non-AR mode or show an error message
            }
        }
    });

    function createVisualAnchor(imageData) {
        return new Promise((resolve) => {
            const mat = cv.matFromImageData(imageData);
            const orb = new cv.ORB();
            const keyPoints = new cv.KeyPointVector();
            const descriptors = new cv.Mat();
            orb.detectAndCompute(mat, new cv.Mat(), keyPoints, descriptors);
            resolve({
                keyPoints: keyPoints.get(0),
                descriptors: descriptors.data64F
            });
        });
    }

    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            fileContent = e.target.result;
        };
        reader.readAsArrayBuffer(file);
    });

    saveButton.addEventListener('click', async () => {
        if (fileContent && currentPosition) {
            const visibility = visibilitySelect.value;
            let encryptedContent = fileContent;
            if (visibility === 'private') {
                const privateKey = JSON.parse(localStorage.getItem('privateKey'));
                const key = await window.crypto.subtle.importKey(
                    "jwk",
                    privateKey,
                    {
                        name: "ECDH",
                        namedCurve: "P-256"
                    },
                    true,
                    ["deriveKey"]
                );
                const derivedKey = await window.crypto.subtle.deriveKey(
                    {
                        name: "ECDH",
                        public: key.publicKey
                    },
                    key,
                    {
                        name: "AES-GCM",
                        length: 256
                    },
                    true,
                    ["encrypt", "decrypt"]
                );
                const iv = window.crypto.getRandomValues(new Uint8Array(12));
                encryptedContent = await window.crypto.subtle.encrypt(
                    {
                        name: "AES-GCM",
                        iv: iv
                    },
                    derivedKey,
                    fileContent
                );
            }

            const result = await ipfs.add(encryptedContent);
            const cid = result.cid.toString();
                await ipfs.pin.add(cid);

            const objectData = {
                cid: cid,
                author: userDid.id,
                position: selectedEntity ? selectedEntity.getAttribute('position') : { x: 0, y: 0, z: 0 },
                scale: selectedEntity ? selectedEntity.getAttribute('scale') : { x: 0.5, y: 0.5, z: 0.5 },
                rotation: selectedEntity ? selectedEntity.getAttribute('rotation') : { x: 0, y: 0, z: 0 },
                latitude: currentPosition.latitude,
                longitude: currentPosition.longitude,
                visibility: visibility
            };

            await db.put(cid, objectData);
            console.log('Object data saved to OrbitDB:', db.get(cid));

            const entity = document.createElement('a-entity');
            entity.setAttribute('gltf-model', `url(https://ipfs.io/ipfs/${cid})`);
            entity.setAttribute('position', objectData.position);
            entity.setAttribute('scale', objectData.scale);
            entity.setAttribute('rotation', objectData.rotation);
            entity.setAttribute('animation-mixer', '');
            markerEntity.appendChild(entity);

            entity.addEventListener('click', () => {
                selectedEntity = entity;
            });

            const marker = L.marker([objectData.latitude, objectData.longitude]).addTo(map);
            marker.on('click', () => {
                scene.enterVR();
                mapContainer.style.zIndex = 10;
                // Logic to focus on the selected object in AR
            });
        }
    });

    if (!ipfs) {
        ipfs = await Ipfs.create();
        orbitdb = await OrbitDB.createInstance(ipfs);
        db = await orbitdb.keyvalue('vestigium-db');
        friendsDb = await orbitdb.keyvalue('friends-db');
    }

    map.on('moveend', async () => {
        const bounds = map.getBounds();
        const all = await db.all();
        for (const key in all) {
            const objectData = all[key];
            if (objectData.latitude && objectData.longitude && bounds.contains([objectData.latitude, objectData.longitude])) {
                let showObject = false;
                if (objectData.visibility === 'public') {
                    showObject = true;
                } else if (objectData.visibility === 'private' && objectData.author === userDid.id) {
                    showObject = true;
                } else if (objectData.visibility === 'friends') {
                    const friends = friendsDb.get(userDid.id) || [];
                    if (friends.includes(objectData.author)) {
                        showObject = true;
                    }
                }

                if (showObject) {
                    const entity = document.createElement('a-entity');
                    entity.setAttribute('gltf-model', `url(https://ipfs.io/ipfs/${objectData.cid})`);
                    entity.setAttribute('position', objectData.position);
                    entity.setAttribute('scale', objectData.scale);
                    entity.setAttribute('rotation', objectData.rotation);
                    entity.setAttribute('animation-mixer', '');
                    markerEntity.appendChild(entity);

                    entity.addEventListener('click', () => {
                        selectedEntity = entity;
                    });

                    const marker = L.marker([objectData.latitude, objectData.longitude]).addTo(map);
                    marker.on('click', () => {
                        scene.enterVR();
                        mapContainer.style.zIndex = 10;
                        // Logic to focus on the selected object in AR
                    });
                }
            }
        }
    });

    let isDragging = false;
    let previousMousePosition = {
        x: 0,
        y: 0
    };

    scene.addEventListener('mousedown', (e) => {
        if (e.target.tagName === 'A-SCENE') {
            isDragging = true;
            previousMousePosition = {
                x: e.clientX,
                y: e.clientY
            };
        }
    });

    scene.addEventListener('mousemove', (e) => {
        if (!isDragging || !selectedEntity) {
            return;
        }

        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;

        if (e.ctrlKey) {
            const rotation = selectedEntity.getAttribute('rotation');
            selectedEntity.setAttribute('rotation', {
                x: rotation.x,
                y: rotation.y + deltaX * 0.1,
                z: rotation.z
            });
        } else if (e.shiftKey) {
            const scale = selectedEntity.getAttribute('scale');
            selectedEntity.setAttribute('scale', {
                x: scale.x + deltaY * 0.01,
                y: scale.y + deltaY * 0.01,
                z: scale.z + deltaY * 0.01
            });
        } else {
            const position = selectedEntity.getAttribute('position');
            selectedEntity.setAttribute('position', {
                x: position.x + deltaX * 0.01,
                y: position.y - deltaY * 0.01,
                z: position.z
            });
        }

        previousMousePosition = {
            x: e.clientX,
            y: e.clientY
        };
    });

    scene.addEventListener('mouseup', () => {
        isDragging = false;
    });

    scene.addEventListener('mouseleave', () => {
        isDragging = false;
    });
};

function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI / 180; // φ, λ in radians
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = R * c; // in metres
    return d;
}
