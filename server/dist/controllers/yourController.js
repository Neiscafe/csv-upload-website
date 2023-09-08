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
const productForm_1 = require("../model/productForm");
const jsonschema_1 = require("jsonschema");
const product_response_1 = require("../model/product-response");
const response_type_1 = require("../model/response-type");
const jsonValidator = new jsonschema_1.Validator();
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
                const products = (0, class_transformer_1.plainToClass)(productForm_1.ProductForm, jsonData);
                const connection = yield pool.getConnection();
                const [product_db] = yield connection.execute('SELECT * FROM products');
                console.log(product_db);
                let items = new product_response_1.ProductResponse(product_db);
                // const [packs_db] = await connection.execute<Product[] & RowDataPacket[]>('SELECT * FROM packs');
                const validationStatus = validateItems(products, items);
                if (validationStatus.type == "Success") {
                    res.json(validationStatus.message);
                }
                else {
                    res.json(validationStatus.message);
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
function validateItems(products, items) {
    products.forEach(element => {
        ////
        ////  ANTES DO RETURN COLOCAR OS RES.ERROR CORRESPONDENTES A CADA ERRO!!!!
        ////  SE DER TEMPO, SUBSTITUIR OS INTEIROS POR OBJETOS DE EXCESSAO~!!!!
        ////
        switch (element.isValid()) {
            case 0: return new response_type_1.ResponseType("Error", "O item de id " + element.product_code + " têm um código em formato não permitido");
            case 1: return new response_type_1.ResponseType("Error", "O item de id " + element.product_code + " têm um preço em formato não permitido!");
            default:
        }
        if (items.containsCode(element) == false) {
            return new response_type_1.ResponseType("Error", "O item de id " + element.product_code + " não existe!!");
        }
        switch (items.respectsBusiness(element)) {
            case 0:
                return new response_type_1.ResponseType("Error", "O item de id " + element.product_code + " Não existe no banco de dados!");
            case 1:
                return new response_type_1.ResponseType("Error", "O item de id " + element.product_code + " têm preço menor que custo de produção!");
            case 2:
                return new response_type_1.ResponseType("Error", "O item de id " + element.product_code + " têm preço 10% diferente do preço de venda!");
            default:
                break;
        }
    });
    return new response_type_1.ResponseType("Success", "Itens validados com sucesso!");
}
exports.default = yourController;
//# sourceMappingURL=yourController.js.map