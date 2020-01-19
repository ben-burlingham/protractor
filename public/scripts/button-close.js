ButtonClose = function({ appId }) {
    this.node = document.createElement('div');
    this.node.title = "Close";
    this.node.className = `${appId}-button ${appId}-button-close`;
    this.node.addEventListener('click', () => {
        browser.runtime.sendMessage({ appId });
    });

    return this.node;
};

ButtonClose.prototype = {};
