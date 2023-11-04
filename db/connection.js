const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/database.sqlite', (err)=>{
    if(err) console.log(err);
 db.run('CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)');
 db.run('CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, code TEXT NOT NULL, price REAL, description TEXT, color TEXT, guy TEXT, category_id INTEGER, FOREIGN KEY(category_id) REFERENCES categories(id))');
 db.run('CREATE TABLE IF NOT EXISTS image (id INTEGER PRIMARY KEY AUTOINCREMENT, url TEXT,  destacado INTEGER, product_id INTEGER, FOREIGN KEY(product_id) REFERENCES products(id))');
 console.log('Base de datos creada');
});

module.exports = db;