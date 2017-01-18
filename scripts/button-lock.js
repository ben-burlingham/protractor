ButtonLock = function({ appId }) {
    this.node = document.createElement('button');
    this.node.className = `${appId}-button-lock`;

    this.node.addEventListener('click', (evt) => {
        if (evt.target.className === `${appId}-button-lock`) {
            evt.target.className = `${appId}-button-locked`;
            PubSub.emit(Channels.LOCK_ALL, { locked: true });
        } else {
            evt.target.className = `${appId}-button-lock`;
            PubSub.emit(Channels.LOCK_ALL, { locked: false });
        }
    });

    return this.node;
};
