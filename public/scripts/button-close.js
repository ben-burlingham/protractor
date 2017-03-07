ButtonClose = function({ appId }) {
    this.node = document.createElement('div');
    this.node.className = `${appId}-button-close`;
    this.node.addEventListener('click', () => {
        chrome.runtime.sendMessage({ appId });
    });

    return this.node;
};
