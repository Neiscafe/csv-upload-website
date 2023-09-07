export class ProductRequest {
    product_code: number;
    new_price: number;

    constructor(s: string[]){
        this.product_code = parseInt(s[0]);
        this.new_price = parseInt(s[1]);    
    }

    stringToInt(s: string[]){
        this.product_code = parseInt(s[0]);
        this.new_price = parseFloat(s[1]);
    }

}