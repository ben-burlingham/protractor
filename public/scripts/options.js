const timers = {
    arcFill: null,
    circleFill: null,
    guide0Fill: null,
    guide1Fill: null,
    markerInterval: null,
    precision: null,
};

const intervals = [
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

function updateMarkerInterval(interval, units) {
    const deg = interval * 180 / Math.PI;
    const rad = interval;

    const str = (units === 'deg'
        ? `${Math.round(deg * 100) / 100}&deg;`
        : `${Math.round(rad * 100) / 100} rad`);

    document.getElementById('marker-interval-value').innerHTML = str;
}

//===== Event listeners
function onPrecisionChange(evt) {
    const precision = parseInt(evt.target.value);
    updatePrecision(precision);

    clearTimeout(timers.precision);
    timers.precision = setTimeout(chrome.storage.sync.set.bind(null, { precision }), 200);
}

function onMarkerIntervalChange(evt) {
    const markerInterval = intervals[parseInt(evt.target.value)];
    const units = document['options-form'].units.value;
    updateMarkerInterval(markerInterval, units);

    function save() {
        chrome.storage.sync.set({ markerInterval });
    }

    clearTimeout(timers.markerInterval);
    timers.markerInterval = setTimeout(save, 200);
}

function onCircleFillChange(evt) {
    function save() {
        const form = document['options-form'];
        const r = Math.max(0, Math.min(form.circleFillR.value, 255));
        const g = Math.max(0, Math.min(form.circleFillG.value, 255));
        const b = Math.max(0, Math.min(form.circleFillB.value, 255));
        const a = Math.max(0, Math.min(form.circleFillA.value, 1));

        form.circleFillR.value = r;
        form.circleFillG.value = g;
        form.circleFillB.value = b;
        form.circleFillA.value = a;

        chrome.storage.sync.set({ circleFill: `rgba(${r},${g},${b},${a})` });
    }

    clearTimeout(timers.circleFill);
    timers.circleFill = setTimeout(save, 500);
}

function onArcFillChange(evt) {
    function save() {
        const form = document['options-form'];
        const r = Math.max(0, Math.min(form.arcFillR.value, 255));
        const g = Math.max(0, Math.min(form.arcFillG.value, 255));
        const b = Math.max(0, Math.min(form.arcFillB.value, 255));
        const a = Math.max(0, Math.min(form.arcFillA.value, 1));

        form.arcFillR.value = r;
        form.arcFillG.value = g;
        form.arcFillB.value = b;
        form.arcFillA.value = a;

        chrome.storage.sync.set({ arcFill: `rgba(${r},${g},${b},${a})` });
    }

    clearTimeout(timers.arcFill);
    timers.arcFill = setTimeout(save, 500);
}

function onGuide0FillChange(evt) {
    function save() {
        const form = document['options-form'];
        const r = Math.max(0, Math.min(form.guide0FillR.value, 255));
        const g = Math.max(0, Math.min(form.guide0FillG.value, 255));
        const b = Math.max(0, Math.min(form.guide0FillB.value, 255));
        const a = Math.max(0, Math.min(form.guide0FillA.value, 1));

        form.guide0FillR.value = r;
        form.guide0FillG.value = g;
        form.guide0FillB.value = b;
        form.guide0FillA.value = a;

        chrome.storage.sync.set({ guide0Fill: `rgba(${r},${g},${b},${a})` });
    }

    clearTimeout(timers.guide0Fill);
    timers.guide0Fill = setTimeout(save, 500);
}

function onGuide1FillChange(evt) {
    function save() {
        const form = document['options-form'];
        const r = Math.max(0, Math.min(form.guide1FillR.value, 255));
        const g = Math.max(0, Math.min(form.guide1FillG.value, 255));
        const b = Math.max(0, Math.min(form.guide1FillB.value, 255));
        const a = Math.max(0, Math.min(form.guide1FillA.value, 1));

        form.guide1FillR.value = r;
        form.guide1FillG.value = g;
        form.guide1FillB.value = b;
        form.guide1FillA.value = a;

        chrome.storage.sync.set({ guide1Fill: `rgba(${r},${g},${b},${a})` });
    }

    clearTimeout(timers.guide1Fill);
    timers.guide1Fill = setTimeout(save, 500);
}

function onUnitsChange(evt) {
    const units = evt.target.value;
    chrome.storage.sync.set({ units });

    chrome.storage.sync.get({ markerInterval: null },
        ({ markerInterval }) => updateMarkerInterval(markerInterval, units));
}

function onMarkerLabelsChange(evt) {
    const markerLabels = evt.target.value;
    chrome.storage.sync.set({ markerLabels });
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
        arcFill: `rgba(50,243,150,0.1)`,
        circleFill: `rgba(200,200,200,0.03)`,
        guide0Fill: 'rgba(46,198,86,1)',
        guide1Fill: 'rgba(0,0,255,1)',
        markerLabels: false,
        markerLength: 'center',
        markerSnap: true,
        markerInterval: Math.PI / 6,
        precision: 1,
        units: 'deg'
    }, ({ precision, markerLabels, markerLength, markerSnap, markerInterval, circleFill, arcFill, guide0Fill, guide1Fill, units }) => {
        updatePrecision(precision);
        document.getElementById('precision-slider').value = precision;

        updateMarkerInterval(markerInterval, units);
        document.getElementById('marker-interval-slider').value = markerInterval;

        const form = document['options-form'];
        form.units.value = units;
        form.markerLabels.value = markerLabels;
        form.markerLength.value = markerLength;
        form.markerSnap.value = markerSnap;

        const arc = arcFill.substring(5, arcFill.length - 1).split(',');
        const circle = circleFill.substring(5, circleFill.length - 1).split(',');
        const guide0 = guide0Fill.substring(5, guide0Fill.length - 1).split(',');
        const guide1 = guide1Fill.substring(5, guide1Fill.length - 1).split(',');

        form.arcFillR.value = arc[0];
        form.arcFillG.value = arc[1];
        form.arcFillB.value = arc[2];
        form.arcFillA.value = arc[3];

        form.circleFillR.value = circle[0];
        form.circleFillG.value = circle[1];
        form.circleFillB.value = circle[2];
        form.circleFillA.value = circle[3];

        form.guide0FillR.value = guide0[0];
        form.guide0FillG.value = guide0[1];
        form.guide0FillB.value = guide0[2];
        form.guide0FillA.value = guide0[3];

        form.guide1FillR.value = guide1[0];
        form.guide1FillG.value = guide1[1];
        form.guide1FillB.value = guide1[2];
        form.guide1FillA.value = guide1[3];
    });
}

document.addEventListener('DOMContentLoaded', () => {
    restore();

    document.getElementById('precision-slider')
        .addEventListener('input', onPrecisionChange);

    document.getElementById('marker-interval-slider')
        .addEventListener('input', onMarkerIntervalChange);

    const form = document['options-form'];

    form.units[0].addEventListener('change', onUnitsChange);
    form.units[1].addEventListener('change', onUnitsChange);

    form.markerLabels[0].addEventListener('change', onMarkerLabelsChange);
    form.markerLabels[1].addEventListener('change', onMarkerLabelsChange);

    form.markerLength[0].addEventListener('change', onMarkerLengthChange);
    form.markerLength[1].addEventListener('change', onMarkerLengthChange);

    form.markerSnap[0].addEventListener('change', onMarkerSnapChange);
    form.markerSnap[1].addEventListener('change', onMarkerSnapChange);

    form.circleFillR.addEventListener('input', onCircleFillChange);
    form.circleFillG.addEventListener('input', onCircleFillChange);
    form.circleFillB.addEventListener('input', onCircleFillChange);
    form.circleFillA.addEventListener('input', onCircleFillChange);

    form.arcFillR.addEventListener('change', onArcFillChange);
    form.arcFillG.addEventListener('change', onArcFillChange);
    form.arcFillB.addEventListener('change', onArcFillChange);
    form.arcFillA.addEventListener('change', onArcFillChange);

    form.guide0FillR.addEventListener('change', onGuide0FillChange);
    form.guide0FillG.addEventListener('change', onGuide0FillChange);
    form.guide0FillB.addEventListener('change', onGuide0FillChange);
    form.guide0FillA.addEventListener('change', onGuide0FillChange);

    form.guide1FillR.addEventListener('change', onGuide1FillChange);
    form.guide1FillG.addEventListener('change', onGuide1FillChange);
    form.guide1FillB.addEventListener('change', onGuide1FillChange);
    form.guide1FillA.addEventListener('change', onGuide1FillChange);
});
