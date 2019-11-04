ButtonLock = function({ appId }) {
    this.node = document.createElement('div');
    this.node.className = `${appId}-button-lock`;

    this.node.addEventListener('click', (evt) => {
        if (evt.target.className === `${appId}-button-lock`) {
            evt.target.className = `${appId}-button-locked`;
            PubSub.emit(Channels.SET_MODE, { mode: "lock" });
        } 
        else {
            evt.target.className = `${appId}-button-lock`;
        }
    });

    return this.node;
};
