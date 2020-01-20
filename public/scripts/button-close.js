ButtonClose = function({ buttonSpriteUrl }) {
    this.node = document.createElement('div');
    this.node.title = "Close";
    this.node.className = 'protractor-extension-button protractor-extension-button-close';
    this.node.style.backgroundImage = `url('${buttonSpriteUrl}')`;
    this.node.addEventListener('click', () => {
        alert('uh oh')
        browser.runtime.sendMessage({ appId });
    });

    return this.node;
};

ButtonClose.prototype = {};
