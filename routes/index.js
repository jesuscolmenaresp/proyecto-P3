const { name } = require('ejs');
const express = require('express');
const { reset } = require('nodemon');
const router = express.Router();
const db = require('../db/models');
require('dotenv').config();
let login = false;

router.get('/', (req, res) => {
  const { product_name, description, category_name, color, guy } = req.query;
  db.consultable(product_name, description, category_name, color, guy)
    .then(products => {
      res.render('listaproduct', { products: products });
    })
    .catch(err => {
      console.error(err);
      res.render('listaproduct', { products: [] });
    });
});

router.get('/filters', (req, res) => {
res.render('filters')
});

router.get('/detalles/:id', (req, res) => {
  const productId = req.params.id;
  db.getDetalles(productId)
    .then(products => {
      if (products.length > 0) {
        res.render('detalles', { products: products });
      } else {
        res.render('product_not_found');
      }
    })
    .catch(err => {
      console.error(err);
      res.render('error', { error: err.message });
    });
});
router.post('/login', (req, res) =>{
  const {user, pass} = req.body;
  if(user == process.env.USER_ADMIN && pass == process.env.PASS_ADMIN){
    login = true;
    res.redirect('/login');
  }else{
    login = false;
    res.redirect('/');
  };
  });

router.get('/login', (req, res) => {
  if(!login){
    res.render('login');
  } else {
    Promise.all([db.getProducts(), db.getCategories()])  
      .then(([products, categories]) => {
        res.render('index', { products: products, categories: categories});
      })
      .catch(err => {
        console.error(err);
        res.render('index', { products: [], categories: []}); 
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
  res.render('img')
})

router.post('/img', (req, res) => {
  const {url, destacado, product_id} = req.body;
  console.log(url, destacado, product_id);
  db.insertimagen(url, destacado, product_id)
  .then(() => {
    res.redirect('tabimagen')
    })
    .catch(err => {
    console.log(err);
    })
  });
  
router.post('/editima/', (req, res)=>{
  const {id, url, destacado, product_id} = req.body;
  db.updateimagen(id, url, destacado, product_id)
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
