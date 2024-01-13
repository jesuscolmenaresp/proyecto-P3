const { name } = require('ejs');
const db = require('./connection');

let querys = {
getCategories: 'SELECT * FROM categories',
getCategoriesID: 'SELECT * FROM categories WHERE id = ?',
getProducts: 'SELECT * FROM products',
getProductsID: 'SELECT * FROM products WHERE id = ?',
insertProducts: 'INSERT INTO products (id, name, code, price, description, color, guy, category_id) VALUES(?, ?, ?, ?, ?, ?, ?, ?)',
updateProducts: 'UPDATE products SET name = ?, code = ?, price= ?, description = ?, color = ?, guy = ?, category_id = ? WHERE id = ?',
deleteProducts: 'DELETE FROM products WHERE id = ?',
insertCategories: 'INSERT INTO categories (name) VALUES(?)',
updateCategories: 'UPDATE categories SET name = ? WHERE id = ?',
deleteCategories: 'DELETE FROM categories WHERE id = ?',
getimagen: 'SELECT * FROM image',
getimagenID: 'SELECT * FROM image WHERE id = ?',
insertimagen: 'INSERT INTO image (url, destacado, product_id) VALUES(?, ?, ?)',
updateimagen: 'UPDATE image SET url = ?, destacado = ?, product_id = ? WHERE id = ?',
deleteimagen: 'DELETE FROM image WHERE id = ?',
consultable: 'SELECT products.id AS product_id, products.name AS product_name, products.price AS price, products.description AS description, image.url AS image_url, categories.name AS category_name FROM categories INNER JOIN products ON categories.id = products.category_id INNER JOIN image ON image.id = products.id',
getDetalles: 'SELECT products.id AS product_id, products.name AS product_name, products.price AS price, products.description AS description, categories.name AS category_name, products.color AS color, products.guy AS guy, image.url AS image_url FROM products INNER JOIN categories ON categories.id = products.category_id INNER JOIN image ON image.id = products.id WHERE products.id = ?',
getClientByEP: 'SELECT * FROM clients WHERE email = ? AND password = ?',
getClientByEmail: 'SELECT * FROM clients WHERE email = ?',
insertClient: 'INSERT INTO clients (email, password) VALUES (?, ?)',
getClient: 'SELECT * FROM clients',
getClientByID: 'SELECT * FROM clients WHERE id = ?',
insertPurchase: 'INSERT INTO purchases (client_id, product_id, quantity, total_paid, fecha, ip_cliente) VALUES (?, ?, ?, ?, ?, ?)',
getPurchaseByID: 'SELECT * FROM purchases'
}
module.exports = {
    getProducts(){
    return new Promise((resolve, reject)=>{
       db.all(querys.getProducts ,(err, rows) => { 
          if(err) reject(err);
          resolve(rows);
        });
    });
},
getProductsID(id) {
    return new Promise((resolve, reject)=>{
        db.all(querys.getProductsID, [id], (err, rows) => { 
            if(err) reject(err);
            console.log(rows)
            resolve(rows);
          });
      });
},
getCategories(){
    return new Promise((resolve, reject) => {
       db.all(querys.getCategories, (err, rows) => { 
          if(err) reject(err);
          resolve(rows);
        });
    });
},
getCategoriesID(id) { 
    return new Promise((resolve, reject)=>{ 
      db.all(querys.getCategoriesID, [id], (err, rows) => {  
        if(err) reject(err); 
        console.log(rows)
        resolve(rows); 
      }); 
    }); 
  },
insertCategories(name){
    return new Promise((resolve, reject) => {
        db.run(querys.insertCategories, [name], (err) => {
            if(err) reject(err);
            console.log("LA CATEGORIA INGRESADA FUE: ", name);
            resolve();
        })
    });
},

insertProducts(id, name, code, price, description, color, guy, category_id){
    return new Promise((resolve, reject) => {
        db.run(querys.insertProducts, [id, name, code, price, description, color, guy, category_id], (err) => {
            if(err) reject(err);
            console.log("LOS DATOS INSERTADOS FUERON: ", id, name, code, price, description, color, guy, category_id);
            resolve();
        })
    });
},
updateProducts(id, name, code, price, description, color, guy, category_id){
    return new Promise((resolve, reject)=>{
        db.run(querys.updateProducts, [name, code, price, description, color, guy, category_id, id], (err)=>{
            if(err) reject(err);
            resolve();
        })
    });
},
updateCategories(id, name){
    return new Promise((resolve, reject)=>{
        db.run(querys.updateCategories, [name, id], (err)=>{
            if(err) reject(err);
            resolve();
        })
    });
},
deleteProducts(id){
    return new Promise((resolve, reject)=>{
        db.run(querys.deleteProducts, [id], (err, rows) => { 
            if(err) reject(err);
            console.log(rows)
            resolve(rows);
          });
      });
},
deleteCategories(id){
    return new Promise((resolve, reject)=>{
        db.run(querys.deleteCategories, [id], (err, rows) => { 
            if(err) reject(err);
            console.log(rows)
            resolve(rows);
          });
      });
},
getimagen(){
    return new Promise((resolve, reject) => {
        db.all(querys.getimagen, (err, rows) => {
            if(err) reject(err);
            resolve(rows);
        })
    })
},
getimagenID(id){
    return new Promise((resolve, reject) => {
        db.all(querys.getimagenID, [id], (err, rows) => {
            if(err) reject(err);
            resolve(rows);
        })
    })
},
insertimagen(url, destacado, product_id){
    return new Promise((resolve, reject) => {
        db.run(querys.insertimagen, [url, destacado, product_id], (err) => {
            if(err) reject(err);
            resolve();
        })
    })
},
updateimagen(id, url, destacado, product_id){
    return new Promise((resolve, reject) => {
        db.run(querys.updateimagen, [url, destacado, product_id, id], (err) => {
            if(err) reject(err);
            resolve();
        })
    })
},
deleteimagen(id){
    return new Promise((resolve, reject) => {
        db.run(querys.deleteimagen, [id], (err) => {
            if(err) reject(err);
            resolve();
        })
    })
},
consultable(product_name, description, category_name, color, guy) {
    return new Promise((resolve, reject) => {
      let query = `
        SELECT
          products.id AS product_id,
          products.name AS product_name,
          products.price AS price,
          products.description AS description,
          image.url AS image_url,
          categories.name AS category_name
        FROM categories
        INNER JOIN products ON categories.id = products.category_id
        INNER JOIN image ON image.id = products.id
      `;
  
      let whereClause = '';
  
      if (product_name) {
        whereClause += `products.name LIKE '%${product_name}%'`;
      }
  
      if (description) {
        if (whereClause.length > 0) {
          whereClause += ` AND `;
        }
        whereClause += `products.description LIKE '%${description}%'`;
      }
  
      if (category_name) {
        if (whereClause.length > 0) {
          whereClause += ` AND `;
        }
        whereClause += `categories.name = '${category_name}'`;
      }
  
      if (color) {
        if (whereClause.length > 0) {
          whereClause += ` AND `;
        }
        whereClause += `products.color LIKE '%${color}%'`;
      }
  
      if (guy) {
        if (whereClause.length > 0) {
          whereClause += ` AND `;
        }
        whereClause += `products.guy LIKE '%${guy}%'`;
      }
  
      if (whereClause.length > 0) {
        query += ` WHERE ${whereClause}`;
      }
  
      db.all(query, (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  },
getDetalles(product_id) {
    return new Promise((resolve, reject) => {
      db.all(querys.getDetalles, [product_id], (err, rows) => {
        if (err) reject(err);
        console.log(rows)
        resolve(rows);
      });
    });
  },
  getClientByEP(email, password) {
    return new Promise((resolve, reject) => {
      db.all(querys.getClientByEP, [email, password], (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  },

  insertClient(email, password) {
    return new Promise((resolve, reject) => {
      // Verificar si el correo ya existe
      db.all(querys.getClientByEmail, [email], (err, rows) => {
        if (err) {
          reject(err);
        } else if (rows.length > 0) {
          // El correo ya está registrado, devolver un error
          reject(new Error('Correo electrónico ya registrado'));
        } else {
          db.run(querys.insertClient, [email, password], (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        }
      });
    });
  },

  getClient() {
    return new Promise((resolve, reject) => {
      db.all(querys.getClient, (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  },
  getClientByID(id) {
    return new Promise((resolve, reject)=>{
        db.all(querys.getClientByID, [id], (err, rows) => { 
            if(err) reject(err);
            console.log(rows)
            resolve(rows);
          });
      });
},
  // Funciones de compras
  insertPurchase(client_id, product_id, quantity, total_paid, fecha, ip_cliente) {
    return new Promise((resolve, reject) => {
      const query = querys.insertPurchase;
      const values = [client_id, product_id, quantity, total_paid, fecha, ip_cliente];
      db.run(query, values, (err) => {
        if (err) {
          console.error("Error al insertar datos de compra:", err);
          reject(err);
        } else {
          console.log("Datos de compra insertados:", values);
          resolve();
        }
      });
    });
  },  
  getPurchaseByID() {
    return new Promise((resolve, reject) => {
      db.all(querys.getPurchaseByID, (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  },
}