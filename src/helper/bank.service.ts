import axios from "axios";
import cron, { schedule } from 'node-cron';
import { dateHelper } from "./date.helper";
import {  } from 'bcrypt';

export class BRI_service {
    static BRI_TOKEN: string = "";

    static refreshBRIauth = () => {
        const params = new URLSearchParams()
        params.append('client_id', process.env.BRI_CLIENT_ID!);
        params.append('client_secret', process.env.BRI_SECRET!)
        axios.post(process.env.BRI_AUTH_URL!, params, {
            headers: {
            "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then(result => {
            if(result.data.status === 'approved'){
                this.BRI_TOKEN = result.data.access_token;
            }
        }).catch(error => {
            console.log(error);
        })
    };

    static scheduleRefreshBRIToken(){
        this.refreshBRIauth();
        // Schedule to ask new authorization token every 7:00 pm
        cron.schedule('0 0 19 * * *', 
            () => { 
                this.refreshBRIauth(); 
            },
            { 
                scheduled: true 
            }
        );
    }

    static createVirtualAccount(uid: string, name: string, amount: number, keterangan: string, expiredDate: Date){
        if(uid.length < 10 || uid.length > 13){
            throw Error("Nomor UID harus 10 - 13 digit.");
        }

        if(amount % 1 != 0){
            throw Error("Nominal harus merupakan bilangan bulat.");
        }

        const ISOdate = (new Date()).toISOString();
        const body = {
            institutionCode: process.env.BRI_INST_CODE!,
            brivaNo: process.env.BRI_VA_NO!,
            custCode: uid,
            nama: name,
            amount: amount,
            keterangan: keterangan,
            expiredDate: dateHelper(expiredDate)
        }

        axios.post(process.env.BRI_URL!, body, {
            headers: {
                "Authorization": `Bearer ${this.BRI_TOKEN}`,
                "BRI-Timestamp": ISOdate,
                "BRI-Signature": this.getAuthHeader("POST", process.env.BRI_URL!, body, ISOdate),
                "Content-Type": "application/json"
            }

        }).then(result => {
            console.log(result);
        }).catch(error => {

        })
    }

    static getAuthHeader(httpMethod: string, requestUrl: string, requestBody: any, date: string) {
        var requestPath = this.getPath(requestUrl);
        var queryString = this.getQueryString(requestUrl);
        
        if (httpMethod == 'GET' || !requestBody) {
            requestBody = ''; 
        } else {
            requestBody = requestBody;
        }
        
        const payload = 'path=' + requestPath + '&verb=' + httpMethod + '&token=Bearer ' + this.BRI_TOKEN + 
                  '&timestamp=' + date + '&body=' + requestBody;
        
                  
        var hmacSignature = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(payload, process.env.BRI_SECRET!));
        return hmacSignature;
    }

    static getPath(url: string) {
        var pathRegex = /.+?\:\/\/.+?(\/.+?)(?:#|\?|$)/;
        var result = url.match(pathRegex);
        return result && result.length > 1 ? result[1] : ''; 
    }
     
    static getQueryString(url: string) {
        var arrSplit = url.split('?');
        return arrSplit.length > 1 ? url.substring(url.indexOf('?')+1) : ''; 
    }
}

export default BRI_service;