export class ProductEntity{
    code: number;
    name: string;
    cost_price: number;
    sales_price: number;

    constructor(code: number, name: string, costPrice: number, salesPrice: number) {
        this.code = code;
        this.name = name;
        this.cost_price = costPrice;
        this.sales_price = salesPrice;
    }

}