const getHourglass = () => document.getElementById('sanduhr-bild');

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
