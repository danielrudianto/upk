export interface productGroup {
    group: string;
    logo: string;
    children?: productGroup[] | product[];
}

export interface product {
    code_product: string;
    description: string
}

export const products: productGroup[] = [
    {
        group: "PLN",
        logo: "/Path/to/PLN/Logo",
        children: [
            {
                code_product: "PLNPASCH",
                description: "PLN Pascabayar"
            },
            {
                code_product: "PLNPRAH",
                description: "PLN Prabayar"
            }
        ]
    },
    {
        group: "Pulsa",
        logo: "/Path/to/Pulsa/Logo",
        children: [
            {
                group: "Indosat",
                logo: "/Path/to/Indosat/Logo",
                children: [
                    {
                        code_product: "I5H",
                        description: "Indosat IM3 / Mentari 5 ribu"
                    }, 
                    {
                        code_product: "I10H",
                        description: "Indosat IM3 / Mentari 10 ribu"
                    },
                    {
                        code_product: "I25H",
                        description: "Indosat IM3 / Mentari 25 ribu"
                    },
                    {
                        code_product: "I50H",
                        description: "Indosat IM3 / Mentari 50 ribu"
                    }, 
                    {
                        code_product: "I100H",
                        description: "Indosat IM3 / Mentari 100 ribu"
                    },
                ]
            },
            {
                group: "Telkomsel",
                logo: "/Path/to/Telkomsel/Logo",
                children: [
                    {
                        code_product: "S5H",
                        description: "Telkomsel Simpati / As 5 ribu"
                    },
                    {
                        code_product: "S10H",
                        description: "Telkomsel Simpati / As 10 ribu"
                    },
                    {
                        code_product: "S25H",
                        description: "Telkomsel Simpati / As 25 ribu"
                    },
                    {
                        code_product: "S50H",
                        description: "Telkomsel Simpati / As 50 ribu"
                    },
                    {
                        code_product: "S100H",
                        description: "Telkomsel Simpati / As 100 ribu"
                    },
                ]
            },
            {
                group: "Axis / XL",
                logo: "/Path/to/XL/Logo",
                children: [
                    {
                        code_product: "XR5H",
                        description: "Axis / XL 5 ribu"
                    },
                    {
                        code_product: "XR10H",
                        description: "Axis / XL 10 ribu"
                    },
                    {
                        code_product: "XR25H",
                        description: "Axis / XL 25 ribu"
                    },
                    {
                        code_product: "XR50H",
                        description: "Axis / XL 50 ribu"
                    },
                    {
                        code_product: "XR100H",
                        description: "Axis / XL 100 ribu"
                    },
                ]
            }
        ]
    },
    {
        group: "Asuransi",
        logo: "/Path/to/BPJS/Logo",
        children: [
            {
                code_product: "ASRBPJSKSH",
                description: "BPJS Kesehatan"
            }
        ]
    }
]