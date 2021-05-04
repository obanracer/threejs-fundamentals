import {runTest as BASIC_TEST} from './tests/basic_test.js'
import {runTest as SHADOW_TEST} from './tests/shadow_test.js'

let TESTS = [];
let testCounter = 0;

document.addEventListener("keydown", e => { 
    if (e.code == "Space" && !e.repeat) { 
        testCounter = testCounter + 1 < TESTS.length ? testCounter + 1 : 0;

        TESTS[testCounter]();
    }
});

(() => {
    TESTS.push(SHADOW_TEST);
    TESTS.push(BASIC_TEST);

    TESTS[testCounter]();
})();