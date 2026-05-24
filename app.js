// Minimalist Exam Countdown
// Default Target Date: Sunday, June 28, 2026 at 09:00 AM (local time)
const DEFAULT_TARGET_DATE = new Date(2026, 5, 28, 9, 0, 0);
const LOCAL_STORAGE_KEY = 'imtihan_countdown_target';

// Dynamic state loaded from localStorage or fallback to default
function getSavedTargetDate() {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
        const parsed = new Date(saved);
        if (!isNaN(parsed.getTime())) {
            return parsed;
        }
    }
    return DEFAULT_TARGET_DATE;
}

let targetDate = getSavedTargetDate();

// DOM Elements - Countdown units & timers
const detailedTimer = document.getElementById('timer');
const simpleTimer = document.getElementById('simple-timer');
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const simpleDaysEl = document.getElementById('simple-days');

// DOM Elements - Settings Modal
const settingsToggle = document.getElementById('settings-toggle');
const settingsPanel = document.getElementById('settings-panel');
const settingsClose = document.getElementById('settings-close');
const targetDatetimeInput = document.getElementById('target-datetime');
const saveSettingsBtn = document.getElementById('save-settings');
const resetSettingsBtn = document.getElementById('reset-settings');

function updateCountdown() {
    const now = new Date();
    const totalDifference = targetDate - now;

    if (totalDifference <= 0) {
        // Target reached: freeze at 00:00:00:00
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minutesEl.textContent = '00';
        secondsEl.textContent = '00';
        simpleDaysEl.textContent = '00';
        return;
    }

    // Time math
    const days = Math.floor(totalDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((totalDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((totalDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((totalDifference % (1000 * 60)) / 1000);

    // Standard 2-digit padding format
    const dStr = String(days).padStart(2, '0');
    const hStr = String(hours).padStart(2, '0');
    const mStr = String(minutes).padStart(2, '0');
    const sStr = String(seconds).padStart(2, '0');

    // Efficient DOM writing (updates content only if value shifted)
    if (daysEl.textContent !== dStr) daysEl.textContent = dStr;
    if (simpleDaysEl.textContent !== dStr) simpleDaysEl.textContent = dStr;
    if (hoursEl.textContent !== hStr) hoursEl.textContent = hStr;
    if (minutesEl.textContent !== mStr) minutesEl.textContent = mStr;
    if (secondsEl.textContent !== sStr) secondsEl.textContent = sStr;
}

// Format local Date object to YYYY-MM-DDTHH:mm format
function formatLocalDateTime(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// Initialize input value
function initSettingsInput() {
    targetDatetimeInput.value = formatLocalDateTime(targetDate);
}

// Settings Modal controls
function openSettings() {
    initSettingsInput();
    settingsPanel.classList.remove('hidden');
}

function closeSettings() {
    settingsPanel.classList.add('hidden');
}

// Settings Toggle Button Event
settingsToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (settingsPanel.classList.contains('hidden')) {
        openSettings();
    } else {
        closeSettings();
    }
});

// Settings Close Button Event
settingsClose.addEventListener('click', (e) => {
    e.stopPropagation();
    closeSettings();
});

// Click inside the settings panel shouldn't close it
settingsPanel.addEventListener('click', (e) => {
    e.stopPropagation();
});

// Save new Target Date
saveSettingsBtn.addEventListener('click', () => {
    const value = targetDatetimeInput.value;
    if (!value) {
        alert('Lütfen geçerli bir tarih ve saat seçin.');
        return;
    }

    const newDate = new Date(value);
    if (isNaN(newDate.getTime())) {
        alert('Geçersiz tarih formatı.');
        return;
    }

    targetDate = newDate;
    localStorage.setItem(LOCAL_STORAGE_KEY, newDate.toISOString());
    updateCountdown();
    closeSettings();
});

// Reset Target Date to default
resetSettingsBtn.addEventListener('click', () => {
    targetDate = DEFAULT_TARGET_DATE;
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    initSettingsInput();
    updateCountdown();
    closeSettings();
});

// Initial paint
updateCountdown();

// 1Hz Update Interval
const timerInterval = setInterval(updateCountdown, 1000);

let swapIntervalId;

function toggleView() {
    detailedTimer.classList.toggle('hidden');
    simpleTimer.classList.toggle('hidden');
}

function startSwapInterval() {
    if (swapIntervalId) {
        clearInterval(swapIntervalId);
    }
    swapIntervalId = setInterval(toggleView, 15000);
}

// Start swapping automatically initially
startSwapInterval();

// Click anywhere on screen to toggle view or close settings
document.addEventListener('click', () => {
    if (!settingsPanel.classList.contains('hidden')) {
        closeSettings();
        return;
    }

    // Perform manual toggle
    toggleView();
    // Reset the 10-second automatic timer
    startSwapInterval();
});

// Multi-language translation cycling for simple label
const languages = [
    { first: 'gün', second: 'kaldı' },
    { first: 'days', second: 'left' },
    { first: 'días', second: 'quedan' },
    { first: 'hari', second: 'lagi' },
    { first: 'siku', second: 'zimebaki' },
    { first: 'أيام', second: 'متبقية' }
];
let currentLangIndex = 0;

const simpleLabel = document.getElementById('simple-label');
const simpleLabelFirst = document.getElementById('simple-label-first');
const simpleLabelSecond = document.getElementById('simple-label-second');

function rotateLanguage() {
    if (!simpleLabel || !simpleLabelFirst || !simpleLabelSecond) return;

    // Fade out simple label
    simpleLabel.classList.add('fade-out');

    // Wait for the opacity transition to finish, then change text and fade back in
    setTimeout(() => {
        currentLangIndex = (currentLangIndex + 1) % languages.length;
        const nextLang = languages[currentLangIndex];
        simpleLabelFirst.textContent = nextLang.first;
        simpleLabelSecond.textContent = nextLang.second;

        simpleLabel.classList.remove('fade-out');
    }, 300); // 300ms matches style.css transition speed
}

// Rotate language every 2.5 seconds (so all 6 languages are shown in the 15s window)
setInterval(rotateLanguage, 2500);

// Fullscreen Toggle Controls
const fullscreenToggle = document.getElementById('fullscreen-toggle');

function toggleFullscreen(e) {
    if (e) e.stopPropagation(); // Prevents document click toggleView from triggering
    
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch((err) => {
            console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
}

if (fullscreenToggle) {
    fullscreenToggle.addEventListener('click', toggleFullscreen);
}

// Dynamically toggle maximize/minimize icons on fullscreen state change
document.addEventListener('fullscreenchange', () => {
    if (!fullscreenToggle) return;
    if (document.fullscreenElement) {
        fullscreenToggle.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-minimize">
                <path d="M8 3v3a2 2 0 0 1-2 2H3"/>
                <path d="M21 8h-3a2 2 0 0 1-2-2V3"/>
                <path d="M3 16h3a2 2 0 0 1 2 2v3"/>
                <path d="M16 21v-3a2 2 0 0 1 2-2h3"/>
            </svg>
        `;
    } else {
        fullscreenToggle.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-maximize">
                <path d="M8 3H5a2 2 0 0 0-2 2v3"/>
                <path d="M21 8V5a2 2 0 0 0-2-2h-3"/>
                <path d="M3 16v3a2 2 0 0 0 2 2h3"/>
                <path d="M16 21h3a2 2 0 0 0 2-2v-3"/>
            </svg>
        `;
    }
});

