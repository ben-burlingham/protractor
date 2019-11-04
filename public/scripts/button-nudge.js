ButtonNudge = function({ appId }) {
    this.node = document.createElement('div');
    this.node.className = `${appId}-button-nudge`;

    this.node.addEventListener('click', (evt) => {
        console.error(evt.target.className);
        if (evt.target.className === `${appId}-button-nudge`) {
            evt.target.className = `${appId}-button-nudging`;
            PubSub.emit(Channels.SET_MODE, { mode: "nudge" });
        } 
        else {
            evt.target.className = `${appId}-button-nudge`;
        }
    });
    
    return this.node;
};
