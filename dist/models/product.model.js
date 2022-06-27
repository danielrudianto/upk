"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModel = void 0;
const products_1 = require("../data/products");
class ProductModel {
    static getProducts(groupName = null, childGroupName = null) {
        var _a;
        const prods = products_1.products;
        if (groupName == null) {
            // If this is the user first page
            // Give them the parent
            const result = [];
            prods.map((item) => {
                result.push({
                    group: item.group,
                    logo: item.logo,
                });
            });
            return result;
        }
        if (groupName != null && childGroupName == null) {
            // If the user has already choose the main product
            // Ex. PLN, or phone bill, or BPJS
            const group = prods.filter((x) => x.group == groupName);
            const result = [];
            if (group.length == 1) {
                (_a = group[0].children) === null || _a === void 0 ? void 0 : _a.map((x) => {
                    if (x.hasOwnProperty("children")) {
                        const productGroup = x;
                        result.push({
                            group: productGroup.group,
                            logo: productGroup.logo,
                        });
                    }
                    else {
                        const productGroup = x;
                        result.push({
                            code_product: productGroup.code_product,
                            description: productGroup.description,
                        });
                    }
                });
            }
            return result;
        }
        if (groupName != null && childGroupName != null) {
            // If the user has already choose the main product
            // Ex. PLN, or phone bill, or BPJS
            const group = prods.filter((x) => x.group == groupName);
            let result = [];
            if (group.length == 1) {
                const childGroup = group[0].children;
                const selectedChildGroup = childGroup.filter((x) => x.group == childGroupName);
                const product = selectedChildGroup[0].children;
                result = product;
            }
            return result;
        }
    }
}
exports.ProductModel = ProductModel;
