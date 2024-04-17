const getHourglasses = () => document.querySelectorAll('.draggable');
const getHourglassImg = () => document.querySelectorAll('.hourglass');
let hourglassTurned = false;

document.addEventListener('DOMContentLoaded', () => {
    getHourglasses().forEach((hourglass) => {
        hourglass.addEventListener('dragstart', (event) => {
            event.dataTransfer.setData('text/plain', hourglass.dataset.duration);
        });
    });

    getHourglassImg().forEach((img) => {
        img.addEventListener('click', rotateHourglass)
    })
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
    const draggedHourglass = document.querySelector(`[data-duration="${data}"]`)
    const dropZoneRight = document.getElementById('drop-zone-right');
    const dropZoneLeft = document.getElementById('drop-zone-left');

    if (dropZoneRight.contains(draggedHourglass)) {
        //Sanduhr von rechts nach links zurück ziehen
        const existingElement = dropZoneRight.childNodes[1];
        if (hourglassTurned) {
            existingElement.childNodes[1].style.transform = "rotate(0deg)"
            hourglassTurned = false;
        }
        dropZoneRight.removeChild(existingElement);
        dropZoneLeft.appendChild(existingElement);
    } else {
        if (dropZoneRight.childNodes.length > 1) {
            //existierende Sanduhr rechts entfernen, links hinzufügen (falls rechts schon eine ist)
            const existingElement = dropZoneRight.childNodes[1];
            dropZoneRight.removeChild(existingElement);
            dropZoneLeft.appendChild(existingElement);
        }
        dropZoneRight.appendChild(draggedHourglass)
    }
};

const rotateHourglass = (e) => {
    const dropZoneRight = document.getElementById('drop-zone-right');
    if (dropZoneRight.contains(e.target)) {
        if (hourglassTurned === false) {
            e.target.style.transform = "rotate(90deg)"
            hourglassTurned = true;
        } else {
            e.target.style.transform = "rotate(0deg)"
            hourglassTurned = false;
        }
    }
}


const enterDuration = (e) => {
    if (e.key !== "Enter") {
        return;
    }
    if (validateDuration) {
        console.log("Enter key pressed", e)
    } else {
        return false;
    }
}

const validateDuration = () => {
    return true;
}

const validateStarttime = () => {
    return true;
}


document.addEventListener('DOMContentLoaded', (event) => {
    var startTimeValue = document.querySelector('#input-start-time');
    var endTimeValue = document.querySelector('#input-end-time');
    var durationValue = document.getElementById('duration');


    const calculateEndTime = (startTimeValue, durationValue) => {

        var [hours, minutes] = startTimeValue.value.split(':').map(Number);

        const {calcHours, calcMinutes} = calcHoursAndMinutes(durationValue);

        var endMinutes = minutes + calcMinutes;
        var endHours = hours + calcHours;

        if (endMinutes >= 60) {
            endHours += Math.floor(endMinutes / 60);
        }
        endMinutes = endMinutes % 60;
        endHours %= 24;

        var endTime = `${endHours}:${endMinutes}`
        var paddedEndTime = endTime.split(':').map(e => `0${e}`.slice(-2)).join(':')

        setEndTime(paddedEndTime);
        return paddedEndTime;

    }

    const calculateStartTime = (endTimeValue, durationValue) => {
        var [hours, minutes] = endTimeValue.value.split(':').map(Number);

        const {calcHours, calcMinutes} = calcHoursAndMinutes(durationValue);

        var startMinutes = minutes - calcMinutes;
        var startHours = hours - calcHours;

        if (startMinutes >= 60) {
            startHours -= 1;
            startMinutes += 60;
        }

        if (startMinutes < 0) {
            startHours -= 1;
            startMinutes += 60;
        }

        startHours = (startHours + 24) % 24;

        var startTime = `${startHours}:${startMinutes}`
        var paddedStartTime = startTime.split(':').map(e => `0${e}`.slice(-2)).join(':')

        setStartTime(paddedStartTime);

        return paddedStartTime;
    }


    const  calcHoursAndMinutes = (durationValue) => {
        const calcHours = Math.floor(durationValue / 60);
        const calcMinutes = durationValue % 60;
        return {calcHours, calcMinutes};
    }

    function setStartTime(paddedStartTime) {
        document.getElementById("input-start-time").value = paddedStartTime;
    }

    function setEndTime(paddedEndTime) {
        document.getElementById("input-end-time").value = paddedEndTime;
    }

    //EventListeners
    startTimeValue.addEventListener('change', () => {
        if (startTimeValue.value && durationValue) {
            calculateEndTime(startTimeValue, durationValue);
        }
    });

    endTimeValue.addEventListener('change', () => {
        if (endTimeValue.value && durationValue) {
            calculateStartTime(endTimeValue, durationValue);
        }
    });

    durationValue.addEventListener('change', updateValue);

    function updateValue(e) {
        durationValue = e.target.value;

        if (startTimeValue.value) {
            calculateEndTime(startTimeValue, durationValue);
        } else if (endTimeValue.value) {
            calculateStartTime(endTimeValue, durationValue);
        }
    }
});



