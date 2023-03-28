const express = require('express');

const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
const { body, validationResult, check } = require('express-validator');
require('./utils/dbConection');
const Contacts = require('./models/contactmodels');

const app = express();
const port = 5500;

// Setup ejS
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// halaman home
app.get('/', async (req, res) => {
  res.render('index', {
    layout: 'layout/main-layout',
    title: 'Home',
  });
});

app.get('/about', (req, res) => {
  res.render('about', {
    layout: 'layout/main-layout',
    title: 'about',
  });
});
// halaman contact
app.get('/contact', async (req, res) => {
  const contact = await Contacts.find();

  res.render('contact', {
    layout: 'layout/main-layout',
    title: 'contact',
    contact,
  });
});

// update data
app.post(
  '/contact',
  [
    body('nama').custom(async (value) => {
      const duplikat = await Contacts.findOne({ nama: value });
      if (duplikat) {
        throw new Error('Nama yang anda masukan suda ada !');
      }
      return true;
    }),
    check('email', 'Email tidak valid !').isEmail(),
    check('nohp', 'nomor tidak valid !').isMobilePhone('id-ID'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return res.status(400).json({ errors: errors.array() });
      res.render('add-contact', {
        layout: 'layout/main-layout',
        title: 'contact',
        errors: errors.array(),
      });
    } else {
      Contacts.insertMany(req.body);
      res.redirect('/contact');
    }
  }
);
// halaman add contact
app.get('/contact/add', (req, res) => {
  res.render('add-contact', {
    layout: 'layout/main-layout',
    title: 'contact',
  });
});
// halaman detail
app.get('/contact/:nama', async (req, res) => {
  const contacts = await Contacts.findOne({ nama: req.params.nama });

  res.render('detail', {
    layout: 'layout/main-layout',
    title: 'contact',
    contacts,
  });
});

// app.delete('/contact/:nama', async (req, res) => {
//   const contacts = await Contacts.findOne({ nama: req.params.nama });
//   if (!contacts) {
//     res.status(404);
//     res.send('<h1>Kotak tidak ada</h1>');
//   } else {
//     contacts.deleteOne({ _id: contacts._id });
//     res.redirect('/contact');
//   }
// });

app.delete('/contact', (req, res) => {
  Contacts.deleteOne({ nama: req.body.nama }).then((result) => {
    res.redirect('/contact');
  });
});

// edit data
app.get('/contact/edit/:nama', async (req, res) => {
  const contacts = await Contacts.findOne({ nama: req.params.nama });

  res.render('edit-contact', {
    layout: 'layout/main-layout',
    title: 'edit Contacts',
    contacts,
  });
});

app.put(
  '/contact',
  [
    body('nama').custom(async (value) => {
      const duplikat = await Contacts.findOne({ nama: value });
      if (value !== req.body.oldnama && duplikat) {
        throw new Error('Nama yang anda masukan sudah ada !');
      }
      return true;
    }),
  ],
  (req, res) => {
    //   res.render('edit-contact', {
    //     layout: 'layout/main-layout',
    //     title: 'contact',
    //     errors: errors.array(),
    //     contacts: req.body,
    //   });
    Contacts.updateOne(
      { _id: req.body._id },
      {
        $set: {
          nama: req.body.nama,
          nohp: req.body.nohp,
          email: req.body.email,
          alamat: req.body.alamat,
        },
      }
    ).then((result) => {
      res.redirect('/contact');
    });
  }
);

app.listen(port, () => {
  console.log(`Mongo contact app is running in port ${port}`);
});
