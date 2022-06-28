"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
var promise_1 = require("mysql2/promise");
exports.pool = (0, promise_1.createPool)({
    host: 'localhost',
    user: 'root',
    database: 'santa',
    namedPlaceholders: true,
    decimalNumbers: true,
});
