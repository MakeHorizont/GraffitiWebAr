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
    accountButton.addEventListener('click', () => {
        accountCreationContainer.style.display = 'flex';
        accountButton.style.display = 'none';
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
        mainMenu.style.display = 'none';
        arInstructions.style.display = 'block';
    });

    closeInstructionsButton.addEventListener('click', () => {
        arInstructions.style.display = 'none';
        arContainer.style.display = 'block';
        arUi.style.display = 'flex';
        app.startAR();
    });

    vrButton.addEventListener('click', () => {
        // In a real implementation, this would trigger the VR mode.
        // For now, we can show an alert or a message.
        alert('VR mode is not implemented yet.');
    });

    settingsButton.addEventListener('click', () => {
        alert('Settings are not implemented yet.');
    });

    instructionsButton.addEventListener('click', () => {
        window.open('https://github.com/ten-tools-of-the-new-world/vestigium/blob/main/docs/USER_GUIDE.md', '_blank');
    });

    projectsButton.addEventListener('click', () => {
        window.open('https://github.com/ten-tools-of-the-new-world', '_blank');
    });
}
