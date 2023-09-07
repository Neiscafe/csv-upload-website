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
                // if (!jsonData) {
                //   return res.status(400).json({ error: 'JSON não fornecido na solicitação.' });
                // }
                // const form = jsonValidator.validate(jsonData, productSchema);
                // if (!form.valid) {
                //   const errors = form.errors.map((error) => error.stack);
                //   return res.status(400).json({ errors });
                // }
                const products = (0, class_transformer_1.plainToClass)(productForm_1.ProductForm, jsonData);
                console.log('JSON recebido:', jsonData);
                res.json({ message: 'JSON recebido com sucesso.' });
            }
            catch (error) {
                console.error('Erro:', error);
                res.status(500).json({ error: 'Erro interno do servidor' });
            }
        });
    }
};
exports.default = yourController;
//# sourceMappingURL=yourController.js.map