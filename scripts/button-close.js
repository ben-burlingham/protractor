ButtonClose = function({ appId, hide }) {
    this.node = document.createElement('div');
    this.node.className = `${appId}-button-close`;
    this.node.addEventListener('click', hide);

    return this.node;
};
