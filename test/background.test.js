chrome = require('sinon-chrome');

const test = require('tape');
require('../background');
// const sinon = require('sinon');

const tab = {
    id: 777
};

test('init adds click listener to browser action', t => {
    t.equal(chrome.browserAction.onClicked._listeners.length, 1);
    t.end();
});

test('turning on changes icons and title', t => {
    // console.warn(chrome)
    // const spy = sinon.spy(chrome.browserAction.setIcon)
    // Background.setOn(tab);
    // console.warn(spy.called)
    t.end();
});

test('turning off changes icons and title', t => {

    t.end();
});
