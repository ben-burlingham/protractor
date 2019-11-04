ButtonRotate = function({ appId }) {
    this.node = document.createElement('div');
    this.node.className = `${appId}-button-rotate`;

    this.node.addEventListener('click', (evt) => {
        if (evt.target.className === `${appId}-button-rotate`) {
            evt.target.className = `${appId}-button-rotating`;
            PubSub.emit(Channels.SET_MODE, { mode: "rotate" });
        } 
        else {
            evt.target.className = `${appId}-button-rotate`;
        }
    });
    
    return this.node;
};
