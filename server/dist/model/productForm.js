"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductForm = void 0;
const class_validator_1 = require("class-validator");
class ProductForm {
    constructor(productCode, newPrice) {
        this.product_code = productCode;
        this.new_price = newPrice;
    }
    isValid() {
        if (!(0, class_validator_1.isNumber)(this.product_code)) {
            return 0;
        }
        if (!(0, class_validator_1.isNumber)(this.new_price)) {
            return 1;
        }
        return 2;
    }
}
exports.ProductForm = ProductForm;
//# sourceMappingURL=productForm.js.map