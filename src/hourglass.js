/**
 * global getter functions for dom elements
 * @returns {Element}
 */
const getHourglassDrag = () => document.querySelector('#hourglass_drag');
const getHourglassContainer = () => document.querySelector('#container');
const getTubes = () => document.querySelectorAll('.tube_drag');
const getDurationField = () => document.querySelector('#duration');
const getDurationGroup = () => document.querySelector('.duration_group');

const getStartTimeField = () => document.querySelector('#input-start-time');
const getEndTimeField = () => document.querySelector('#input-end-time');
const getTimerDisplay = () => document.querySelector('#timer_display');
const getStopButton = () => document.querySelector('#stop');
const getDropZoneLeft = () => document.querySelector('#drop-zone-left');
const getDropZoneRight = () => document.querySelector('#drop-zone-right');


/**
 * set up all event listeners
 */
document.addEventListener('DOMContentLoaded', () => {
    getDurationField().value = null;
    timeInterval();
    rotateElement(getHourglassContainer(), 180);


    //drag event listener for tubes
    getTubes().forEach((tube) => {
        tube.addEventListener('dragstart', (event) => {
            event.dataTransfer.setData('text/plain', tube.dataset.duration);
        });
    });

    //drag event listener for hourglass
    getHourglassDrag().addEventListener('dragstart', (event) => {
        event.dataTransfer.setData('text/plain', getHourglassDrag().dataset.duration);
    });

    //power user buttons to add or subtract to/from duration
    document.querySelector('#plus').addEventListener('click', addFiveMin)
    document.querySelector('#minus').addEventListener('click', subtractFiveMin)

    //set duration to 0 when input field looses focus, if duration < 0 or duration === NaN
    getDurationField().addEventListener('blur', (e) => {
        const num = parseInt(e.target.value);
        if (isNaN(num) || num < 0) {
            e.target.value = 0;
        }
    });

    //Eventlisteners regarding input validation and formatting
    getStartTimeField().addEventListener('change', (e) => {
        const validatedTime = validateTimeAndFormat(e.target.value)
        if(validatedTime) {
            e.target.value = validatedTime;
            if (getDurationField().value) {
                calculateEndTime();
            }
        } else {
            e.target.value = '';
        }
    });

    getEndTimeField().addEventListener('change', (e) => {
        const validatedTime = validateTimeAndFormat(e.target.value);
        if(validatedTime) {
            e.target.value = validatedTime;
            if (getDurationField().value) {
                calculateStartTime();
            }
        } else {
            e.target.value = '';
        }
    });

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
    getStopButton().addEventListener('click', resetTimer);
    getStopButton().style.display = "none";
});

/**
 * Drag and drop functionality for tubes (to set duration)
 * and the hourglass (to set the timer)
 * @param e
 */
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

    if (draggedElement.classList.contains('tube_drag')) {
        const duration = draggedElement.getAttribute('data-duration');
        const durationAsNumber = parseInt(duration, 10);
        const currentDurationValue = getDurationField().value === "" ? 0 : parseInt(getDurationField().value, 10);
        setDurationValue(currentDurationValue + durationAsNumber);
    } else if (draggedElement.id === 'hourglass_drag') {
        if (getDropZoneRight().contains(draggedElement) && !isRunning) {
            resetHourglass();
        } else {
            getDropZoneRight().appendChild(draggedElement)
            getTimerDisplay().innerHTML = formatDuration(getDurationField().value * 60);
        }
    }
};

/**
 * formats current duration as String of the form HH:MM:SS
 * @returns {`${string|number}:${string|number}:${string|number}`}
 */
const formatDuration = (durationInSeconds) => {
    let hours = Math.floor(durationInSeconds / 3600);
    let minutes = Math.floor((durationInSeconds % 3600) / 60);
    let seconds = durationInSeconds % 60;

    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    return `${hours}:${minutes}:${seconds}`
}

const setDurationValue = (newDurationValue) => {
    getDurationField().value = newDurationValue;
    getDurationField().dispatchEvent(new Event("change"))
    if (getDropZoneRight().contains(getHourglassDrag())) {
        timeInSeconds = getDurationField().value * 60;
        updateCountdownDisplay();
    }
}

/**
 * Power user buttons for duration
 */
const addFiveMin = () => {
    const currentDurationValue = getDurationField().value === "" ? 0 : parseInt(getDurationField().value);
    setDurationValue(currentDurationValue + 5);
}

const subtractFiveMin = () => {
    const currentDurationValue = getDurationField().value === "" ? 0 : parseInt(getDurationField().value);
    currentDurationValue > 1 ? setDurationValue(currentDurationValue - 5) : setDurationValue(0);
}

/**
 *  start the timer when starting time arrives
 *  and stop it as soon as the end time is reached
 *  rotate hourglass during the time it's running
 ***/

let isRunning = false;
let animationTimeouts = [];
let rotDegrees = 0;
let timeInSeconds = null;
let animationInterval = null;

const timeInterval = () => setInterval(() => {
    compareCurrentTime()
    if (isRunning) {
        updateCountdownDisplay();
        timeInSeconds--;
    }
}, 1000);

const compareCurrentTime = () => {
    const currentTime = new Date().toLocaleString([], {hour: '2-digit', minute: '2-digit'}).replace(':', '');
    const startTime = getStartTimeField().value.replace(':', '');
    const endTime = getEndTimeField().value.replace(':', '');
    let differenceStart = startTime - currentTime;
    let differenceEnd = endTime - currentTime;
    if (!isRunning && differenceStart === 0 && getDropZoneRight().contains(getHourglassDrag()) && getDurationField().value > 0) {
        isRunning = true;
        rotDegrees = 0;
        rotateElement(getHourglassContainer(), rotDegrees);
        animateHourglass();
        animationInterval = setInterval(() => {
            animateHourglass();
        }, 28000);
        timeInSeconds = getDurationField().value * 60;
        getStopButton().style.display = "block";
        getDurationGroup().style.display = "none";
    } else if (differenceEnd === 0) {
        resetTimer();
    }
}

const animateHourglass = () => {
    animationTimeouts = [
        ...Array(10).fill(0).map((_, i) => [
            setTimeout(() => {
                const grain1 = document.querySelector(`.g${i}`)
                const grain2 = document.querySelector(`.g1${i}`)
                toggle(grain1, grain2);
            }, i * 1000),
        ]),
        ...Array(10).fill(0).map((_, i) => [
            setTimeout(() => {
                const grain1 = document.querySelector(`.g${i}`)
                const grain2 = document.querySelector(`.g1${i}`)
                toggle(grain1, grain2);
            }, 14000 + (i * 1000)),
        ]),
        ...Array(4).fill(0).map((_, i) => setTimeout(() => {
            rotDegrees = rotDegrees + 45;
            console.log(rotDegrees);
            rotateElement(getHourglassContainer(), rotDegrees)
        }, 10000 + i * 1000)),
        ...Array(4).fill(0).map((_, i) => setTimeout(() => {
            rotDegrees = rotDegrees + 45;
            console.log(rotDegrees);
            rotateElement(getHourglassContainer(), rotDegrees)
        }, 24000 + i * 1000))
    ]
}

const toggle = (...grains) => {
    grains.forEach((grain) => grain.classList.toggle("hide"));
}

const rotateElement = (domElement, degrees) => {
    domElement.style.transform = 'rotate(' + degrees + 'deg)';
}

/**
 * Count down when timer is running
 *
 * */
const updateCountdownDisplay = () => {
    getTimerDisplay().textContent = formatDuration(timeInSeconds);
};


/**
 * reset all the things
 */
const resetTimer = () => {
    animationTimeouts.forEach((timeout) => clearTimeout(timeout));
    isRunning = false;
    rotDegrees = 180;
    rotateElement(getHourglassContainer(), rotDegrees)
    clearInterval(animationInterval);
    getStopButton().style.display = "none";
    resetHourglass();
    getDurationGroup().style.display = "flex";
    resetGrains();
}

const resetGrains = () => {
    for(let i = 0; i< 10; i++) {
        document.querySelector(`.g${i}`)?.classList.add('hide');
        document.querySelector(`.g1${i}`)?.classList.remove('hide');
    }
}

const resetHourglass = () => {
    const hourglass = getHourglassDrag();
    getDropZoneRight().removeChild(hourglass);
    getDropZoneLeft().appendChild(hourglass);
    getTimerDisplay().innerHTML = null;
}

/**
 *  use duration to calculate endtime accordingly
 */
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

const validateTimeAndFormat = (value) => {
    const parts = value.split(':');
    const hours = parseInt(parts[0]);

    if(!isNaN(hours) && hours >= 0 && hours < 24) {
        if(parts.length > 1) {
            const minutes = parseInt(parts[1]);
            if(!isNaN(minutes) && minutes >= 0 && minutes < 60) {
                return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;
            } else {
                return '';
            }
        }
        return `${hours < 10 ? '0' + hours : hours}:00`;
    }
    return 0;
}



