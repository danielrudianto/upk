import axios from "axios";
import cron from 'node-cron';
import Base64 from 'crypto-js/enc-base64';
import { HmacSHA256 } from "crypto-js";

export class BRI_service {
    static BRI_TOKEN: string = "";

    static refreshBRIauth = () => {
        const params = new URLSearchParams()
        params.append('client_id', process.env.BRI_CLIENT_ID!);
        params.append('client_secret', process.env.BRI_SECRET!)
        axios.post("https://sandbox.partner.api.bri.co.id/oauth/client_credential/accesstoken?grant_type=client_credentials", params, {
            headers: {
            "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then(result => {
            if(result.data.status === 'approved'){
                this.BRI_TOKEN = result.data.access_token;
                console.log(result.data);
            }
        }).catch(error => {
            console.log(error);
            return;
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

    static createVirtualAccount(): Promise<any>{
        const params = new URLSearchParams()
        params.append("Authorization", `Bearer ${this.BRI_TOKEN}`);
        params.append("BRI-Timestamp", new Date().toISOString());
        // params.append("BRI-Signature", this.getAuthHeader("POST"))
        params.append("Content-Type", "application/json");

        return axios.post(process.env.BRI_URL!);
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

    static getAuthHeader(method: string, url: string, body: string){
        const requestPath = this.getPath(url);
        const queryString = this.getQueryString(url);

        if(method === "GET" || !body){
            body = "";
        } else {
            body = body;
        }

        const timestamp = new Date().toISOString();
        const payload = `path=${requestPath}&verb=${method}&token=Bearer ${this.BRI_TOKEN}&timestamp=${timestamp}&body=${body}`;
        const hmacSignature = Base64.stringify(HmacSHA256(payload, process.env.BRI_SECRET!));
        return hmacSignature;
    }
}

export class Mandiri_service {
    
}

export default BRI_service;