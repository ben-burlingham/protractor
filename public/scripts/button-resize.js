ButtonResize = function({ appId }) {
    this.node = document.createElement('div');
    this.node.className = `${appId}-button-resize`;

    this.node.addEventListener('click', (evt) => {
        if (evt.target.className === `${appId}-button-resize`) {
            evt.target.className = `${appId}-button-resized`;
            PubSub.emit(Channels.SET_MODE, { mode: "resize" });
        } 
        else {
            evt.target.className = `${appId}-button-resize`;
        }
    });

    return this.node;
};
