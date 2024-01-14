ButtonOptions = function({ buttonSpriteUrl, cb }) {
    this.node = document.createElement('div');
    this.node.title = "Options";
    this.node.className = 'protractor-extension-button protractor-extension-button-options';
    this.node.style.backgroundImage = `url('${buttonSpriteUrl}')`;
    this.node.addEventListener('click', cb);

    return this.node;
};

ButtonOptions.prototype = {};
