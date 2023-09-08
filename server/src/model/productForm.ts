import { IsNumber, isNumber } from 'class-validator';

export class ProductForm{

    product_code: number;
    new_price: number;

    constructor(productCode: number, newPrice: number){
        this.product_code = productCode;
        this.new_price = newPrice;
    }

    isValid(): number {
      if(!isNumber(this.product_code)){
        return 0;
      }
      if(!isNumber(this.new_price)){
        return 1;
      }
      return 2;
    }

    
}
