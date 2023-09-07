import { ProductRequest } from "./ProductRequest";

export class PRArray {
    size: number = 0;
    array: ProductRequest[] = [];

    constructor(){};

    add(toAdd: ProductRequest){
        if(Number.isNaN(toAdd.new_price) || Number.isNaN(toAdd.product_code)){
            console.log("Failed to add!");
            return;
        }
        this.size++;
        this.array[this.size-1] = toAdd; 
    }

    // toJson(): string{
        
    //     return "";
    // }
}