import axios from "axios";
import cron, { schedule } from 'node-cron';

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
}

export default BRI_service;