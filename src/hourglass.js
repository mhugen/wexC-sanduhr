// JavaScript code goes here
document.addEventListener('DOMContentLoaded', (event) => {
    const hourglass = document.getElementById('sanduhr-bild');
    const grid = document.getElementById('running');

    hourglass.addEventListener('dragstart', (event) => {
        event.dataTransfer.setData('text/plain', 'hourglass');
    });

    window.allowDrop = function(event) {
        event.preventDefault();
    };

    window.drop = function(event) {
        event.preventDefault();
        const data = event.dataTransfer.getData('text');
        if (data === 'hourglass') {
            event.target.appendChild(hourglass);
        }
    };
});
