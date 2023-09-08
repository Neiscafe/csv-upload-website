import { ProductForm } from "./productForm";


export class ProductResponse {
    list: Product[] = [];
    size: number = 0;

    constructor(items: Product[]){
        this.list = items;
        this.size = items.length;
    }

    containsCode(item: ProductForm): boolean{
        let exists: number = 0;
        this.list.forEach(element => {
            if(element.code==item.product_code){
                exists++;
            }
        });
        return exists>0;
    }

    respectsBusiness(item: ProductForm): number{
        let selected;
        for (let i = 0; i < this.list.length; i++) {
            if(this.list[i].code==item.product_code){
                console.log("aconteceu\n");
                selected = this.list[i];
            }
        }
        if(typeof(selected)=='undefined'){
            return 0;
        }
        if(item.new_price<selected.cost_price){
            return 1
        }
        if(item.new_price>selected.sales_price*1.1 || item.new_price<selected.sales_price*0.9){
            return 2;
        }
        return 3;
    }
}

export class Product{
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