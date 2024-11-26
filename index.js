const notifier = require("node-notifier");
const moment = require("moment");
const argTime = process.argv.slice(2);

const POMODORO_DURATION = parseInt(argTime[0]) || 1;
const BREAK_DURATION = parseInt(argTime[1]) || 1;

let isWorking = true;
let remainingTime = 0;
let timer = null;

function formatTime(totalSeconds) {
    const duration = moment.duration(totalSeconds, "seconds");
    const hours = duration.hours().toString().padStart(2, "0");
    const minutes = duration.minutes().toString().padStart(2, "0");
    const seconds = duration.seconds().toString().padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
}

function startTimer(duration) {
    remainingTime = duration * 60;

    timer = setInterval(() => {
        remainingTime--;

        const formattedTime = formatTime(remainingTime);
        console.log(`${isWorking ? "Working" : "Break"}: ${formattedTime}`);

        if (remainingTime <= 0) {
            clearInterval(timer);

            notifier.notify({
                title: isWorking ? "Break Time" : "Work Time",
                message: isWorking
                    ? "Enjoy your break!"
                    : "Good work! Time to get back.",
                sound: true,
            });

            isWorking = !isWorking;
            startTimer(isWorking ? POMODORO_DURATION : BREAK_DURATION);
        }
    }, 1000);
}

if (!argTime[0] || !argTime[1]) {
    console.log(
        "Usage: node timer.js <pomodoro_duration_minutes> <break_duration_minutes>"
    );
} else {
    startTimer(POMODORO_DURATION);
}
