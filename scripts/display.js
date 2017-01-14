Protractor.Display = function({ move }) {
    function dragstart (evt) {
        document.body.addEventListener('mousemove', move);
    }

    function dragend(evt) {
        document.body.removeEventListener('mousemove', move);
    }

    const div = document.createElement('div');
    div.className = "protractor-display";
    div.innerHTML = "999.999 rad"
    div.addEventListener('mousedown', dragstart);
    document.body.addEventListener('mouseup', dragend);

    return div;
};
