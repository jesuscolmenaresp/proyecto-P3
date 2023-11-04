const { name } = require('ejs');
const db = require('./connection');
let querys = {
getCategories: 'SELECT * FROM categories',
getProducts: 'SELECT * FROM products',
getProductsID: 'SELECT * FROM products WHERE id =?',
insertProducts: 'INSERT INTO products (name, code, price, description, color, guy, category_id) VALUES(?, ?, ?, ?, ?, ?, ?)',
updateProducts: 'UPDATE Products SET name = ?, code = ?, price= ?, description = ?, color = ?, guy = ?, category_id = ? WHERE id = ?',
deleteProducts: 'DELETE FROM products WHERE id = ?'
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
        db.run(querys.getProductsID, [id], (err, rows) => { 
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
        })
    })
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
    return new Promise((resolve, reject) => {
        db.run(querys.updateProducts, [name, code, price, description, color, guy, category_id, id], (err)=> {
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
}
}
