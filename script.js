const Mode = Object.freeze({
    FOCUS:'focus',
    SHORT_BREAK: 'shortBreak',
    LONG_BREAK: 'longBreak',
})

const Status = Object.freeze({
    RUNNING: "running",
    PAUSED: "paused",
})

let state = { mode: Mode.FOCUS, status: Status.PAUSED, round: 1 };
let timerInterval;
let endtime;
let remainingonPause;

let focus_ms = 25 * 60 * 1000
let shortBreak_ms = 5 * 60 * 1000
let longBreak_ms = 15 * 60 * 1000

const DURATIONS = {
    [Mode.FOCUS]: focus_ms,
    [Mode.SHORT_BREAK]: shortBreak_ms,
    [Mode.LONG_BREAK]: longBreak_ms,
}

const countdownDisplay = document.getElementById("timerDisplay")

const progressRingCircle = document.querySelector(".progess-ring__circle")
const ringRadius = progressRingCircle.r.baseVal.value
const ringCircumference = 2 * Math.PI * ringRadius
progressRingCircle.style.strokeDasharray = `${ringCircumference} ${ringCircumference}`

let phaseDuration = DURATIONS[state.mode];

function startTimer() {
    clearInterval(timerInterval);

    if (remainingonPause == null) {
        phaseDuration = DURATIONS[state.mode];
    }
    endtime = Date.now() + (remainingonPause ?? phaseDuration)
    remainingonPause = null;
    setState({ status: Status.RUNNING });

    countdown();
    timerInterval = setInterval(countdown, 1000);

    function countdown() {
        const remaining = Math.max(0, endtime - Date.now());
        updateDisplay(remaining);
        updateRing(remaining);

        if (remaining === 0) {
            clearInterval(timerInterval);
            transition();
            startTimer();
        }
    }
}

function updateDisplay(ms) {
  const totalSeconds = Math.ceil(ms / 1000);
  const mins = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const secs = String(totalSeconds % 60).padStart(2, "0");
  countdownDisplay.textContent = `${mins}:${secs}`;
}

function updateRing(ms) {
    const fractionRemaining = ms / phaseDuration;
    progressRingCircle.style.strokeDashoffset = ringCircumference * (1 - fractionRemaining);
}

function stopTimer() {
    clearInterval(timerInterval);
    remainingonPause = endtime - Date.now();
    setState({ status: Status.PAUSED });
}



function transition () {
    const { mode, round } = state; 

    if (mode === Mode.FOCUS) {
        const nextRound = round + 1;
        const nextMode = nextRound % 4 === 0 ? Mode.LONG_BREAK : Mode.SHORT_BREAK;
        setState({ mode: nextMode, status: Status.RUNNING, round: nextRound })
    } else if (mode === Mode.SHORT_BREAK || mode === Mode.LONG_BREAK) {
        setState({ mode: Mode.FOCUS, status: Status.RUNNING, round })
    }
}

function setState(newState) {
    state = { ...state, ...newState };
    render(state)
}

function render(state) {
    document.body.dataset.mode = state.mode;
    document.body.dataset.status = state.status;
}