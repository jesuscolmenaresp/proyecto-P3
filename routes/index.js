const { name } = require('ejs');
const express = require('express');
const { reset } = require('nodemon');
const router = express.Router();
const db = require('../db/models');
require('dotenv').config();
let login = false;

router.get('/', (req, res) => {
  if(!login){
    res.render('login');
  } else {
    Promise.all([db.getProducts(), db.getCategories()]) 
      .then(([products, categories]) => {
        res.render('index', { products: products, categories: categories });
      })
      .catch(err => {
        console.error(err);
        res.render('index', { products: [], categories: [] }); 
      });
  }
});

router.get('/', (req, res) => {
  db.getProducts()
    .then(data => {
        res.render('index', {products: data});
    })
    .catch(err => {
      res.render('index', {products: []});
    });
  });

router.get('/', (req, res) => {
    db.getCategories()
    .then(data => {
        res.render('index', {categories: data});
      })
      .catch(err => {
        res.render('index', {categories: []});
      });
    });

router.get('/insert', (req, res) => {
  res.render('insert');
});

router.get('/insertcategories', (req, res) => {
  res.render('insertcategories');
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
})

router.post('/insert-categorie', (req, res) => {
  const {name} = req.body;
  db.insertCategories(name)
  .then(() => {
  res.redirect('/');
  })
  .catch(err => {
    console.log(err);
});
})

router.get('/edit/:id', (req, res)=>{ 
  const id = req.params.id;
  console.log(id);
  db.getProductsID(id)
.then(data => {
    res.render('edit', {product: data[0]});
    })
    .catch(err => {
      console.log(err);
      res.render('edit', {product: []});
  });
});

router.post('/edit/', (req, res)=>{ 
  const {id, name, code, price, description, color, guy, category_id} = req.body;
  db.updateProducts(id, name, code, price, description, color, guy, category_id)
  .then(() => {
  res.redirect('/');
  })
  .catch(err => {
    console.log(err);
});
});

router.get('/editcategories/:id', (req, res)=>{
  const id = req.params.id;
  console.log(id);
  db.getCategoriesID(id)
.then(data => {
   res.render('editcategories', {categorie: data[0]});
    })
    .catch(err => {
      console.log(err);
      res.render('editcategories', {categorie: []});
    });
});

router.post('/editcategories/', (req, res)=>{ 
  const {id, name} = req.body;
  db.updateCategories(id, name)
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

router.get('/deletes/:id', (req, res) =>{
  const id = req.params.id;
  db.deleteCategories(id)
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

router.get('/tabimagen', (req, res) => {
  db.getimagen()
  .then(data => {        
  console.log(data)
    res.render('tabimagen', {image: data });
    })
    .catch(err => {
        res.render('tabimagen', {image: [] });
    })
  });
  
router.get('/img', (req, res) => {
  res.render('img');
})

router.post('/img', (req, res) => {
  const {url, producto_id, destacado} = req.body;
  console.log(url, producto_id, destacado);
  db.insertProducts(url, producto_id, destacado)
  .then(() => {
    res.redirect('tabimagen')
    })
    .catch(err => {
    console.log(err);
    })
  });
  
router.post('/editima/', (req, res)=>{
  const {id, url, producto_id, destacado} = req.body;
  db.updateimagen(id, url, producto_id, destacado)
  .then(() =>{
  res.redirect('/tabimagen');
  })
  .catch(err =>{
    console.log(err);
    })
  });

router.get('/editima/:id', (req, res)=>{
  const id = req.params.id
  db.getimagenID(id)
  .then(data =>{
  console.log(data)
    res.render('editima', {image: data[0]})
    })
    .catch(err =>{
    console.log(err);
    res.render('editima', {image: []})
    })
  }); 

router.get('/deleteima/:id', (req, res)=>{
  const id = req.params.id;
  db.deleteimagen(id)
  .then(() => {
  res.redirect('/tabimagen');
    })
    .catch(err => {
    console.log(err);
    });
  })      

module.exports = router;
