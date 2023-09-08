import { IsNumber, isNumber } from 'class-validator';

export class ProductReq{

    product_code: number;
    new_price: number;

    constructor(productCode: number, newPrice: number){
        this.product_code = productCode;
        this.new_price = newPrice;
    }
}
