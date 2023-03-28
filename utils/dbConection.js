const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// const contact1 = new contacts({
//   nama: 'rezky desyafa',
//   nohp: '081383040350',
//   email: 'rezkydesyafa@gmail.com',
//   alamat: 'Purwakarta',
// });

// contact1.save().then((contacts) => console.log(contacts));
