import './style.css';
import { initUI } from './ui.js';
import 'showdown';

class VestigiumApp {
    constructor() {
        this.ipfs = null;
        this.orbitdb = null;
        this.db = null;
        this.friendsDb = null;
        this.userDid = null;
        this.currentPosition = null;
        this.map = null;
        this.userMarker = null;
        this.scene = document.querySelector('a-scene');
        this.markerEntity = document.getElementById('marker-entity');
        this.selectedEntity = null;

        this.init();
    }

    async init() {
        await this.initDID();
        this.initMap();
        initUI(this);
    }

    async initDID() {
        const { DidKey } = DidKeyWebCrypto;
        const didKey = new DidKey();
        const rememberedDid = localStorage.getItem('rememberedDid');
        if (rememberedDid) {
            this.userDid = await didKey.fromDid(rememberedDid);
        } else {
            const storedDid = localStorage.getItem('userDid');
            if (storedDid) {
                this.userDid = await didKey.fromDid(storedDid);
            } else {
            this.userDid = await didKey.generate();
            localStorage.setItem('userDid', this.userDid.did);
            localStorage.setItem('privateKey', JSON.stringify(await this.userDid.export({
                type: 'JsonWebKey2020',
                privateKey: true
            })));
        }
        console.log('User DID:', this.userDid.did);
    }

    initMap() {
        this.map = L.map('map').setView([0, 0], 2);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);

        navigator.geolocation.getCurrentPosition((position) => {
            this.currentPosition = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            };
            this.map.setView([this.currentPosition.latitude, this.currentPosition.longitude], 13);
            if (this.userMarker) {
                this.userMarker.setLatLng([this.currentPosition.latitude, this.currentPosition.longitude]);
            } else {
                this.userMarker = L.marker([this.currentPosition.latitude, this.currentPosition.longitude]).addTo(this.map);
            }
        });
    }

    async startGuestMode() {
        console.log('Starting in Guest Mode');
        await this.initDID();
        return this.userDid.id;
    }

    rememberUser() {
        localStorage.setItem('rememberedDid', this.userDid.did);
    }

    async createAccountWithFile() {
        await this.initDID();
        const privateKey = await this.userDid.export({
            type: 'JsonWebKey2020',
            privateKey: true
        });
        const blob = new Blob([JSON.stringify(privateKey)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'vestigium_key.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    loginWithFile(file) {
        // This would involve reading the DID from the file.
        // For now, we'll just log a message.
        console.log(`Logging in with file: ${file.name}`);
        alert('Login with file is not fully implemented yet.');
    }

    async startAR() {
        console.log('Starting AR experience');
        if (!this.ipfs) {
            this.ipfs = await Ipfs.create();
            this.orbitdb = await OrbitDB.createInstance(this.ipfs);
            this.db = await this.orbitdb.keyvalue('vestigium-db');
            this.friendsDb = await this.orbitdb.keyvalue('friends-db');
            this.loadARObjects();
        }
    }

    async loadARObjects() {
        const bounds = this.map.getBounds();
        const all = await this.db.all();
        for (const key in all) {
            const objectData = all[key];
            if (objectData.latitude && objectData.longitude && bounds.contains([objectData.latitude, objectData.longitude])) {
                let showObject = false;
                if (objectData.visibility === 'public') {
                    showObject = true;
                } else if (objectData.visibility === 'private' && objectData.author === this.userDid.id) {
                    showObject = true;
                } else if (objectData.visibility === 'friends') {
                    const friends = this.friendsDb.get(this.userDid.id) || [];
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
                    this.markerEntity.appendChild(entity);

                    entity.addEventListener('click', () => {
                        if (this.selectedEntity) {
                            // Remove wireframe from previously selected entity
                            const wireframe = this.selectedEntity.getObject3D('mesh');
                            if (wireframe) {
                                this.selectedEntity.removeObject3D('mesh');
                            }
                        }
                        this.selectedEntity = entity;
                        // Add wireframe to the selected entity
                        const mesh = this.selectedEntity.getObject3D('mesh');
                        if (mesh) {
                            const wireframe = new THREE.LineSegments(
                                new THREE.WireframeGeometry(mesh.geometry),
                                new THREE.LineBasicMaterial({ color: 0xffffff })
                            );
                            this.selectedEntity.setObject3D('mesh', wireframe);
                        }
                    });
                }
            }
        }
    }
}

window.onload = () => {
    new VestigiumApp();
};
