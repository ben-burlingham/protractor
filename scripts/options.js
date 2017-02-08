function onPrecisionChange(evt, val) {
    const precision = parseInt(evt.target.value);
    chrome.storage.sync.set({ precision });
    updateValues();
}

function onMarkerSpacingChange(evt, val) {
    const markerSpacing = parseInt(evt.target.value);
    chrome.storage.sync.set({ markerSpacing });
    updateValues();
}

function onCircleOpacityChange(evt, val) {
    const circleOpacity = parseInt(evt.target.value);
    chrome.storage.sync.set({ circleOpacity });
    updateValues();
}

function onArcOpacityChange(evt, val) {
    const arcOpacity = parseInt(evt.target.value);
    chrome.storage.sync.set({ arcOpacity });
    updateValues();
}

function updateValues() {
    chrome.storage.sync.get({
        arcOpacity: 80,
        circleOpacity: 50,
        markerSpacing: 4,
        precision: 1,
        units: 'deg'
    }, ({ precision, markerSpacing, circleOpacity, arcOpacity, units }) => {
        document.getElementById('precision-slider').value = precision;
        document.getElementById('precision-value')
            .innerHTML = `${precision} digit${precision === 1 ? '' : 's'}`;

        const spacings = [10, 12, 15, 20, 30, 45, 60, 90, 120, 180, 360];
        const str = (units === 'deg'
            ? `${spacings[markerSpacing]}&deg;`
            : `${spacings[markerSpacing] * Math.PI / 180} rad`);
        document.getElementById('marker-spacing-slider').value = markerSpacing;
        document.getElementById('marker-spacing-value').innerHTML = str;

        document.getElementById('circle-opacity-slider').value = circleOpacity;
        document.getElementById('circle-opacity-value').innerHTML = `${circleOpacity}%`;

        document.getElementById('arc-opacity-slider').value = arcOpacity;
        document.getElementById('arc-opacity-value').innerHTML = `${arcOpacity}%`;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    updateValues();

    document.getElementById('precision-slider')
        .addEventListener('input', throttle(onPrecisionChange));
    document.getElementById('marker-spacing-slider')
        .addEventListener('input', throttle(onMarkerSpacingChange));
    document.getElementById('circle-opacity-slider')
        .addEventListener('input', throttle(onCircleOpacityChange));
    document.getElementById('arc-opacity-slider')
        .addEventListener('input', throttle(onArcOpacityChange));
});
