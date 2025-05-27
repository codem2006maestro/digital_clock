// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

function setTheme(isDark) {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    themeToggle.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Check for saved theme preference or use system preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    setTheme(savedTheme === 'dark');
} else {
    setTheme(prefersDarkScheme.matches);
}

// Toggle theme on button click
themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    setTheme(!isDark);
});

// Listen for system theme changes
prefersDarkScheme.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        setTheme(e.matches);
    }
});

// Digital Clock
function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    
    const clockDisplay = document.getElementById('clock');
    clockDisplay.innerHTML = `${hours}:${minutes}:${seconds} <span>${ampm}</span>`;
}

// Update clock every second
setInterval(updateClock, 1000);
updateClock(); // Initial call

// Timer functionality
let timerInterval;
let timeLeft = 0;
const timerSound = document.getElementById('timerSound');
const timerStatus = document.getElementById('timerStatus');
let alarmInterval;

// Generate bell sound
function generateBellSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // A5 note
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    
    // Create a bell-like envelope
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.5);
}

function startAlarm() {
    // Play initial sound
    generateBellSound();
    
    // Set up interval to play sound every second for 10 seconds
    let secondsLeft = 10;
    alarmInterval = setInterval(() => {
        if (secondsLeft > 0) {
            generateBellSound();
            secondsLeft--;
        } else {
            clearInterval(alarmInterval);
        }
    }, 1000);
}

function stopAlarm() {
    if (alarmInterval) {
        clearInterval(alarmInterval);
    }
}

function updateTimerDisplay() {
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;
    
    document.getElementById('timer').textContent = 
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function startTimer() {
    const hours = parseInt(document.getElementById('hours').value) || 0;
    const minutes = parseInt(document.getElementById('minutes').value) || 0;
    const seconds = parseInt(document.getElementById('seconds').value) || 0;
    
    timeLeft = hours * 3600 + minutes * 60 + seconds;
    
    if (timeLeft <= 0) {
        timerStatus.textContent = 'Please enter a valid time!';
        timerStatus.style.color = '#e74c3c';
        return;
    }
    
    timerStatus.textContent = '';
    timerStatus.classList.remove('completed');
    updateTimerDisplay();
    
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateTimerDisplay();
        } else {
            clearInterval(timerInterval);
            startAlarm();
            timerStatus.textContent = 'Timer Completed!';
            timerStatus.classList.add('completed');
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    stopAlarm();
    timerStatus.textContent = 'Timer Stopped';
    timerStatus.classList.remove('completed');
}

function resetTimer() {
    clearInterval(timerInterval);
    stopAlarm();
    timeLeft = 0;
    document.getElementById('hours').value = '';
    document.getElementById('minutes').value = '';
    document.getElementById('seconds').value = '';
    timerStatus.textContent = '';
    timerStatus.classList.remove('completed');
    updateTimerDisplay();
}

// Event listeners
document.getElementById('start').addEventListener('click', startTimer);
document.getElementById('stop').addEventListener('click', stopTimer);
document.getElementById('reset').addEventListener('click', resetTimer); 