import { plainToClass } from 'class-transformer';
import { Request, Response } from 'express';
import mysql, { RowDataPacket } from 'mysql2/promise';
import { ProductForm } from '../model/productForm';
import { Validator } from 'jsonschema';
import productSchema from '../productSchema.json';
import { Product, ProductResponse } from '../model/product-response';

const jsonValidator = new Validator();

const pool = mysql.createPool({
  host: '127.0.0.1:3306',
  user: 'new',
  password: '1234',
  database: 'db',
});

const yourController = {
  async get(req: Request, res: Response) {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.execute('SELECT * FROM products');
      connection.release();
      res.json(rows);
    } catch (error) {
      console.error('Erro:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },
  async update(req: Request, res: Response) {
    try {
      const jsonData = req.body;
      const products = plainToClass(ProductForm, jsonData);

      const connection = await pool.getConnection();
      const [product_db] = await connection.execute<Product[] & RowDataPacket[]>('SELECT * FROM products');
      console.log(product_db);
      let items = new ProductResponse(product_db);
      let correctItems: ProductForm[] = [];

      // const [packs_db] = await connection.execute<Product[] & RowDataPacket[]>('SELECT * FROM packs');
      
      products.forEach(element => {
////
////  ANTES DO RETURN COLOCAR OS RES.ERROR CORRESPONDENTES A CADA ERRO!!!!
////  SE DER TEMPO, SUBSTITUIR OS INTEIROS POR OBJETOS DE EXCESSAO~!!!!
////

        switch (element.isValid()) {
          case 0:
            console.error("O item de id " + element.product_code + " têm um código em formato não permitido!");
            break;
          case 1:
            console.error("O item de id " + element.product_code + " têm um preço em formato não permitido!");
            break;
          case 2:
            correctItems.push(element);
            break;
          default:
            break;
        }

        if (items.containsCode(element) == false) {
          console.error("O item de id " + element.product_code + " não existe e não foi adicionado!!");
        } else {
          correctItems.push(element);
        }

        switch(items.respectsBusiness(element)){
          case 0:
            console.error("O item de id " + element.product_code + " Não existe no banco de dados!");
            break;
          case 1:
            console.error("O item de id " + element.product_code + " têm preço menor que custo de produção!");
            break;
            case 2:
            console.error("O item de id " + element.product_code + " têm preço 10% diferente do preço de venda!");
            break;
          case 3:
            correctItems.push(element);
            break;
          default:
            break;
        }
      });

      console.log('JSON recebido:', products);
      res.json(jsonData);
    } catch (error) {
      console.error('Erro:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
};

export default yourController;