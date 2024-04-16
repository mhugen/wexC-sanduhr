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
    var durationValue = document.getElementById('duration').value;


//TODO: duration muss von der Sanduhr weitergegeben werden
    function calculateEndTime(startTimeValue, durationValue) {

        var [hours, minutes] = startTimeValue.value.split(':').map(Number);

        console.log(hours)
        console.log(minutes)

        const {calcHours, calcMinutes} = calcHoursAndMinutes(durationValue);

        var endMinutes = minutes + calcMinutes;
        var endHours = hours + calcHours;

        if (endMinutes >= 60) {
            endHours += Math.floor(endMinutes / 60);
        } else {
            endMinutes % 60;
        }

        endHours %= 24;


        var endTime = `${endHours}:${endMinutes}`

        console.log(endTime)

        setEndTime(endTime);

        return endTime;

    }

    function calculateStartTime(endTimeValue, durationValue) {
        var [hours, minutes] = endTimeValue.value.split(':').map(Number);

        console.log(hours)
        console.log(minutes)

        const {calcHours, calcMinutes} = calcHoursAndMinutes(durationValue);

        var startMinutes = minutes - calcMinutes;
        var startHours = hours - calcHours;

        if (startMinutes >= 60) {
            startHours += Math.floor(startMinutes / 60);
        } else {
            startMinutes % 60;
        }

        startHours %= 24;


        var startTime = `${startHours}:${startMinutes}`

        console.log(startTime)

        setStartTime(startTime);

        return startTime;
    }


    function calcHoursAndMinutes(durationValue) {
        const calcHours = Math.floor(durationValue / 60);
        const calcMinutes = durationValue % 60;

        console.log(calcHours)
        console.log(calcMinutes)

        return {calcHours, calcMinutes};
    }

    function setStartTime(startTime) {
        document.getElementById("input-start-time").value = startTime;
    }

    function setEndTime(endTime) {
        document.getElementById("input-end-time").value = endTime;

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

});



