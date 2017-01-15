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
        return new Protractor.Circle({ radius, move: Protractor.UI.move });
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

    buildHandles: () => {
        const handles = [];

        for (let i = 0; i < 2; i++) {
            handles.push(new Protractor.Handle(i, Protractor.UI.resize));
        }

        return handles;
    },

    buildMarkers: (radius) => {
        const markers = [];

        for (let deg = 0; deg < 360; deg += 15) {
            markers.push(new Protractor.Marker({ radius, deg }));
        }

        return markers;
    },

    move: (evt) => {
        evt.preventDefault();

        const container = document.querySelector('.protractor-container');
        const conBounds = container.getBoundingClientRect();
        const docBounds = document.body.getBoundingClientRect();

        const newX = conBounds.left + evt.movementX;
        const newY = conBounds.top + evt.movementY;

        if (newX < docBounds.left) {
            container.style.left = `${docBounds.left}px`;
        } else if ((newX + conBounds.width) > docBounds.right) {
            container.style.left = `${docBounds.right - conBounds.width}px`;
        } else {
            container.style.left = `${newX}px`;
        }

        if (newY < docBounds.top) {
            container.style.top = `${docBounds.top}px`;
        } else if ((newY + conBounds.height) > docBounds.bottom) {
            container.style.top = `${docBounds.bottom - conBounds.height}px`;
        } else {
            container.style.top = `${newY}px`;
        }
    },

    resize: (evt) => {
        evt.stopPropagation();
        evt.preventDefault();
        let offset = 0;

        if (evt.movementX < 0 && evt.movementY < 0) {
            offset = Math.min(evt.movementX, evt.movementY);
        } else if (evt.movementX >= 0 && evt.movementY >= 0) {
            offset = Math.max(evt.movementX, evt.movementY);
        }
        // else if (evt.movementX < 0) {
        //     offset = (Math.abs(evt.movementX) < evt.movementY ? evt.movementY : evt.movementX);
        // } else {
        //     offset = (Math.abs(evt.movementY) < evt.movementX ? evt.movementX : evt.movementY);
        // }

        const container = document.querySelector('.protractor-container');
        const circle = document.querySelector('.protractor-circle');

        circle.style.borderRadius = `${container.offsetWidth / 2}px`

        container.style.left = `${container.offsetLeft + offset}px`;
        container.style.top = `${container.offsetTop + offset}px`;

        container.style.width = `${container.offsetWidth - 2 * offset}px`;
        container.style.height = `${container.offsetHeight - 2 * offset}px`;
    },
};
