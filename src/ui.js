export function initUI(app) {
    const mainMenu = document.getElementById('main-menu');
    const accountCreationContainer = document.getElementById('account-creation-container');
    const startButton = document.getElementById('start-button');
    const accountButton = document.getElementById('account-button');
    const settingsButton = document.getElementById('settings-button');
    const instructionsButton = document.getElementById('instructions-button');
    const projectsButton = document.getElementById('projects-button');
    const vrButton = document.getElementById('vr-button');
    const guestModeButton = document.getElementById('guest-mode-button');
    const createAccountFileButton = document.getElementById('create-account-file-button');
    const loginFileButton = document.getElementById('login-file-button');
    const loginFileInput = document.getElementById('login-file-input');
    const arInstructions = document.getElementById('ar-instructions');
    const closeInstructionsButton = document.getElementById('close-instructions-button');
    const arContainer = document.getElementById('ar-container');
    const arUi = document.getElementById('ar-ui');
    const arSelectObjectButton = document.getElementById('ar-select-object-button');
    const arObjectMenu = document.getElementById('ar-object-menu');

    // Event Listeners
    arSelectObjectButton.addEventListener('click', () => {
        arObjectMenu.style.display = arObjectMenu.style.display === 'none' ? 'block' : 'none';
    });
    const accountModal = document.getElementById('account-modal');
    const closeButton = document.querySelector('.close-button');
    const guestModeButtonModal = document.getElementById('guest-mode-button-modal');
    const guestDid = document.getElementById('guest-did');
    const rememberMeButton = document.getElementById('remember-me-button');
    const createKeyFileButton = document.getElementById('create-key-file-button');
    const uploadKeyFileButton = document.getElementById('upload-key-file-button');

    accountButton.addEventListener('click', () => {
        accountModal.style.display = 'block';
    });

    closeButton.addEventListener('click', () => {
        accountModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == accountModal) {
            accountModal.style.display = 'none';
        }
    });

    guestModeButtonModal.addEventListener('click', async () => {
        const did = await app.startGuestMode();
        guestDid.textContent = did;
        startButton.disabled = false;
        accountModal.style.display = 'none';
    });

    rememberMeButton.addEventListener('click', () => {
        app.rememberUser();
        alert('Ваш гостевой аккаунт сохранен в браузере.');
    });

    createKeyFileButton.addEventListener('click', async () => {
        await app.createAccountWithFile();
        startButton.disabled = false;
        accountModal.style.display = 'none';
    });

    uploadKeyFileButton.addEventListener('click', () => {
        loginFileInput.click();
    });

    guestModeButton.addEventListener('click', () => {
        app.startGuestMode();
        startButton.disabled = false;
        accountCreationContainer.style.display = 'none';
    });

    createAccountFileButton.addEventListener('click', () => {
        app.createAccountWithFile();
        startButton.disabled = false;
        accountCreationContainer.style.display = 'none';
    });

    loginFileButton.addEventListener('click', () => {
        loginFileInput.click();
    });

    loginFileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            app.loginWithFile(file);
            startButton.disabled = false;
            accountCreationContainer.style.display = 'none';
        }
    });

    startButton.addEventListener('click', () => {
        mainMenu.classList.add('fade-out');
        arInstructions.style.display = 'block';
        arInstructions.classList.add('fade-in');
    });

    closeInstructionsButton.addEventListener('click', () => {
        arInstructions.classList.remove('fade-in');
        arInstructions.classList.add('fade-out');
        setTimeout(() => {
            arContainer.style.display = 'block';
            arUi.style.display = 'flex';
            app.startAR();
        }, 500);
    });

    const settingsModal = document.getElementById('settings-modal');
    const closeSettingsButton = settingsModal.querySelector('.close-button');
    const saveSettingsButton = document.getElementById('save-settings-button');
    const cancelSettingsButton = document.getElementById('cancel-settings-button');

    settingsButton.addEventListener('click', () => {
        settingsModal.style.display = 'block';
    });

    closeSettingsButton.addEventListener('click', () => {
        settingsModal.style.display = 'none';
    });

    saveSettingsButton.addEventListener('click', () => {
        // Add logic to save settings here
        settingsModal.style.display = 'none';
    });

    cancelSettingsButton.addEventListener('click', () => {
        settingsModal.style.display = 'none';
    });

    vrButton.addEventListener('click', () => {
        // In a real implementation, this would trigger the VR mode.
        // For now, we can show an alert or a message.
        alert('VR mode is not implemented yet.');
    });

    const instructionsModal = document.getElementById('instructions-modal');
    const instructionsContent = document.getElementById('instructions-content');
    const closeInstructionsModalButton = instructionsModal.querySelector('.close-button');

    instructionsButton.addEventListener('click', async () => {
        const response = await fetch('/USER_GUIDE.md');
        const markdown = await response.text();
        const converter = new showdown.Converter();
        instructionsContent.innerHTML = converter.makeHtml(markdown);
        instructionsModal.style.display = 'block';
    });

    closeInstructionsModalButton.addEventListener('click', () => {
        instructionsModal.style.display = 'none';
    });

    projectsButton.addEventListener('click', () => {
        window.open('https://github.com/ten-tools-of-the-new-world', '_blank');
    });
}
