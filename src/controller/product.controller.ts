import axios from "axios";
import { Request, Response } from "express";

class ProductController {
    static getByCodeName = (req: Request, res: Response) => {
        const codeName = req.params.codeName;
        axios.post(process.env.RAJABILLER_URL!, {
            "method"      : "rajabiller.info_produk",
            "uid"         : process.env.RAJABILLER_UID,
            "pin"         : process.env.RAJABILLER_PIN,
            "kode_produk" : codeName
        }).then(result => {
            const status = result.data.STATUS;

            // Code name tersedia
            if(status === "00"){
                return res.status(200).send({
                    code_product: codeName,
                    price: parseFloat(result.data.HARGA),
                    admin: parseFloat(result.data.ADMIN),
                    comission: parseFloat(result.data.KOMISI),
                });
            }

            // Ada error
            return res.status(500).send({
                status: status,
                description: result.data.KET
            });
            
        }).catch(error => {
            return res.status(500).send(error);
        })
    }
}

export default ProductController;