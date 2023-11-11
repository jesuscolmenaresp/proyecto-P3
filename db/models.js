const { name } = require('ejs');
const db = require('./connection');

let querys = {
getCategories: 'SELECT * FROM categories',
getCategoriesID: 'SELECT * FROM categories WHERE id = ?',
getProducts: 'SELECT * FROM products',
getProductsID: 'SELECT * FROM products WHERE id = ?',
insertProducts: 'INSERT INTO products (name, code, price, description, color, guy, category_id) VALUES(?, ?, ?, ?, ?, ?, ?)',
updateProducts: 'UPDATE products SET name = ?, code = ?, price= ?, description = ?, color = ?, guy = ?, category_id = ? WHERE id = ?',
deleteProducts: 'DELETE FROM products WHERE id = ?',
insertCategories: 'INSERT INTO categories (name) VALUES(?)',
updateCategories: 'UPDATE categories SET name = ? WHERE id = ?',
deleteCategories: 'DELETE FROM categories WHERE id = ?',
insertimagen: 'INSERT INTO image (url, product_id, destacado) VALUES(?, ?, ?)',
getimagenID: 'SELECT * FROM image WHERE id = ?',
getimagen: 'SELECT * FROM image',
updateimagen: 'UPDATE image SET url = ?, producto_id = ?, destacado = ? WHERE id = ?',
deleteimagen: 'DELETE FROM image WHERE id = ?'
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

insertProducts(name, code, price, description, color, guy, category_id){
    return new Promise((resolve, reject) => {
        db.run(querys.insertProducts, [name, code, price, description, color, guy, category_id], (err) => {
            if(err) reject(err);
            console.log("LOS DATOS INSERTADOS FUERON: ", name, code, price, description, color, guy, category_id);
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
insertimagen(url, producto_id, destacado){
    return new Promise((resolve, reject) => {
        db.run(querys.insertimagen, [url, producto_id, destacado], (err) => {
            if(err) reject(err);
            resolve();
        })
    })
},
updateimagen(id, url, producto_id, destacado){
    return new Promise((resolve, reject) => {
        db.run(querys.updateimagen, [url, producto_id, destacado, id], (err) => {
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
}
}
