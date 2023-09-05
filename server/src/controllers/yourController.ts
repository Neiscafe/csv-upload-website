import { plainToClass } from 'class-transformer';
import { Request, Response } from 'express';
import mysql from 'mysql2/promise';
import { ProductForm } from '../model/productForm'; 
import { Validator } from 'jsonschema';
import productSchema from '../productSchema.json';

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
  async update(req: Request, res: Response){
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
      
      const products = plainToClass(ProductForm, jsonData);
      products.forEach(element => {
        console.log('id:', element.product_code);
      });      

      console.log('JSON recebido:', products);
      res.json({ message: 'JSON recebido com sucesso.' });
    } catch (error) {
      console.error('Erro:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
};

export default yourController;