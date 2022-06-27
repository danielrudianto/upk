"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MediaHelper {
    static toFile(file) {
        var matches = file.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches == null || matches.length !== 3) {
            throw Error("Invalid input string");
        }
        const data = Buffer.from(matches[2], "base64");
        return data;
    }
}
exports.default = MediaHelper;
