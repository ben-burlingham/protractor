Protractor.Marker = function({ radius, deg }) {
    const x = Math.cos(deg * Math.PI / 180);
    const y = Math.sin(deg * Math.PI / 180);

    const div = document.createElement('div');
    div.className = "protractor-marker";

    div.style.left = `${50 + x * 50}%`;
    div.style.top = `${50 + y * 50}%`;
    div.style.transform = `rotate(${deg - 90}deg)`

    return div;
};
