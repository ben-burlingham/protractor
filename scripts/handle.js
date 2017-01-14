Protractor.Handle = function(i, resize) {
    function dragstart (evt) {
        evt.preventDefault();
        document.body.addEventListener('mousemove', resize);
    }

    function dragend(evt) {
        evt.preventDefault();
        document.body.removeEventListener('mousemove', resize);
    }

    const div = document.createElement('div');
    div.className = `protractor-resize-handle protractor-resize-handle-${i}`;
    div.addEventListener('mousedown', dragstart);
    document.body.addEventListener('mouseup', dragend);

    return div;
};
