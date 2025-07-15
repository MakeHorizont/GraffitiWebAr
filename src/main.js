window.onload = async () => {
    const scene = document.querySelector('a-scene');
    const arButton = document.getElementById('ar-button');
    const fileInput = document.getElementById('file-input');
    const saveButton = document.getElementById('save-button');

    let ipfs;
    let orbitdb;
    let db;
    let fileContent;

    arButton.addEventListener('click', () => {
        scene.enterVR();
    });

    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            fileContent = e.target.result;
        };
        reader.readAsArrayBuffer(file);
    });

    saveButton.addEventListener('click', async () => {
        if (!ipfs) {
            ipfs = await Ipfs.create();
            orbitdb = await OrbitDB.createInstance(ipfs);
            db = await orbitdb.keyvalue('vestigium-db');
        }

        if (fileContent) {
            const result = await ipfs.add(fileContent);
            const cid = result.cid.toString();

            const objectData = {
                cid: cid,
                author: 'did:example:123', // Placeholder DID
                position: '0 0 -5',
                scale: '0.5 0.5 0.5'
            };

            await db.put(cid, objectData);
            console.log('Object data saved to OrbitDB:', db.get(cid));

            const entity = document.createElement('a-entity');
            entity.setAttribute('gltf-model', `url(https://ipfs.io/ipfs/${cid})`);
            entity.setAttribute('position', '0 0 -5');
            entity.setAttribute('scale', '0.5 0.5 0.5');
            scene.appendChild(entity);
        }
    });
};
