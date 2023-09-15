"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_transformer_1 = require("class-transformer");
const promise_1 = __importDefault(require("mysql2/promise"));
const product_request_1 = require("../model/product-request");
const response_type_1 = require("../model/response-type");
const class_validator_1 = require("class-validator");
const server_config_js_1 = require("../server-config.js");
const ERROR = "Error";
const SUCCESS = "Success";
const pool = promise_1.default.createPool(server_config_js_1.config);
let updatedProduct = [];
const yourController = {
    validate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jsonData = req.body;
                const products = (0, class_transformer_1.plainToClass)(product_request_1.ProductReq, jsonData);
                const connection = yield pool.getConnection();
                const [product_db] = yield connection.execute('SELECT * FROM products');
                const productItems = product_db;
                const [packs_db] = yield connection.execute('SELECT * FROM packs');
                connection.release();
                const packItems = packs_db;
                const validationStatus = validateItems(products, productItems, packItems);
                if (validationStatus[0].type == "Success") {
                    res.status(200).json({ validationStatus });
                }
                else {
                    res.status(500).json({ validationStatus });
                }
            }
            catch (error) {
                console.error('Erro:', error);
            }
        });
    },
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield pool.getConnection();
            for (let item of updatedProduct) {
                connection.execute('UPDATE products SET sales_price = ? WHERE code = ?', [item.sales_price, item.code]).catch(returnError);
            }
            connection.release();
            function returnError(message) {
                res.status(500).json({ message });
                return;
            }
            res.status(200).json({ message: "Sucesso!" });
        });
    }
};
function validateItems(productsFromReq, productsEntity, packItems) {
    let totalErrors = [];
    for (let reqProduct of productsFromReq) {
        const a = itemHasValidFields(reqProduct);
        const b = itemExistsInDb(reqProduct, productsEntity);
        const c = respectsBusinessScenario(reqProduct, productsEntity, packItems);
        totalErrors = totalErrors.concat(a, b, c);
    }
    if (totalErrors.length > 0) {
        return totalErrors;
    }
    else {
        for (let reqProduct of productsFromReq) {
            updatedProduct = priceChange(reqProduct, productsEntity, packItems);
        }
        return [new response_type_1.ValidationType(SUCCESS, "Itens validados com sucesso!")];
    }
}
function itemHasValidFields(product) {
    var errors = [];
    if (!(0, class_validator_1.isNumber)(product.product_code)) {
        let error = new response_type_1.ValidationType(ERROR, "O item de id " + product.product_code + " têm um código em formato não permitido");
        errors.push(error);
    }
    if (!(0, class_validator_1.isNumber)(product.new_price)) {
        let error = new response_type_1.ValidationType(ERROR, "O item de id " + product.product_code + " têm um preço em formato não permitido!");
        errors.push(error);
    }
    return errors;
}
function itemExistsInDb(newProduct, currentProducts) {
    let exists = 0;
    for (let cProduct of currentProducts) {
        if (cProduct.code == newProduct.product_code) {
            exists++;
        }
    }
    ;
    if (exists == 0) {
        return [new response_type_1.ValidationType(ERROR, "O item de id " + newProduct.product_code + " não existe na base de dados")];
    }
    return [];
}
function respectsBusinessScenario(reqProduct, oldProducts, packItems) {
    let selected;
    let errors = [];
    for (let oProduct of oldProducts) {
        if (oProduct.code == reqProduct.product_code) {
            selected = oProduct;
        }
    }
    if (typeof (selected) == 'undefined') {
        errors.push(new response_type_1.ValidationType(ERROR, "Erro interno no servidor!"));
        return errors;
    }
    if (reqProduct.new_price < selected.cost_price) {
        errors.push(new response_type_1.ValidationType(ERROR, "O item de id " + reqProduct.product_code + " têm preço menor que custo de produção!"));
    }
    if (reqProduct.new_price > selected.sales_price * 1.1 || reqProduct.new_price < selected.sales_price * 0.9) {
        errors.push(new response_type_1.ValidationType(ERROR, "O item de id " + reqProduct.product_code + " têm preço 10% diferente do preço de venda!"));
    }
    return errors;
}
function priceChange(reqProduct, oldProducts, packItems) {
    let selectedPack = null;
    let relatedPacks = [];
    let relatedProducts = 0;
    let selected = null;
    console.log(oldProducts);
    for (let oProduct of oldProducts) {
        if (oProduct.code == reqProduct.product_code) {
            selected = oProduct;
        }
    }
    for (let pack of packItems) {
        if (reqProduct.product_code == pack.product_id || reqProduct.product_code == pack.pack_id) {
            selectedPack = pack;
        }
    }
    if (selectedPack != null && selected != null) {
        console.log("Existe pacote relacionado");
        for (let pack of packItems) {
            if (selectedPack.pack_id == pack.pack_id) {
                relatedPacks.push(pack);
            }
        }
        for (let pack of relatedPacks) {
            for (let product of oldProducts) {
                if (product.code == pack.product_id) {
                    relatedProducts++;
                }
            }
        }
        console.log(relatedProducts);
        let priceOffset = (reqProduct.new_price - selected.sales_price) / relatedProducts;
        for (let product of oldProducts) {
            for (let pack of relatedPacks) {
                if (product.code == pack.product_id) {
                    console.log("old price = " + product.sales_price + " for product" + product.code);
                    product.sales_price = parseFloat((product.sales_price + priceOffset).toString());
                    console.log("New price = " + product.sales_price + " for product" + product.code);
                }
                if (pack.pack_id == product.code) {
                    console.log("old price = " + product.sales_price + " for product" + product.code);
                    product.sales_price = reqProduct.new_price;
                    console.log("New price = " + product.sales_price + " for product" + product.code);
                }
            }
        }
    }
    else if (selected != null) {
        selected.sales_price = reqProduct.new_price;
    }
    console.log(oldProducts);
    return oldProducts;
}
exports.default = yourController;
//# sourceMappingURL=yourController.js.map