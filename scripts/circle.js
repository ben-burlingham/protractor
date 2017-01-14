Protractor.Circle = function({ move, radius }) {
    function dragstart (evt) {
        evt.preventDefault();
        document.body.addEventListener('mousemove', move);
    }

    function dragend(evt) {
        evt.preventDefault();
        document.body.removeEventListener('mousemove', move);
    }

    const div = document.createElement('div');
    div.className = "protractor-circle";
    div.style.borderRadius = radius + 'px';
    div.addEventListener('mousedown', dragstart);
    document.body.addEventListener('mouseup', dragend);
    document.body.addEventListener('mouseenter', dragend);

    return div;
};
