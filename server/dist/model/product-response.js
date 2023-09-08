"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = exports.ProductResponse = void 0;
class ProductResponse {
    constructor(items) {
        this.list = [];
        this.size = 0;
        this.list = items;
        this.size = items.length;
    }
    containsCode(item) {
        let exists = 0;
        this.list.forEach(element => {
            if (element.code == item.product_code) {
                exists++;
            }
        });
        return exists > 0;
    }
    respectsBusiness(item) {
        let selected;
        for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].code == item.product_code) {
                console.log("aconteceu\n");
                selected = this.list[i];
            }
        }
        if (typeof (selected) == 'undefined') {
            return 0;
        }
        if (item.new_price < selected.cost_price) {
            return 1;
        }
        if (item.new_price > selected.sales_price * 1.1 || item.new_price < selected.sales_price * 0.9) {
            return 2;
        }
        return 3;
    }
}
exports.ProductResponse = ProductResponse;
class Product {
    constructor(code, name, costPrice, salesPrice) {
        this.code = code;
        this.name = name;
        this.cost_price = costPrice;
        this.sales_price = salesPrice;
    }
}
exports.Product = Product;
//# sourceMappingURL=product-response.js.map