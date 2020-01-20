ButtonClose = function({ buttonSpriteUrl, cb }) {
    this.node = document.createElement('div');
    this.node.title = "Close";
    this.node.className = 'protractor-extension-button protractor-extension-button-close';
    this.node.style.backgroundImage = `url('${buttonSpriteUrl}')`;
    this.node.addEventListener('click', cb);

    return this.node;
};

ButtonClose.prototype = {};
