Protractor.Handle = function(appId, container) {
    Object.assign(this, { appId, container });
};

Protractor.Handle.prototype = {
    build: function(i) {
        const div = document.createElement('div');
        const ref = this.move.bind(this);

        div.className = `protractor-handle protractor-handle-${i}`;
        div.addEventListener('mousedown', this.dragstart.bind(this, ref));
        document.body.addEventListener('mouseup', this.dragend.bind(this, ref));

        return div;
    },

    dragstart: function(ref, evt) {
        evt.stopPropagation();
        evt.preventDefault();
        document.body.addEventListener('mousemove', ref);
    },

    dragend: function(ref, evt) {
        evt.stopPropagation();
        evt.preventDefault();
        document.body.removeEventListener('mousemove', ref);
    },

    move: function(evt) {
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
        const conBounds = container.getBoundingClientRect();
        // const docBounds = document.body.getBoundingClientRect();
        //
        // if ((conBounds.width - 2 * offset) < 300 || (conBounds.height - 2 * offset) < 300) {
        //     return;
        // }
        //
        // if ((conBounds.left + offset) < docBounds.left || (conBounds.top + offset) < docBounds.top) {
        //
        // }

        this.container.style.left = `${conBounds.left + offset}px`;
        this.container.style.top = `${conBounds.top + offset}px`;

        this.container.style.width = `${conBounds.width - 2 * offset}px`;
        this.container.style.height = `${conBounds.height - 2 * offset}px`;

        // const circle = document.querySelector('.protractor-circle');
        // circle.style.borderRadius = `${(conBounds.width - 2 * offset) / 2}px`
    }
};
