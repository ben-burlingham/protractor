Marker = function({ appId, deg }) {
    const div = document.createElement('div');

    // TODO settings ${appId}-marker-full
    div.className = `${appId}-marker`;
    div.style.transform = `rotate(${deg - 90}deg)`

    return div;
};
