"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BRI_service = void 0;
const axios_1 = __importDefault(require("axios"));
const node_cron_1 = __importDefault(require("node-cron"));
const date_helper_1 = require("./date.helper");
class BRI_service {
    static scheduleRefreshBRIToken() {
        this.refreshBRIauth();
        // Schedule to ask new authorization token every 7:00 pm
        node_cron_1.default.schedule('0 0 19 * * *', () => {
            this.refreshBRIauth();
        }, {
            scheduled: true
        });
    }
    static createVirtualAccount(uid, name, amount, keterangan, expiredDate) {
        if (uid.length < 10 || uid.length > 13) {
            throw Error("Nomor UID harus 10 - 13 digit.");
        }
        if (amount % 1 != 0) {
            throw Error("Nominal harus merupakan bilangan bulat.");
        }
        const ISOdate = (new Date()).toISOString();
        const body = {
            institutionCode: process.env.BRI_INST_CODE,
            brivaNo: process.env.BRI_VA_NO,
            custCode: uid,
            nama: name,
            amount: amount,
            keterangan: keterangan,
            expiredDate: (0, date_helper_1.dateHelper)(expiredDate)
        };
        return axios_1.default.post(process.env.BRI_URL, body, {
            headers: {
                "Authorization": `Bearer ${this.BRI_TOKEN}`,
                "BRI-Timestamp": ISOdate,
                "BRI-Signature": this.getAuthHeader("POST", process.env.BRI_URL, body, ISOdate),
                "Content-Type": "application/json"
            }
        });
    }
    static getAuthHeader(httpMethod, requestUrl, requestBody, date) {
        var requestPath = this.getPath(requestUrl);
        var queryString = this.getQueryString(requestUrl);
        if (httpMethod == 'GET' || !requestBody) {
            requestBody = '';
        }
        else {
            requestBody = requestBody;
        }
        const payload = 'path=' + requestPath + '&verb=' + httpMethod + '&token=Bearer ' + this.BRI_TOKEN +
            '&timestamp=' + date + '&body=' + requestBody;
        var hmacSignature = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(payload, process.env.BRI_SECRET));
        return hmacSignature;
    }
    static getPath(url) {
        var pathRegex = /.+?\:\/\/.+?(\/.+?)(?:#|\?|$)/;
        var result = url.match(pathRegex);
        return result && result.length > 1 ? result[1] : '';
    }
    static getQueryString(url) {
        var arrSplit = url.split('?');
        return arrSplit.length > 1 ? url.substring(url.indexOf('?') + 1) : '';
    }
}
exports.BRI_service = BRI_service;
_a = BRI_service;
BRI_service.BRI_TOKEN = "";
BRI_service.refreshBRIauth = () => {
    const params = new URLSearchParams();
    params.append('client_id', process.env.BRI_CLIENT_ID);
    params.append('client_secret', process.env.BRI_SECRET);
    axios_1.default.post(process.env.BRI_AUTH_URL, params, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    }).then(result => {
        if (result.data.status === 'approved') {
            _a.BRI_TOKEN = result.data.access_token;
        }
    }).catch(error => {
        console.log(error);
    });
};
exports.default = BRI_service;
