const express = require('express');
var router = express.Router();
var mydb = require('../dbHelpers');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
//require('dotenv').config();


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/register/', function(req, res, next){
  res.render('users/register');
});

router.post('/register/', async function(req, res, next){
  try{
    form = req.body;
    var data = {
      login: form.login,
      password: form.password,
      passwordConfirm: form.passwordConfirm,
      name: form.name,
      surname: form.surname
    };
    var checkArray = await mydb.checkUser(data.login);
    if (checkArray[0]){
      return res.status(409).send('Пользователь с таким логином уже существует!');
    }
    if (data.password === data.passwordConfirm){
      const newUser = {
        login: data.login, 
        password: await bcrypt.hash(data.password, 7),
        name: data.name,
        surname: data.surname,
        role_title: 'Operator'
      };
      var returnValue = await mydb.registerUser(newUser);
      console.log(returnValue);
      res.redirect('./login/');
    }
    else{
      res.redirect('./register/');
    }
  } catch(err){
    console.log(err);
  }
  
  
});

router.get('/login/', function(req, res, next){
  res.render('users/login');
});

router.post('/login/', async function(req, res, next){
  try{
    form = req.body;
    const user = {
      login: form.login,
      password: form.password
    }
    console.log(user);
    var userDB = (await mydb.checkUser(user.login))[0];
    if (userDB && await bcrypt.compare(user.password, userDB.password)){
      const token = generateAccessToken(user.login, userDB.role_title);
      //res.setHeader('TOKEN', token);
      let signedOptions = {
        maxAge: 1000 * 60 * 60 *4 , // would expire after 4 hours
        httpOnly: false, // The cookie only accessible by the web server
        signed: true, // Indicates if the cookie should be signed
      }
      
      let unsignedOptions = {
        maxAge: 1000 * 60 * 60 *4 , // would expire after 4 hours
        httpOnly: false, // The cookie only accessible by the web server
        signed: false, // Indicates if the cookie should be signed
      }

      // Set cookie
      res.cookie('LOGIN', user.login, unsignedOptions);
      res.cookie('ROLE', userDB.role_title, signedOptions);
      res.cookie('TOKEN', token, signedOptions); // options is optional
      res.redirect('../');
    }
    else{
      res.status(400).send('Неверные данные!');
    }
  } catch(err){
    console.log(err);
  }
  
});

router.get('/logout/', auth, function(req, res, next){
  if (req.signedCookies['TOKEN']){
    res.clearCookie('TOKEN');
    res.clearCookie('LOGIN');
    res.clearCookie('ROLE');
  }
  res.redirect('../../');
});

function generateAccessToken(login, role_title) {
  return jwt.sign({
    login: login,
    role_title: role_title
  }, process.env.TOKEN_SECRET, { expiresIn: '4h' });
}

module.exports = router;
