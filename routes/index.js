const { name } = require('ejs');
const express = require('express');
const session = require('express-session');
const axios = require('axios');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { reset } = require('nodemon');
const router = express.Router();
const db = require('../db/models');
require('dotenv').config();
let login = false;

router.get('/', async (req, res) => {
  try {
    const loggedIn = req.session && req.session.client;
    const username = loggedIn ? req.session.client.email : null;   
    const { product_name, description, category_name, color, guy, sort } = req.query;
    let products;
    if (sort === 'calificacion') {
      // Obtener productos ordenados por calificación
      products = await db.getProductsOrderedByRating();
    } else {
      // Obtener productos según los filtros
      products = await db.consultable(product_name, description, category_name, color, guy);
    }
    if (loggedIn) {
      // Usuario logueado
      res.render('userlogin', { loggedIn, username, products, product_name });
    } else {
      // Usuario no logueado
      res.render('listaproduct', { products, loggedIn });
    }
  } catch (err) {
    console.error(err);
    res.render('error', { error: err.message });
  }
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

router.get('/filters', (req, res) => {
res.render('filters')
});

router.get('/detalles/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await db.getDetalles(productId);

    const loggedIn = req.session && req.session.client;

    if (product.length > 0) {
      // Selecciona el primer producto si hay detalles disponibles
      const selectedProductIds = [productId];
      req.session.selectedProductIds = selectedProductIds;

      res.render('detalles', { loggedIn, products: product });
    } else {
      res.render('product_not_found', { loggedIn });
    }
  } catch (err) {
    console.error(err);
    res.render('error', { error: err.message });
  }
});

router.get('/insert', async (req, res) => {
  try {
    const categories = await db.getCategories(); // Asegúrate de implementar esta función en tu módulo db
    res.render('insert', { categories });
  } catch (error) {
    console.error('Error al obtener categorías para el formulario de inserción:', error);
    // Manejar el error apropiadamente
    res.status(500).send('Error interno del servidor');
  }
});
router.get('/insertcategories', (req, res) => {
  res.render('insertcategories');
});

router.post('/insert-product', (req, res) => {
const {id, name, code, price, description, color, guy, category_id} = req.body;
db.insertProducts(id,name, code, price, description, color, guy, category_id)
.then(() => {
res.redirect('/login');
})
.catch(err => {
 console.log(err);
});
})

router.post('/insert-categorie', (req, res) => {
  const {name} = req.body;
  db.insertCategories(name)
  .then(() => {
  res.redirect('/login');
  })
  .catch(err => {
    console.log(err);
});
})

router.get('/edit/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const product = await db.getProductsID(id);
    const categories = await db.getCategories(); // Asegúrate de implementar esta función en tu módulo db

    res.render('edit', { product: product[0], categories });
  } catch (error) {
    console.error('Error al obtener información para la edición:', error);
    // Manejar el error apropiadamente
    res.status(500).send('Error interno del servidor');
  }
});

router.post('/edit/', (req, res)=>{ 
  const {id, name, code, price, description, color, guy, category_id} = req.body;
  db.updateProducts(id, name, code, price, description, color, guy, category_id)
  .then(() => {
  res.redirect('/login');
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
  res.redirect('/login');
  })
  .catch(err => {
    console.log(err);
});
});

router.get('/delete/:id', (req, res) =>{
  const id = req.params.id;
  db.deleteProducts(id)
  .then(() => {
    res.redirect('/login');
  })
  .catch(err => {
    console.log(err);
});
});

router.get('/deletes/:id', (req, res) =>{
  const id = req.params.id;
  db.deleteCategories(id)
  .then(() => {
    res.redirect('/login');
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
    // Obtener la lista de productos de la base de datos
    db.getProducts()
        .then(products => {
            res.render('img', { products });
        })
        .catch(err => {
            console.log(err);
            res.render('img', { products: [] });
        });
});

router.post('/img', (req, res) => {
  const {id, url, destacado, product_id} = req.body;
  console.log(id, url, destacado, product_id);
  db.insertimagen(id, url, destacado, product_id)
  .then(() => {
    res.redirect('/tabimagen')
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

// Rutas relacionadas con clientes
router.get('/registerclient', (req, res) => {
  res.render('registerclient');
});

router.post('/register', (req, res) => {
  const { email, password } = req.body;
  db.insertClient(email, password)
    .then(() => {
      // Envío de correo de bienvenida
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        },
      });
      

      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email, // Envía el correo de bienvenida al correo electrónico del cliente registrado
        subject: 'Bienvenido a Nuestra Tienda',
        text: 'Gracias por registrarte en nuestra tienda SecureView. Esperamos que disfrutes de tus compras.',
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error al enviar el correo de bienvenida:', error);
        } else {
          console.log('Correo electrónico de bienvenida enviado: ' + info.response);
        }
      });
      // Redirecciona después de enviar el correo de bienvenida
      res.redirect('/');
    })
    .catch(err => {
      console.log('Error en el registro:', err.message);
      if (err.message === 'Correo electrónico ya registrado') {
        res.render('registerclient', { error: 'El correo electrónico ya está registrado, INGRESE OTRO' });
      } else {
        console.log(err);
        res.render('error', { error: err.message });
      }
    });
});

router.get('/loginclient', (req, res) => {
  if (!req.session.client) {
    res.render('loginclient');
    console.log("inicio sesion correctamente");
  } else {
    // Ya hay una sesión activa para el cliente, puedes redirigirlo a otra página si es necesario
    res.redirect('/');
  }
});

router.post('/loginc', (req, res) => {
  const { email, password } = req.body;
  db.getClientByEP(email, password)
    .then(client => {
      if (Array.isArray(client) && client.length > 0) {
        // Las credenciales son correctas, puedes almacenar información del cliente en la sesión si es necesario
        req.session.client = client[0];
        console.log('Sesión del cliente después del inicio de sesión:', req.session.client);
        res.redirect('/');
      } else {
        // Las credenciales son incorrectas, renderiza la página de inicio de sesión con un mensaje de error
        res.render('loginclient', { locals: res.locals, error: 'Datos incorrectos. Intente nuevamente.' });
      }
    })
    .catch(err => {
      console.error('Error en el inicio de sesión:', err.message);
      res.render('error', { message: 'Error en el inicio de sesión', error: err });
    });
});

router.get('/logout', (req, res) => {
  // Eliminar la sesión del cliente
  req.session.destroy(err => {
    if (err) {
      console.error('Error al cerrar sesión:', err.message);
      res.render('error', { message: 'Error al cerrar sesión', error: err });
    } else {
      // Redirigir a la página principal después de cerrar sesión
      res.redirect('/');
    }
  });
});

router.get('/clients/:id', (req, res) => {
  const clientId = req.params.id;
  db.getClientByID(clientId)
    .then(client => {
      res.render('client', { client: client });
    })
    .catch(err => {
      console.error(err);
      res.render('error', { error: err.message });
    });
});

// GET /formulario
router.get('/formulario', async (req, res) => {
  try {
    console.log('Entered /formulario route');

    const loggedInClient = req.session.client;

    // Obtener los parámetros de la URL
    const { product_id, product_name, product_price } = req.query;

    // Verificar si se proporcionan todos los parámetros necesarios
    if (!product_id || !product_name || !product_price) {
      throw new Error('Faltan parámetros en la URL');
    }

    // Crear un objeto de producto con los detalles de la URL
    const selectedProduct = {
      id: parseInt(product_id),
      name: product_name,
      price: parseFloat(product_price)
    };

    // Renderizar el formulario con el producto seleccionado
    res.render('formulario', { loggedInClient, products: [selectedProduct], ip_cliente: req.ip });

  } catch (error) {
    console.error(error);
    res.status(500).render('error', { error: 'Error interno del servidor', details: error.message });
  }
});

router.get('/purchases', async (req, res) => {
  try {
    const loggedIn = req.session && req.session.client;
    if (!loggedIn) {
      return res.redirect('/registerclient');
    }

    const selectedProductIds = req.session.selectedProductIds || [];
    const products = await db.getProducts(selectedProductIds);

    if (products && products.length > 0) {
      res.render('formulario', { products, total_paid: 0.00 });
    } else {
      // Manejar la situación en la que no hay productos en la sesión
      return res.render('error', { error: 'No hay productos en la sesión' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { error: 'Error interno del servidor', details: error.message });
  }
});

router.post('/purchases', async (req, res) => {
  try {
    const { client_id, product_id, quantity, total_paid, credit_card, ip_cliente, cvv, expiry_date} = req.body;
    const response = await axios.post('https://fakepayment.onrender.com/', {
      "amount": total_paid,         
      "card-number": credit_card,
      "cvv": cvv,
      "expiration-month": expiry_date.slice(0, 2), // primeros dos caracteres para el mes
      "expiration-year": expiry_date.slice(4),    // últimos cuatro caracteres para el año
      "full-name": "APPROVED",
      "currency": "USD",
      "description": "Compra de productos",
      "reference": `client_id:${client_id},product_id:${product_id}`,
    }, {
      headers: {
        Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSm9obiBEb2UiLCJkYXRlIjoiMjAyNC0wMS0xMlQyMDo1MToyMC4zNTVaIiwiaWF0IjoxNzA1MDkyNjgwfQ.bbWoYq2gu3P3neICr7ZKheU0q6OEF1D1ItdG__vavZo'
      }
    });    
    if (response.data.success) {
      await db.insertPurchase(client_id, product_id, quantity, total_paid, new Date(), ip_cliente);
      req.session.selectedProductIds = [];
      res.redirect('/confirmacion');
    } else {
      res.render('error', { error: 'Error en la validación de pago' });
    }
  } catch (error) {
    console.error(error);
    res.render('error', { error: error.message });
  }
});

router.get('/confirmacion', (req, res) => {
  res.render('confirmacion');
});

router.get('/purchases/:purchaseID', (req, res) => {
  const purchaseID = req.params.purchaseID;
  db.getPurchaseByID(purchaseID)
    .then(purchase => {
      res.render('purchase', { purchase: purchase });
    })
    .catch(err => {
      console.error(err);
      res.render('error', { error: err.message });
    });
});

// Ruta para la vista de todas las compras y clientes
router.get('/compras', async (req, res) => {
  try {
    const clients = await db.getClient();
    const purchases = await db.getPurchaseByID();

    res.render('compras', { clients, purchases });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { error: 'Error interno del servidor', details: error.message });
  }
});

router.post('/process-purchase', async (req, res) => {
  try {
    const loggedInClient = req.session.client;

    // Obtener los datos del formulario
    const { client_id, product_id, quantity, total_paid, credit_card, expiry_date, cvv, ip_cliente } = req.body;

    // Obtener la fecha actual
    const fecha = new Date().toISOString();

    // Insertar la compra en la base de datos
    await db.insertPurchase(client_id, product_id, quantity, total_paid, fecha, ip_cliente);

    // Envío de correo de confirmación
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: loggedInClient.email, // Envía el correo de confirmación al correo electrónico del cliente registrado
      subject: 'Confirmación de Compra',
      text: `Gracias por tu compra. Detalles de la compra:\n\nProducto: ${product_id}\nCantidad: ${quantity}\nTotal Pagado: ${total_paid}\nFecha de Compra: ${fecha}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error al enviar el correo de confirmación:', error);
      } else {
        console.log('Correo electrónico de confirmación enviado:', info.response);
      }
    });

    // Redirigir a una página de éxito o a donde desees
    res.render('confirmacion', {
      loggedInClient,
      purchase: { product_id, quantity, total_paid, fecha }
    });

  } catch (error) {
    console.error(error);
    res.status(500).render('error', { error: 'Error interno del servidor', details: error.message });
  }
});

router.get('/listacalificaciones', async (req, res) => {
  try {
    const products = await db.getProductsOrderedByRating();
    const message = req.query.message || null; // Obtén el mensaje de los parámetros de la URL
    res.render('listacalificaciones', { products, loggedIn: req.session && req.session.client, message });
  } catch (err) {
    console.error(err);
    res.render('error', { error: err.message });
  }
});

// Ruta para mostrar la vista de calificación
router.get('/calificar/:id', async (req, res) => {
  const productId = req.params.id;
  const clientId = req.session.client.id;
  try {
    // Verificar si el cliente ya ha calificado el producto
    const hasRated = await db.hasClient(productId, clientId);
    // Obtén los detalles del producto para mostrar en la vista de calificación
    const product = await db.getProductDetailsForRating(productId);
    // Renderiza la vista de calificación con los detalles del producto y la información sobre si ya ha calificado
    res.render('calificar', { product, loggedIn: req.session && req.session.client, hasRated });
  } catch (err) {
    console.error(err);
    res.render('error', { error: err.message });
  }
});

// Ruta para procesar la calificación
router.post('/calificar/:id', async (req, res) => {
  const productId = req.params.id;
  const { rating } = req.body;
  const clientId = req.session.client.id;
  try {
    await db.insertProductRating(productId, clientId, rating);
    res.redirect(`/listacalificaciones?message=Calificación exitosa para el producto ${productId}`);
  } catch (err) {
    console.error(err);
    res.render('error', { error: err.message });
  }
});

router.get('/recover-password', (req, res) => {
  res.render('recuperarpassword');
});

router.post('/recover-password', async (req, res) => {
  try {
    const { email } = req.body;
    const recoveryToken = crypto.randomBytes(32).toString('hex');
    const expiryDate = new Date(Date.now() + 3600000); // Vence en 1 hora

    // Almacena el token y la fecha de expiración en la base de datos
    await db.updateResetToken(email, recoveryToken, expiryDate);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

// Detalles del correo electrónico
const mailOptions = {
  from: process.env.GMAIL_USER,
  to: email,
  subject: 'Recuperación de Contraseña',
  text: `Haga clic en el siguiente enlace para restablecer su contraseña: https://camarasdesegurida.onrender.com/reset-password?token=${recoveryToken}`,
};
    // Envía el correo electrónico
    await transporter.sendMail(mailOptions);

    // Renderiza la página de confirmación
    res.render('passwordRecoveryConfirmation', { email });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { error: 'Error interno del servidor', details: error.message });
  }
});
// Ruta GET para mostrar la página de restablecimiento de contraseña
router.get('/reset-password', async (req, res) => {
  const { token } = req.query;
  console.log('Token:', token);
  try {
    const isTokenValid = await db.isValidResetToken(token);

    if (isTokenValid) {
      // Inicializa passwordChanged como falso al cargar la página
      res.render('resetPassword', { token, passwordChanged: false });
    } else {
      res.render('passwordRecoveryError', { error: 'El token no es válido o ha expirado.' });
    }
  } catch (error) {
    console.error('Error al verificar el token:', error);
    res.status(500).render('error', { error: 'Error interno del servidor', details: error.message });
  }
});
// Ruta POST para manejar el envío del formulario de restablecimiento de contraseña
router.post('/reset-password', async (req, res) => {
  const { token, new_password, confirm_password } = req.body;

  try {
    const isTokenValid = await db.isValidResetToken(token);
    if (isTokenValid) {
      // Verifica que las contraseñas coincidan
      if (new_password !== confirm_password) {
        return res.render('passwordRecoveryError', { error: 'Las contraseñas no coinciden.' });
      }
      // Lógica para actualizar la contraseña en la base de datos
      await db.updatePasswordUsingToken(token, new_password);
      res.redirect(`/loginclient?passwordChanged=true`);
    } else {
      res.render('passwordRecoveryError', { error: 'El token no es válido o ha expirado.' });
    }
  } catch (error) {
    console.error('Error al procesar la solicitud de restablecimiento de contraseña:', error);
    res.status(500).render('error', { error: 'Error interno del servidor', details: error.message });
  }
});

module.exports = router;
