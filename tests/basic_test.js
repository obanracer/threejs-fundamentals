import { Test } from './test.js';

const BasicTest = new Test(
    function init() {
        console.log("holi soy init");
    },

    function update() {
        console.log("holi soy update");
    }
);

export { BasicTest };