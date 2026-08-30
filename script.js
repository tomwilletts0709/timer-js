

let timerInterval;

const countdownDisplay = document.getElementById("countdownDisplay")

function startTimer() { 
    clearInterval(timerInterval);

    endtime = Date.now()
    remainingonPause = null;

    countdown(); 
    timerInterval = setInterval(countdown, 1000);

    function countdown() { 
        const remaining = Math.max(0 , endtime );
        updateDisplay = remaining();

        if (remaining === 0) {
            clearInterval(timerInterval);
        } else 
    }
}