ButtonRotate = function({ appId }) {
    this.node = document.createElement('div');
    this.node.className = `${appId}-button-rotate`;

    this.node.addEventListener('click', (evt) => {
        if (evt.target.className === `${appId}-button-rotate`) {
            evt.target.className = `${appId}-button-rotated`;
            PubSub.emit(Channels.CONTAINER_ROTATE, { rotate: true });
        } else {
            evt.target.className = `${appId}-button-rotate`;
            PubSub.emit(Channels.CONTAINER_ROTATE, { rotate: false });
        }
    });
    
    return this.node;
};
