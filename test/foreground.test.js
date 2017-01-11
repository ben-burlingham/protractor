const test = require('tape');
require('../scripts/foreground');
require('../scripts/ui');

const id = "777";

test('UI build', t => {
    // const div = Protractor.UI.build(id);
    // t.message("ID assigned");
    // t.equal(div.id, id);
    t.end();
});
