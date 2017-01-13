Protractor.Handle = function(i) {
    const div = document.createElement('div');
    div.className = `protractor-resize-handle protractor-resize-handle-${i}`;
    return div;
};
