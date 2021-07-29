const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const mydb = require('../dbHelpers');


router.get('/make', auth, (req, res, next) => {
    res.render('test/test.pug', {});
});

router.post('/make', auth, async function(req, res, next) {
    const newTest = {
        creator_login: req.cookies['LOGIN'],
        content: JSON.stringify(req.body)
    }
    console.log(req.body);
    await mydb.createTest(newTest);
    res.redirect('../');   
});

router.get('/find/:login', auth, async function(req, res, next) {
    console.log(req.params.login);
    console.log(req.cookies['LOGIN']);
    if (req.params.login === req.cookies['LOGIN']){
        testList = await mydb.getTestsByUserLogin(req.cookies['LOGIN']);
        console.log(testList);
        res.render('test/userTests', {testList: testList, login: req.cookies['LOGIN']});
    }
    else{
        res.redirect('../');
    }
});

router.get('/:test_id', auth, async function(req, res, next){
    const testInfo = (await mydb.getTestById(req.params.test_id))[0];

    if (!testInfo){
        res.redirect('../');
    }
    else{
        const questionsList = testInfo.content;
        console.log(testInfo);
        console.log(questionsList);
        const context = {
            login: req.cookies['LOGIN'], 
            testInfo: testInfo, 
            questionsList: questionsList}
        res.render('test/testView', context);
    }
    
});

module.exports = router;