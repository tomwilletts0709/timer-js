let timerInterval;
let endtime; 
let remainingonPause;

let focus_ms = 25 * 60 * 1000

const countdownDisplay = document.getElementById("countdownDisplay")

function startTimer() { 
    clearInterval(timerInterval);

    endtime = Date.now() + (remainingonPause ?? focus_ms)
    remainingonPause = null;

    countdown(); 
    timerInterval = setInterval(countdown, 1000);

    function countdown() { 
        const remaining = Math.max(0, endtime - Date.now());
        updateDisplay(remaining);

        if (remaining === 0) {
            clearInterval(timerInterval);
        }  
    }
}

function updateDisplay(ms) {
  const totalSeconds = Math.ceil(ms / 1000);
  const mins = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const secs = String(totalSeconds % 60).padStart(2, "0");
  countdownDisplay.textContent = `${mins}:${secs}`;
}

function stopTimer() {
        clearInterval(timerInterval);
        remainingonPause = endtime - Date.now();
    }