import { product, productGroup, products } from "../products";

export class ProductModel {
    static getProducts(groupName: string | null = null, childGroupName: string | null = null) {
        const prods = products;

        if (groupName == null) {
            // If this is the user first page
            // Give them the parent
            const result: productGroup[] = [];
            prods.map(item => {
                result.push({
                    group: item.group,
                    logo: item.logo,
                })
            });

            return result;
        }

        if (groupName != null && childGroupName == null) {
            // If the user has already choose the main product
            // Ex. PLN, or phone bill, or BPJS
            const group = prods.filter(x => x.group == groupName);
            const result: any[] = [];
            if (group.length == 1) {
                group[0].children?.map(x => {
                    if (x.hasOwnProperty("children")) {
                        const productGroup = x as productGroup;
                        result.push({
                            group: productGroup.group,
                            logo: productGroup.logo
                        })
                    } else {
                        const productGroup = x as product;
                        result.push({
                            code_product: productGroup.code_product,
                            description: productGroup.description
                        })
                    }
                })
            }

            return result;
        }

        if (groupName != null && childGroupName != null) {
            // If the user has already choose the main product
            // Ex. PLN, or phone bill, or BPJS
            const group = prods.filter(x => x.group == groupName);
            let result: product[] = [];
            if (group.length == 1) {
                const childGroup = (group[0].children) as productGroup[];
                const selectedChildGroup = childGroup.filter(x => x.group == childGroupName);

                const product = (selectedChildGroup[0].children as product[]);
                result = product;
            }

            return result;
        }
    }
}