const express = require('express');
const router = express.Router();
const mydb = require('../dbHelpers');
const bcrypt = require('bcryptjs');
const adminAuth = require('../middleware/adminAuth');

/*
* | ЭТОТ ФАЙЛ
* | ЧИТАЙ
* | С НИЗУ ВВЕРХ (просто, я начал в таком прядке почему-то комментировать =) )
*/

/* Админка */
router.get('/', adminAuth, async function(req, res, next) {
  res.render('admin/adminIndex', {});
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
      role_title: form.role_title
    };

    if ((await mydb.checkUser(data.login))[0]) // можно упростить
      return res.status(409).send('Пользователь с таким логином уже существует!');

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
      res.redirect('/admin');
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
        res.redirect('/admin');
      }
    }
    else{
      res.redirect('/admin');
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
      role_title: form.role_title
    };
    await mydb.editUser(data, req.params.login);
    res.redirect('/admin');
  } catch(err){
    console.log(err);
  }
});

router.get('/user/delete/:login', adminAuth, async function(req, res, next){
  var user = (await mydb.getUserInfoByLogin(req.params.login))[0];
  console.log(user);
  if (!user){
    res.redirect('/admin');
  }
  else{
    res.render('admin/deleteUser', {user: user});
  }
});

router.post('/user/delete/:login', adminAuth, async function(req, res, next){
  await mydb.deleteUser(req.params.login);
  res.redirect('/admin');
});

router.get('/test/create', adminAuth, function(req, res, next) {
  res.render('admin/createTest');
});


router.post('/test/create', adminAuth, async function(req, res, next) {
  // зарегистрировать тест на пользователя
  const newTest = {
    creator_login: req.body.creator_login,
    content: JSON.stringify(req.body.content)
  };
  await mydb.createTest(newTest);

  res.redirect('/admin');
});

router.get('/test/edit/:test_id', adminAuth, async function(req, res, next){
  try{
    if (req.params.test_id){
      var test = (await mydb.getTestById(req.params.test_id))[0];
      if (!test){
        res.redirect('/admin');
      }
      else{
        res.render('admin/editTest', {test: test});
      }
    }
    else{
      res.redirect('/admin');
    }
  } catch(err){
    console.log(err);
  }
});

router.post('/test/edit/:test_id', adminAuth, async function(req, res, next){
  try{
    const form = req.body; // забыл объявить переменную
    if (req.params.test_id){
      let context = {
        creator_login: form.creator_login,
        content: JSON.stringify(form.content)
      }
      await mydb.editTest(context, parseInt(req.params.test_id));
    }
    res.redirect('/admin');
  } catch(err){
    console.log(err);
  }
});

/*
router.get('/test/get/:test_id', adminAuth, async function(req, res, next){
  var test = await mydb.getTestById(req.params.test_id);
  if (!test){
    res.status(404).send({});
  }
  else{
    res.status(200).send(test);
  }
});
*/

router.get('/test/delete/:test_id', adminAuth, async function(req, res, next){
  var test = (await mydb.getTestById(req.params.test_id))[0];
  console.log(test);
  if (!test){
    res.redirect('/admin');
  }
  else{
    res.render('admin/deleteTest', {test: test});
  }
});

router.post('/test/delete/:test_id', adminAuth, async function(req, res, next){
  await mydb.deleteTest(req.params.test_id);
  res.redirect('/');
});

router.get('/result/edit/:result_id', adminAuth, async function(req,res, next){
    // Слишком большая вложенность, стараться либо упростить до читемого вида, либо
    // упростить по логике

  if (req.params.result_id){
    var resultInfo = await mydb.getResultByResultId(req.params.result_id);
    if (resultInfo)
      res.render('admin/editResult', {resultInfo: resultInfo[0]});
    else
      res.redirect('/admin');
  }
  else
    res.redirect('/admin');
});

router.post('/result/edit/:result_id', adminAuth, async function(req, res, next){
  // Здесь можно обойтесь без try-catch блока
    const form = req.body;
    const data = {
      examinee_login: form.examinee_login,
      test_id: parseInt(form.test_id),
      result_points: parseFloat(form.result_points)
    };
    // Так как это promise, у него в цепи есть then,
    // Которые срабатывает когда все хорошо и
    // catch, соответственно, когда все плохо
    await mydb.editResult(data, req.params.result_id)
        .then(() => { res.redirect('/admin'); })
        .catch((err) => { console.log(err)})


});

router.get('/result/delete/:result_id', adminAuth, async function(req, res, next){
  const result = (await mydb.getResultByResultId(req.params.result_id))[0];
  // можно упростить, как указал ниже, а так же пробел перед фигурной скобкой
  if (!result) res.redirect('/admin');
  else res.render('admin/deleteResult', {result: result});
});

router.post('/result/delete/:result_id', adminAuth, async function(req, res, next){
  await mydb.deleteResult(req.params.result_id);
  res.redirect('/admin');
});

router.get('/search', adminAuth, function(req, res, next){
  res.render('admin/search');
});

router.get('/search/tests', adminAuth, function(req, res, next){
  res.render('admin/searchTest', {});
});

router.post('/search/tests', adminAuth, async function(req, res, next){
  const form = req.body;
  let tests = [],
   context = {};
  if (form.login && !form.test_id) 
    tests = await mydb.getTestsByUserLogin(form.login);
  else if (form.test_id) 
    tests = await mydb.getTestById(form.test_id);
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
  // form получен как параметр и значит меняеться не может - const,
  const form = req.body;
  // нет потребности в var, вполне хватит let
  let users = [],
      context = {},
      query = {};
  // Если if можно описать в одну строку, тогда фигруныве скобки не нужны
  if (form.login) query.login = form.login
  if (form.name) query.name = form.name
  if (form.surname) query.surname = form.surname

  if (!query.login && !query.name && !query.surname)  users = [];
  else users = await mydb.getUsersByQuery(query) || [];
  // Не совсем понял зачем тут объект, но если понадобился - то можно упростить
  res.status(200).send({users: users})
});

router.get('/search/results/', adminAuth, async function(req, res, next){
  res.render('admin/searchResults', {});
})

// Ставим пробел перед фигурной скобкой, а так же можно упростить до стрелочной функции
router.post('/search/results/', adminAuth, async (req, res, next) => {
  // Тут все тоже, что и выше
  const form = req.body;
  let results = [],
    context = {};
    query = {};
  if (form.login)
    query.examinee_login = form.login
  if (form.test_id)
    query.test_id = form.test_id;
  if (!query.test_id && !query.examinee_login)
    results = [];
  else
    results = await mydb.getResultsByQuery(query) || [];
  context = {
    results: results
  }
  res.status(200).send(context);
});

module.exports = router;