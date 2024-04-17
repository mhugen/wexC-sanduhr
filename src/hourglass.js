const getHourglass = () => document.querySelector('#hourglass_drag');
const getTubes = () => document.querySelectorAll('.tube_drag');
let hourglassTurned = false;

const getDurationField = () => document.querySelector('#dauer');

document.addEventListener('DOMContentLoaded', () => {
    getDurationField().value = null;

    //drag event listener for tubes
    getTubes().forEach((tube) => {
        tube.addEventListener('dragstart', (event) => {
            event.dataTransfer.setData('text/plain', tube.dataset.duration);
        });
    });

    const hourglass = getHourglass();

    //drag event listener for hourglass
    hourglass.addEventListener('dragstart', (event) => {
        event.dataTransfer.setData('text/plain', hourglass.dataset.duration);
    });

    //click event listener to pause hourglass if on right side
    hourglass.addEventListener('click', pauseHourglass);

    //power user buttons to add or subtract to/from duration
    document.querySelector('#plus').addEventListener('click', addFiveMins)
    document.querySelector('#minus').addEventListener('click', subtractFiveMins)

    //set duration to 0 when input field looses focus, if duration < 0 or duration === NaN
    getDurationField().addEventListener('blur', (e) => {
        const num = parseInt(e.target.value);
        if (isNaN(num) || num < 0){
            e.target.value = 0;
        }
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
    const draggedElement = document.querySelector(`[data-duration="${data}"]`)
    const dropZoneRight = document.querySelector('#drop-zone-right');
    const dropZoneLeft = document.querySelector('#drop-zone-left');

    if (draggedElement.classList.contains('tube_drag')) {
        const duration = draggedElement.getAttribute('data-duration');
        const durationAsNumber = parseInt(duration, 10);
        const currentDurationValue = getDurationField().value === "" ? 0 : parseInt(getDurationField().value, 10);

        getDurationField().value = currentDurationValue + durationAsNumber;
    } else if (draggedElement.id === 'hourglass_drag') {
        if (dropZoneRight.contains(draggedElement)) {
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
            dropZoneRight.appendChild(draggedElement)
        }
    }
};

const addFiveMins = () => {
    const currentDurationValue = getDurationField().value === "" ? 0 : parseInt(getDurationField().value, 10);
    getDurationField().value = currentDurationValue + 5;
}

const subtractFiveMins = () => {
    const currentDurationValue = getDurationField().value === "" ? 0 : parseInt(getDurationField().value, 10);
    if(currentDurationValue !== 0) {
        getDurationField().value = currentDurationValue - 5;
    }
}

const pauseHourglass = (e) => {
    const dropZoneRight = document.getElementById('drop-zone-right');
    if (dropZoneRight.contains(e.target)) {
        if(hourglassTurned === false){
            e.currentTarget.style.transform = "rotate(90deg)"
            hourglassTurned = true;
        } else {
            e.currentTarget.style.transform = "rotate(0deg)"
            hourglassTurned = false;
        }
    }
}