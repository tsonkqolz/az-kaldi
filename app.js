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

// DOM Elements - Countdown units
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');

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

// Click outside the settings panel should close it
document.addEventListener('click', () => {
    closeSettings();
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

