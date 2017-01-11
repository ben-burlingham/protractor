Protractor.Marker = function({ radius, deg }) {
    const x = radius * Math.cos(deg * Math.PI / 180);
    const y = radius * Math.sin(deg * Math.PI / 180);


    const div = document.createElement('div');
    div.className = "protractor-marker";

    div.style.left = `${radius + x}`;
    div.style.top = `${radius + y}`;
    // div.style.transform = `rotate(${deg - 90}deg)`

    return div;
};
