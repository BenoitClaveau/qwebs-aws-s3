/*!
 * qwebs-aws-s3
 * Copyright(c) 2016 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
"use strict"

const path = require("path");
const Qwebs = require("qwebs");

class Setup {
    constructor() {
        this.$qwebs = new Qwebs({dirname: __dirname});
        this.$qwebs.inject("$mongo", "./../index"); 
    };

    run() {
        return this.loadQwebs();
    };

    loadQwebs() {
        return this.$qwebs.load();
    };
};

exports = module.exports = new Setup();
