const getHourglass = () => document.getElementById('draggable');
const getTime = () => document.getElementsByClassName('time');

document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementsByClassName('dropZone');

    getHourglass().addEventListener('dragstart', (event) => {
        event.dataTransfer.setData('text/plain', 'hourglass');
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
    if (data === 'hourglass') {
        e.target.appendChild(getHourglass());
    }
};

const enterDuration = (e) => {
    if (e.key !== "Enter") {
        return;
    }
    if (validateDuration) {
        console.log("Enter key pressed", e)
        document.getElementById('time').innerText = document.getElementById('dauer').value
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