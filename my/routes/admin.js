const express = require('express');
const router = express.Router();
const mydb = require('../dbHelpers');
const bcrypt = require('bcryptjs');
const adminAuth = require('../middleware/adminAuth');

/* Админка */
router.get('/', adminAuth, async function(req, res, next) {
  var users = await mydb.getUsers();
  res.render('admin/adminIndex', { users: users });
});

router.get('/user/create', adminAuth, function(req, res, next){
  res.render('admin/createUser');
});

router.post('/user/create', adminAuth, async function(req, res, next){
  try{
    form = req.body;
    var data = {
      login: form.login,
      password: form.password,
      passwordConfirm: form.passwordConfirm,
      name: form.name,
      surname: form.surname,
      role_id: form.role_id
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
        role_id: data.role_id
      };
      var returnValue = await mydb.registerUser(newUser);
      console.log(returnValue);
      res.redirect('./');
    }
    else{
      res.redirect('./user/create');
    }
  } catch(err){
    console.log(err);
  }
});

router.get('/user/edit/:login', adminAuth, async function(req,res, next){
  try{
    if (req.params.login){
      var userInfo = await mydb.getUserInfoByLogin(req.params.login);
      if (userInfo){
        res.render('admin/editUser', {userInfo: userInfo[0]});
      }
      else{
        res.redirect('/');
      }
    }
    else{
      res.redirect('/');
    }
  } catch(err){
    console.log(err);
  }
});

router.post('/user/edit/:login', adminAuth, async function(req, res, next){
  try{
    form = req.body;
    var data = {
      login: form.login,
      password: await bcrypt.hash(form.password, 7),
      name: form.name,
      surname: form.surname,
      role_id: form.role_id
    };
    await mydb.editUser(data, req.params.login);
    res.redirect('/');
  } catch(err){
    console.log(err);
  }
});

router.get('/user/delete/:login', adminAuth, async function(req, res, next){
  var user = (await mydb.getUserInfoByLogin(req.params.login))[0];
  console.log(user);
  if (!user){
    res.redirect('/');
  }
  else{
    res.render('admin/deleteUser', {user: user});
  }
});

router.post('/user/delete/:login', adminAuth, async function(req, res, next){
  await mydb.deleteUser(req.params.login);
  res.redirect('/');
});

router.get('/test/create', adminAuth, function(req, res, next) {
  res.render('admin/createTest');
});


router.post('/test/create', adminAuth, async function(req, res, next) {
  // зарегистрировать тест на пользователя
  const newTest = {
    creator_login: req.body.creator,
    content: JSON.stringify(req.body.questionsFormArray)
  };
  await mydb.createTest(newTest);

  res.redirect('/');
});

router.get('/test/delete/:test_id', adminAuth, async function(req, res, next){
  var test = (await mydb.getTestById(req.params.test_id))[0];
  console.log(test);
  if (!test){
    res.redirect('/');
  }
  else{
    res.render('admin/deleteTest', {test: test});
  }
});

router.post('/test/delete/:test_id', adminAuth, async function(req, res, next){
  await mydb.deleteTest(req.params.test_id);
  res.redirect('/');
});

router.get('/search', adminAuth, function(req, res, next){
  res.render('admin/search');
});

router.get('/search/tests', adminAuth, function(req, res, next){
  res.render('admin/searchTest', {});
});

router.post('/search/tests', adminAuth, async function(req, res, next){
  var form = req.body;
  var tests = [];
  var context = {};
  if (form.login && !form.test_id){
    tests = await mydb.getTestsByUserLogin(form.login);
  }
  else if (form.test_id){
    tests = await mydb.getTestById(form.test_id);
  }
  if (!tests){
    context = {
      tests: []
    }
  }
  else {
    context = {
      tests: tests, 
      login: tests[0].creator_login
    } 
  }

  res.status(200).send(context);
});

router.get('/search/users', adminAuth, function(req, res, next){
  res.render('admin/searchUser', {});
});

router.post('/search/users', adminAuth, async function(req, res, next){
  var form = req.body;
  var users = [];
  var context = {};
  var query = {};
  if (form.login){
    query.login = form.login
  }
  if (form.name){
    query.name = form.name
  }
  if (form.surname){
    query.surname = form.surname
  }
  
  users = await mydb.getUsersByQuery(query) || [];

  context = {
    users: users
  }

  res.status(200).send(context);
});

module.exports = router;