"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateHelper = void 0;
function dateHelper(date) {
    var d = new Date(date), month = '' + (d.getMonth() + 1), day = '' + d.getDate(), year = d.getFullYear();
    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;
    return [year, month, day].join('-');
}
exports.dateHelper = dateHelper;
