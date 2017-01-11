Protractor.UI = {
    buildContainer: (id, radius) => {
        const div = document.createElement('div');
        div.id = `container-${id}`;
        div.className = 'protractor-container';

        div.style.left = '200px'
        div.style.top = '200px';
        div.style.height = `${radius * 2}px`;
        div.style.width = `${radius * 2}px`;

        return div;
    },

    buildCircle: (radius) => {
        const div = document.createElement('div');
        div.className = 'protractor-circle';

        div.style.borderRadius = `${radius}px`;
        return div;
    },

    buildButtonContainer: () => {
        const div = document.createElement('div');
        div.className = 'protractor-button-container';
        return div;
    },

    buildButtonClose: () => {
        const btn = document.createElement('button');
        btn.className = 'protractor-button-close';
        btn.type = 'button';
        return btn;
    },

    buildButtonLock: () => {
        const btn = document.createElement('button');
        btn.className = 'protractor-button-lock';
        btn.type = 'button';
        return btn;
    },

    buildDisplay: (radius) => {
        const div = document.createElement('div');
        div.className = 'protractor-display';
        div.innerHTML = "999.999 rad"
        return div;
    },

    buildMarkers: (radius) => {
        const markers = [];

        for (let deg = 0; deg < 360; deg += 15) {
            markers.push(new Protractor.Marker({ radius, deg }));
        }

        return markers;
    },
};
