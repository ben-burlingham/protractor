const timers = {
    markerSpacing: null,
    precision: null,
};

const spacings = [
    Math.PI / 12,
    Math.PI / 6,
    Math.PI / 4,
    Math.PI / 3,
    Math.PI / 2,
    Math.PI * 2 / 3,
    Math.PI
];

//===== Slider DOM updaters
function updatePrecision(precision) {
    document.getElementById('precision-slider').value = precision;
    document.getElementById('precision-value')
        .innerHTML = `${precision} digit${precision === 1 ? '' : 's'}`;
}

function updateMarkerSpacing(i, units) {
    const deg = spacings[i] * 180 / Math.PI;
    const rad = spacings[i];

    const str = (units === 'deg'
        ? `${Math.round(deg * 100) / 100}&deg;`
        : `${Math.round(rad * 100) / 100} rad`);

    document.getElementById('marker-spacing-value').innerHTML = str;
}

function updateCircleOpacity(circleOpacity) {
    document.getElementById('circle-opacity-slider').value = circleOpacity;
    document.getElementById('circle-opacity-value').innerHTML = `${circleOpacity}%`;
}

function updateArcOpacity(arcOpacity) {
    document.getElementById('arc-opacity-slider').value = arcOpacity;
    document.getElementById('arc-opacity-value').innerHTML = `${arcOpacity}%`;
}

//===== Event listeners
function onPrecisionChange(evt) {
    const precision = parseInt(evt.target.value);
    updatePrecision(precision);

    clearTimeout(timers.precision);
    timers.precision = setTimeout(chrome.storage.sync.set.bind(null, { precision }), 200);
}

function onMarkerSpacingChange(evt) {
    const val = parseInt(evt.target.value);
    const units = document['options-form'].units.value;
    updateMarkerSpacing(val, units);

    function save() {
        chrome.storage.sync.set({ markerSpacing: spacings[val] });
    }

    clearTimeout(timers.markerSpacing);
    timers.markerSpacing = setTimeout(save, 200);
}

function onCircleOpacityChange(evt) {
    const circleOpacity = parseInt(evt.target.value);
    chrome.storage.sync.set({ circleOpacity });
    updateCircleOpacity();
}

function onArcOpacityChange(evt) {
    const arcOpacity = parseInt(evt.target.value);
    chrome.storage.sync.set({ arcOpacity });
    updateArcOpacity();
}

function onUnitsChange(evt) {
    const units = evt.target.value;
    chrome.storage.sync.set({ units });

    chrome.storage.sync.get({ markerSpacing: null },
        ({ markerSpacing }) => updateMarkerSpacing(markerSpacing, units));
}

function onMarkerLengthChange(evt) {
    const markerLength = evt.target.value;
    chrome.storage.sync.set({ markerLength });
}

function onMarkerSnapChange(evt) {
    const markerSnap = evt.target.value;
    chrome.storage.sync.set({ markerSnap });
}

function restore() {
    chrome.storage.sync.get({
        arcOpacity: 80,
        circleOpacity: 50,
        markerLength: 'center',
        markerSnap: true,
        markerSpacing: 4,
        precision: 1,
        units: 'deg'
    }, ({ precision, markerLength, markerSnap, markerSpacing, circleOpacity, arcOpacity, units }) => {
        updatePrecision(precision);
        document.getElementById('precision-slider').value = precision;

        const i = spacings.indexOf(markerSpacing);
        updateMarkerSpacing(i, units);
        document.getElementById('marker-spacing-slider').value = i;

        // updateCircleOpacity(circleOpacity);
        // updateArcOpacity(arcOpacity);

        document['options-form'].units.value = units;
        document['options-form'].markerLength.value = markerLength;
        document['options-form'].markerSnap.value = markerSnap;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    restore();

    document.getElementById('precision-slider')
        .addEventListener('input', onPrecisionChange);

    document.getElementById('marker-spacing-slider')
        .addEventListener('input', onMarkerSpacingChange);

    // document.getElementById('circle-opacity-slider')
    //     .addEventListener('input', debounce(onCircleOpacityChange, 200));
    // document.getElementById('arc-opacity-slider')
    //     .addEventListener('input', debounce(onArcOpacityChange, 200));

    document['options-form'].units[0].addEventListener('change', onUnitsChange);
    document['options-form'].units[1].addEventListener('change', onUnitsChange);

    document['options-form'].markerLength[0].addEventListener('change', onMarkerLengthChange);
    document['options-form'].markerLength[1].addEventListener('change', onMarkerLengthChange);

    document['options-form'].markerSnap[0].addEventListener('change', onMarkerSnapChange);
    document['options-form'].markerSnap[1].addEventListener('change', onMarkerSnapChange);
});
