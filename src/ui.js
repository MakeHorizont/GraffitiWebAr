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
        console.log('arExitButton clicked');
        arContainer.classList.add('hidden');
        arUi.classList.add('hidden');
        mainMenu.classList.remove('hidden');
        mainMenu.classList.remove('fade-out');
    });

    const arReviewTracesButton = document.getElementById('ar-review-traces-button');
    const reviewTracesModal = document.getElementById('review-traces-modal');
    const closeReviewTracesModalButton = reviewTracesModal.querySelector('.close-button');

    arCreateTraceButton.addEventListener('click', () => {
        console.log('arCreateTraceButton clicked');
        createTraceModal.classList.remove('hidden');
    });

    closeCreateTraceModalButton.addEventListener('click', () => {
        console.log('closeCreateTraceModalButton clicked');
        createTraceModal.classList.add('hidden');
    });

    arReviewTracesButton.addEventListener('click', () => {
        console.log('arReviewTracesButton clicked');
        // Add logic to load and display traces here
        reviewTracesModal.classList.remove('hidden');
    });

    closeReviewTracesModalButton.addEventListener('click', () => {
        console.log('closeReviewTracesModalButton clicked');
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
        console.log('accountButton clicked');
        accountModal.classList.remove('hidden');
    });

    closeButton.addEventListener('click', () => {
        console.log('closeButton clicked');
        accountModal.classList.add('hidden');
    });

    window.addEventListener('click', (event) => {
        if (event.target == accountModal) {
            console.log('window clicked on accountModal');
            accountModal.classList.add('hidden');
        }
    });

    guestModeButtonModal.addEventListener('click', async () => {
        console.log('guestModeButtonModal clicked');
        const did = await app.startGuestMode();
        guestDid.textContent = did;
        startButton.disabled = false;
        accountModal.classList.add('hidden');
    });

    rememberMeButton.addEventListener('click', () => {
        console.log('rememberMeButton clicked');
        app.rememberUser();
        alert('Ваш гостевой аккаунт сохранен в браузере.');
    });

    createKeyFileButton.addEventListener('click', async () => {
        console.log('createKeyFileButton clicked');
        await app.createAccountWithFile();
        startButton.disabled = false;
        accountModal.style.display = 'none';
    });

    uploadKeyFileButton.addEventListener('click', () => {
        console.log('uploadKeyFileButton clicked');
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

    const cameraInstructionModal = document.getElementById('camera-instruction-modal');
    const startArButton = document.getElementById('start-ar-button');

    startButton.addEventListener('click', () => {
        console.log('startButton clicked');
        mainMenu.classList.add('fade-out');
        cameraInstructionModal.classList.remove('hidden');
    });

    startArButton.addEventListener('click', () => {
        console.log('startArButton clicked');
        cameraInstructionModal.classList.add('hidden');
        showAR();
        app.startAR();
    });

    const settingsModal = document.getElementById('settings-modal');
    const closeSettingsButton = settingsModal.querySelector('.close-button');
    const saveSettingsButton = document.getElementById('save-settings-button');
    const cancelSettingsButton = document.getElementById('cancel-settings-button');

    settingsButton.addEventListener('click', () => {
        console.log('settingsButton clicked');
        settingsModal.classList.remove('hidden');
    });

    closeSettingsButton.addEventListener('click', () => {
        console.log('closeSettingsButton clicked');
        settingsModal.classList.add('hidden');
    });

    saveSettingsButton.addEventListener('click', () => {
        console.log('saveSettingsButton clicked');
        // Add logic to save settings here
        settingsModal.classList.add('hidden');
    });

    cancelSettingsButton.addEventListener('click', () => {
        console.log('cancelSettingsButton clicked');
        settingsModal.classList.add('hidden');
    });

    const featureInDevelopmentModal = document.getElementById('feature-in-development-modal');
    const closeFeatureInDevelopmentModalButton = featureInDevelopmentModal.querySelector('.close-button');

    vrButton.addEventListener('click', () => {
        console.log('vrButton clicked');
        featureInDevelopmentModal.classList.remove('hidden');
    });

    closeFeatureInDevelopmentModalButton.addEventListener('click', () => {
        featureInDevelopmentModal.classList.add('hidden');
    });

    const instructionsModal = document.getElementById('instructions-modal');
    const instructionsContent = document.getElementById('instructions-content');
    const closeInstructionsModalButton = instructionsModal.querySelector('.close-button');

    instructionsButton.addEventListener('click', async () => {
        console.log('instructionsButton clicked');
        const response = await fetch('/USER_GUIDE.md');
        const markdown = await response.text();
        const converter = new showdown.Converter();
        instructionsContent.innerHTML = converter.makeHtml(markdown);
        instructionsModal.classList.remove('hidden');
    });

    closeInstructionsModalButton.addEventListener('click', () => {
        console.log('closeInstructionsModalButton clicked');
        instructionsModal.classList.add('hidden');
    });

    const projectsModal = document.getElementById('projects-modal');
    const closeProjectsModalButton = projectsModal.querySelector('.close-button');

    projectsButton.addEventListener('click', () => {
        console.log('projectsButton clicked');
        projectsModal.classList.remove('hidden');
    });

    closeProjectsModalButton.addEventListener('click', () => {
        console.log('closeProjectsModalButton clicked');
        projectsModal.classList.add('hidden');
    });
}
