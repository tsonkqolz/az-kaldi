// Minimalist Exam Countdown
// Target Date: Sunday, June 28, 2026 at 09:00 AM (local time)
const targetDate = new Date(2026, 5, 28, 9, 0, 0); 

// DOM Elements
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');

function updateCountdown() {
    const now = new Date();
    const totalDifference = targetDate - now;

    if (totalDifference <= 0) {
        // Target reached: freeze at 00:00:00:00
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minutesEl.textContent = '00';
        secondsEl.textContent = '00';
        clearInterval(timerInterval);
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

// Initial paint
updateCountdown();

// 1Hz Update Interval
const timerInterval = setInterval(updateCountdown, 1000);
