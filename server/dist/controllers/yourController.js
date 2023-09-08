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
const ERROR = "Error";
const SUCCESS = "Success";
const pool = promise_1.default.createPool({
    host: '127.0.0.1:3306',
    user: 'new',
    password: '1234',
    database: 'db',
});
const yourController = {
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = yield pool.getConnection();
                const [rows] = yield connection.execute('SELECT * FROM products');
                connection.release();
                res.json(rows);
            }
            catch (error) {
                console.error('Erro:', error);
                res.status(500).json({ error: 'Erro interno do servidor' });
            }
        });
    },
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jsonData = req.body;
                const products = (0, class_transformer_1.plainToClass)(product_request_1.ProductReq, jsonData);
                const connection = yield pool.getConnection();
                const [product_db] = yield connection.execute('SELECT * FROM products');
                console.log(product_db);
                let items = product_db;
                // const [packs_db] = await connection.execute<Product[] & RowDataPacket[]>('SELECT * FROM packs');
                const validationStatus = validateItems(products, items);
                console.log(validationStatus);
                if (validationStatus[0].type == "Success") {
                    res.status(200).json({ validationStatus });
                }
                else {
                    res.status(500).json({ validationStatus });
                }
                // res.json(jsonData);
            }
            catch (error) {
                console.error('Erro:', error);
                // res.status(500).json({ error: 'Erro interno do servidor' });
            }
        });
    }
};
function validateItems(productsFromReq, productsEntity) {
    let totalErrors = [];
    for (let reqProduct of productsFromReq) {
        const a = itemHasValidFields(reqProduct);
        const b = itemExistsInDb(reqProduct, productsEntity);
        const c = respectsBusinessScenario(reqProduct, productsEntity);
        totalErrors = totalErrors.concat(a, b, c);
        // totalErrors = totalErrors.concat(b);
        // totalErrors = totalErrors.concat(c);
        console.log(totalErrors);
    }
    if (totalErrors.length > 0) {
        return totalErrors;
    }
    else {
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
function respectsBusinessScenario(cProduct, oldProducts) {
    let selected, errors = [];
    for (let oProduct of oldProducts) {
        if (oProduct.code == cProduct.product_code) {
            selected = oProduct;
        }
    }
    if (typeof (selected) == 'undefined') {
        errors.push(new response_type_1.ValidationType(ERROR, "O item de id " + cProduct.product_code + " é indefinido na base de dados!"));
        return errors;
    }
    if (cProduct.new_price < selected.cost_price) {
        errors.push(new response_type_1.ValidationType(ERROR, "O item de id " + cProduct.product_code + " têm preço menor que custo de produção!"));
    }
    if (cProduct.new_price > selected.sales_price * 1.1 || cProduct.new_price < selected.sales_price * 0.9) {
        errors.push(new response_type_1.ValidationType(ERROR, "O item de id " + cProduct.product_code + " têm preço 10% diferente do preço de venda!"));
    }
    return errors;
}
exports.default = yourController;
//# sourceMappingURL=yourController.js.map