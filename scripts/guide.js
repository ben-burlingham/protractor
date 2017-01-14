Protractor.Guide = function(i, radius) {
    const div = document.createElement('div');
    div.className = "protractor-guide";

    if (i === 1) {
        div.style.transform = "rotate(180deg)";
    }

    return div;
};
