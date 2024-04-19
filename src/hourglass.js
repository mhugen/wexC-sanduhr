//global getter functions
const getHourglassDrag = () => document.querySelector('#hourglass_drag');
const getHourglass = () => document.querySelector('#hourglass');
const getTubes = () => document.querySelectorAll('.tube_drag');
let hourglassPaused = false;
const getDurationField = () => document.querySelector('#duration');

const getStartTimeField = () => document.querySelector('#input-start-time');
const getEndTimeField = () => document.querySelector('#input-end-time');

//event listeners
document.addEventListener('DOMContentLoaded', () => {
    getDurationField().value = null;
    intervalBefore();

    //drag event listener for tubes
    getTubes().forEach((tube) => {
        tube.addEventListener('dragstart', (event) => {
            event.dataTransfer.setData('text/plain', tube.dataset.duration);
        });
    });

    const hourglassDrag = getHourglassDrag();

    //drag event listener for hourglass
    hourglassDrag.addEventListener('dragstart', (event) => {
        event.dataTransfer.setData('text/plain', hourglassDrag.dataset.duration);
    });

    //click event listener to pause hourglass if on right side
    hourglassDrag.addEventListener('click', pauseHourglass);

    //power user buttons to add or subtract to/from duration
    document.querySelector('#plus').addEventListener('click', addFiveMins)
    document.querySelector('#minus').addEventListener('click', subtractFiveMins)

    //set duration to 0 when input field looses focus, if duration < 0 or duration === NaN
    getDurationField().addEventListener('blur', (e) => {
        const num = parseInt(e.target.value);
        if (isNaN(num) || num < 0) {
            e.target.value = 0;
        }
    })

    //Eventlisteners regarding calculating and setting duration and time
    getStartTimeField().addEventListener('change', () => {
        if (getStartTimeField().value && getDurationField().value) {
            calculateEndTime();
        }
    });

    getEndTimeField().addEventListener('change', () => {
        if (getEndTimeField().value && getDurationField().value) {
            calculateStartTime();
        }
    });

    getDurationField().addEventListener('change', updateTime);

});

// eslint-disable-next-line no-unused-vars
const dragoverHandler = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
};

// eslint-disable-next-line no-unused-vars
const dropHandler = (e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('text');
    const draggedElement = document.querySelector(`[data-duration="${data}"]`)
    const dropZoneRight = document.querySelector('#drop-zone-right');
    const dropZoneLeft = document.querySelector('#drop-zone-left');

    if (draggedElement.classList.contains('tube_drag')) {
        const duration = draggedElement.getAttribute('data-duration');
        const durationAsNumber = parseInt(duration, 10);
        const currentDurationValue = getDurationField().value === "" ? 0 : parseInt(getDurationField().value, 10);
        setDurationValue(currentDurationValue + durationAsNumber);
    } else if (draggedElement.id === 'hourglass_drag') {
        if (dropZoneRight.contains(draggedElement)) {
            //Sanduhr von rechts nach links zurück ziehen
            const existingElement = dropZoneRight.childNodes[1];
            if (hourglassPaused) {
                existingElement.childNodes[1].style.transform = "rotate(0deg)"
                hourglassPaused = false;
            }
            dropZoneRight.removeChild(existingElement);
            dropZoneLeft.appendChild(existingElement);
            document.querySelector('#timer_display').innerHTML = null;
        } else {
            if (dropZoneRight.childNodes.length > 1) {
                //existierende Sanduhr rechts entfernen, links hinzufügen (falls rechts schon eine ist)
                const existingElement = dropZoneRight.childNodes[1];
                dropZoneRight.removeChild(existingElement);
                dropZoneLeft.appendChild(existingElement);
            }
            dropZoneRight.appendChild(draggedElement)
            const duration = getDurationField().value;
            const durationFormatted = () => {
                let durationInSeconds = duration * 60;
                let hours = Math.floor(durationInSeconds / 3600);
                let minutes = Math.floor((durationInSeconds % 3600) / 60);
                let seconds = durationInSeconds % 60;

                hours = hours < 10 ? '0' + hours : hours;
                minutes = minutes < 10 ? '0' + minutes : minutes;
                seconds = seconds < 10 ? '0' + seconds : seconds;

                return `${hours}:${minutes}:${seconds}`

            }
            document.querySelector('#timer_display').innerHTML = durationFormatted();
        }
    }
};


const compareCurrentAndStarttime = () => {
    const currentTime = new Date().toLocaleString([], {hour: '2-digit', minute: '2-digit'}).replace(':', '');
    const startTime = getStartTimeField().value.replace(':', '');
    let difference = startTime - currentTime;
    if (difference === 0) {
        startHourglass();
        clearInterval(intervalBefore);
        intervalDuring();
        startCountdown();
    }
}

const compareCurrentAndEndtime = () => {
    const currentTime = new Date().toLocaleString([], {hour: '2-digit', minute: '2-digit'}).replace(':', '');
    const endTime = getEndTimeField().value.replace(':', '');
    let difference = endTime - currentTime;
    if (difference === 0) {
        clearInterval(intervalDuring);
        intervalBefore();
        return true;
    }
    return false;
}

const intervalBefore = () => setInterval(compareCurrentAndStarttime, 1000);
const intervalDuring = () => setInterval(compareCurrentAndEndtime, 1000);

const startHourglass = () => {
    console.log("timer started!");
    const dropZoneRight = document.querySelector('#drop-zone-right');
    if (dropZoneRight.contains(getHourglassDrag())) {
        const interval = setInterval(() => {
            if (!compareCurrentAndEndtime()) {
                rotateHourglass();

            } else {
                clearInterval(interval);
            }
        }, 1000)
    }
}

const rotateHourglass = () => {
    let rotation = 0;
}

const setDurationValue = (newDurationValue) => {
    getDurationField().value = newDurationValue;
    getDurationField().dispatchEvent(new Event("change"))
}

const addFiveMins = () => {
    const currentDurationValue = getDurationField().value === "" ? 0 : parseInt(getDurationField().value);
    setDurationValue(currentDurationValue + 5);
}

const subtractFiveMins = () => {
    const currentDurationValue = getDurationField().value === "" ? 0 : parseInt(getDurationField().value);
    if (currentDurationValue !== 0) {
        setDurationValue(currentDurationValue - 5);
    }
}

const pauseHourglass = (e) => {
    const dropZoneRight = document.getElementById('drop-zone-right');
    if (dropZoneRight.contains(e.target)) {
        if (hourglassPaused === false) {
            e.currentTarget.style.transform = "rotate(90deg)"
            hourglassPaused = true;
        } else {
            e.currentTarget.style.transform = "rotate(0deg)"
            hourglassPaused = false;
        }
    }
}
const calculateEndTime = () => {
    const startTime = getStartTimeField().value;
    const duration = getDurationField().value;
    const [hours, minutes] = startTime.split(':').map(Number);
    const {calcHours, calcMinutes} = calcHoursAndMinutes(duration);
    let endMinutes = minutes + calcMinutes;
    let endHours = hours + calcHours;

    if (endMinutes >= 60) {
        endHours += Math.floor(endMinutes / 60);
    }
    endMinutes = endMinutes % 60;
    endHours %= 24;

    const endTime = `${endHours}:${endMinutes}`
    const paddedEndTime = endTime.split(':').map(e => `0${e}`.slice(-2)).join(':')

    getEndTimeField().value = paddedEndTime; //set Endtime

}

const calculateStartTime = () => {
    const endTime = getEndTimeField().value;
    const duration = getDurationField().value;
    const [hours, minutes] = endTime.split(':').map(Number);
    const {calcHours, calcMinutes} = calcHoursAndMinutes(duration);
    let startMinutes = minutes - calcMinutes;
    let startHours = hours - calcHours;

    if (startMinutes >= 60) {
        startHours -= 1;
        startMinutes += 60;
    }

    if (startMinutes < 0) {
        startHours -= 1;
        startMinutes += 60;
    }
    startHours = (startHours + 24) % 24;
    const startTime = `${startHours}:${startMinutes}`
    const paddedStartTime = startTime.split(':').map(e => `0${e}`.slice(-2)).join(':')
    getStartTimeField().value = paddedStartTime; //set Starttime
}

const calcHoursAndMinutes = (durationValue) => {
    const calcHours = Math.floor(durationValue / 60);
    const calcMinutes = durationValue % 60;
    return {calcHours, calcMinutes};
}

const updateTime = (e) => {
    if (getStartTimeField().value) {
        calculateEndTime();
    } else if (getEndTimeField().value) {
        calculateStartTime();
    }
}

const startCountdown = () => {
    const totalMinutes = getDurationField().value;
    const display = document.querySelector('#timer_display');
    startTimer(totalMinutes, display);
}


const startTimer = (totalMinutes, display) => {
    let timeInSeconds = totalMinutes * 60;
    const updateDisplay = () => {
        let hours = Math.floor(timeInSeconds / 3600);
        let minutes = Math.floor((timeInSeconds % 3600) / 60);
        let seconds = timeInSeconds % 60;

        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;

        display.textContent = `${hours}:${minutes}:${seconds}`;

        if (timeInSeconds < 0) {
            display.innerHTML = "00:00:00";
            clearInterval(timerInterval)
        }
    };

    updateDisplay();

    const timerInterval = setInterval(() => {
        timeInSeconds--;
        updateDisplay();
    }, 1000);

}



