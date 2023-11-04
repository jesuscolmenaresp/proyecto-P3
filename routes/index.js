const { name } = require('ejs');
const express = require('express');
const { reset } = require('nodemon');
const router = express.Router();
const db = require('../db/models');
require('dotenv').config();
let login = false;

router.get('/', (req, res) =>{
 if(!login){
  res.render('login');
 }else{
  db.getProducts()
  .then(data => {
    res.render('index', {products: data});
})
.catch(err => {
  res.render('index', {products: []});
});
 }
});

router.get('/', (req, res) => {
  db.getProducts()
    .then(data => {
        res.render('index', {products: data});
    })
    .catch(err => {
      res.render('index', { products: []});
    });
  });

router.get('/categories', (req, res) => {
    db.getCategories()
    .then(data => {
        console.log(data);
        res.render('index', {categories: data });
    });
});

router.get('/insert', (req, res) => {
     res.render('insert');
});

router.post('/insert-product', (req, res) => {
  const {name, code, price, description, color, guy, category_id} = req.body;
  db.insertProducts(name, code, price, description, color, guy, category_id)
  .then(() => {
  res.redirect('/');
  })
  .catch(err => {
    console.log(err);
});
});

router.get('/edit/:id', (req, res) => { 
  const id = req.params.id;
  console.log(id)
  db.getProductsID(id)
  .then(data => {
    res.render('edit', {product: data[0]});
    })
    .catch(err => {
      console.log(err);
      res.render('edit', {product: []});
  });
});

router.get('/edit/:id', (req, res) => { 
  const {id,name, code, price, description, color, guy, category_id} = req.body;
  db.updateProducts(id, name, code, price, description, color, guy, category_id)
  .then(() => {
  res.redirect('/');
  })
  .catch(err => {
    console.log(err);
});
});

router.get('/delete/:id', (req, res) =>{
  const id = req.params.id;
  db.deleteProducts(id)
  .then(() => {
    res.redirect('/');
  })
  .catch(err => {
    console.log(err);
});
});

router.post('/login', (req, res) =>{
  const {user, pass} = req.body;
  if(user == process.env.USER_ADMIN && pass == process.env.PASS_ADMIN){
    login = true;
    res.redirect('/');
  }else{
    login = false;
    res.redirect('/');
  }
  })

module.exports = router;
