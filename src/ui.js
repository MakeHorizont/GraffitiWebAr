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
    const arExitButton = document.getElementById('ar-exit-button');
    const arCreateTraceButton = document.getElementById('ar-create-trace-button');
    const createTraceModal = document.getElementById('create-trace-modal');
    const closeCreateTraceModalButton = createTraceModal.querySelector('.close-button');

    arExitButton.addEventListener('click', () => {
        arContainer.classList.add('hidden');
        arUi.classList.add('hidden');
        mainMenu.classList.remove('hidden');
        mainMenu.classList.remove('fade-out');
    });

    const arReviewTracesButton = document.getElementById('ar-review-traces-button');
    const reviewTracesModal = document.getElementById('review-traces-modal');
    const closeReviewTracesModalButton = reviewTracesModal.querySelector('.close-button');

    arCreateTraceButton.addEventListener('click', () => {
        createTraceModal.classList.remove('hidden');
    });

    closeCreateTraceModalButton.addEventListener('click', () => {
        createTraceModal.classList.add('hidden');
    });

    arReviewTracesButton.addEventListener('click', () => {
        // Add logic to load and display traces here
        reviewTracesModal.classList.remove('hidden');
    });

    closeReviewTracesModalButton.addEventListener('click', () => {
        reviewTracesModal.classList.add('hidden');
    });
    const accountModal = document.getElementById('account-modal');
    const closeButton = accountModal.querySelector('.close-button');
    const guestModeButtonModal = document.getElementById('guest-mode-button-modal');
    const guestDid = document.getElementById('guest-did');
    const rememberMeButton = document.getElementById('remember-me-button');
    const createKeyFileButton = document.getElementById('create-key-file-button');
    const uploadKeyFileButton = document.getElementById('upload-key-file-button');

    accountButton.addEventListener('click', () => {
        accountModal.classList.remove('hidden');
    });

    closeButton.addEventListener('click', () => {
        accountModal.classList.add('hidden');
    });

    window.addEventListener('click', (event) => {
        if (event.target == accountModal) {
            accountModal.classList.add('hidden');
        }
    });

    guestModeButtonModal.addEventListener('click', async () => {
        const did = await app.startGuestMode();
        guestDid.textContent = did;
        startButton.disabled = false;
        accountModal.classList.add('hidden');
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

    function showMainMenu() {
        mainMenu.classList.remove('hidden');
        arUi.classList.add('hidden');
    }

    function showAR() {
        mainMenu.classList.add('hidden');
        arUi.classList.remove('hidden');
        arContainer.classList.remove('hidden');
    }

    startButton.addEventListener('click', () => {
        mainMenu.classList.add('fade-out');
        arInstructions.classList.remove('hidden');
        arInstructions.classList.add('fade-in');
    });

    closeInstructionsButton.addEventListener('click', () => {
        arInstructions.classList.remove('fade-in');
        arInstructions.classList.add('fade-out');
        setTimeout(() => {
            arInstructions.classList.add('hidden');
            showAR();
            app.startAR();
        }, 500);
    });

    const settingsModal = document.getElementById('settings-modal');
    const closeSettingsButton = settingsModal.querySelector('.close-button');
    const saveSettingsButton = document.getElementById('save-settings-button');
    const cancelSettingsButton = document.getElementById('cancel-settings-button');

    settingsButton.addEventListener('click', () => {
        settingsModal.classList.remove('hidden');
    });

    closeSettingsButton.addEventListener('click', () => {
        settingsModal.classList.add('hidden');
    });

    saveSettingsButton.addEventListener('click', () => {
        // Add logic to save settings here
        settingsModal.classList.add('hidden');
    });

    cancelSettingsButton.addEventListener('click', () => {
        settingsModal.classList.add('hidden');
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
        instructionsModal.classList.remove('hidden');
    });

    closeInstructionsModalButton.addEventListener('click', () => {
        instructionsModal.classList.add('hidden');
    });

    const projectsModal = document.getElementById('projects-modal');
    const closeProjectsModalButton = projectsModal.querySelector('.close-button');

    projectsButton.addEventListener('click', () => {
        projectsModal.classList.remove('hidden');
    });

    closeProjectsModalButton.addEventListener('click', () => {
        projectsModal.classList.add('hidden');
    });
}
