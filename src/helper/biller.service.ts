import axios from "axios";
import { PhoneBill } from "../interface/biller";

export class billerService {
    static createPhoneBill(phone_number: string, product_code: string, transaction_id: string){
        const request: any = {
            method: "rajabiller.pulsa",
            uid: process.env.RAJABILLER_UID,
            pin: process.env.RAJABILLER_PIN,
            no_hp: phone_number,
            kode_produk: product_code,
            ref1: transaction_id
        }

        return axios.post(process.env.RAJABILLER_URL!, request, {
            headers: {
                "Content-Type": "application/json"
            }
        })
    }

    static checkElectricityBill(customer_number: string, product_code: string, transaction_id: string){
        const request: any = {
            method: "rajabiller.pulsa",
            uid: process.env.RAJABILLER_UID,
            pin: process.env.RAJABILLER_PIN,
            idpel1: customer_number,
            idpel2: "",
            idpel3: "",
            kode_produk: product_code,
            ref1: transaction_id
        }

        return axios.post(process.env.RAJABILLER_URL!, request, {
            headers: {
                "Content-Type": "application/json"
            }
        })
    }

    static createElectricityBill(customer_number: string, product_code: string, transaction_id: string){
        
    }
}