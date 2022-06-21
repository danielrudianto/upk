"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const product_model_1 = require("../models/product.model");
class ProductController {
}
ProductController.fetch = (req, res) => {
    const products = product_model_1.ProductModel.getProducts(req.params.groupName, (req.params.groupName == null) ? null : req.params.childGroupName);
    return res.status(200).send(products);
};
ProductController.getByCodeName = (req, res) => {
    const codeName = req.params.codeName;
    axios_1.default.post(process.env.RAJABILLER_URL, {
        "method": "rajabiller.info_produk",
        "uid": process.env.RAJABILLER_UID,
        "pin": process.env.RAJABILLER_PIN,
        "kode_produk": codeName
    }).then(result => {
        const status = result.data.STATUS;
        // Code name tersedia
        if (status === "00") {
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
        console.error(`[error]: Error fetching product from RajaBiller ${new Date()}`);
        console.error(`[error]: ${error}`);
        return res.status(500).send(error);
    });
};
exports.default = ProductController;
