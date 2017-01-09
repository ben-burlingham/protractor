chrome = require('sinon-chrome');
const test = require('tape');
const Background = require('../background');

test('click listener added to the browser action', (t) => {
    t.ok(chrome.browserAction.onClicked._listeners.length > 0)
    t.end();
});
