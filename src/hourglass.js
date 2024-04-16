const getHourglass = () => document.querySelector('#hourglass_drag');
const getTubes = () => document.querySelectorAll('.tube_drag');
const getHourglassImg = () => document.querySelectorAll('.hourglass');
let hourglassTurned = false;

const getDurationField = () => document.querySelector('#dauer');

document.addEventListener('DOMContentLoaded', () => {
    getDurationField().value = null;

    getTubes().forEach((tube) => {
        tube.addEventListener('dragstart', (event) => {
            event.dataTransfer.setData('text/plain', tube.dataset.duration);
        });
        console.log(tube);
    });

    const hourglass = getHourglass();
    hourglass.addEventListener('dragstart', (event) => {
        event.dataTransfer.setData('text/plain', hourglass.dataset.duration);
    });
    console.log(hourglass)

    getHourglassImg().forEach((img) => {
        img.addEventListener('click', rotateHourglass)
    });
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

const rotateHourglass = (e) => {
    const dropZoneRight = document.getElementById('drop-zone-right');
    if (dropZoneRight.contains(e.target)) {
        if(hourglassTurned === false){
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