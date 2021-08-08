const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const checkPermissions = require('../middleware/permissionCheck');
const mydb = require('../dbHelpers');

router.get('/', auth, (req, res, next) => {
    res.render('test/testIndex');
});

router.get('/make', auth, (req, res, next) => {
    res.render('test/testMake', {});
});

router.post('/make', auth, async function(req, res, next) {
    const newTest = {
        creator_login: req.cookies['LOGIN'],
        content: JSON.stringify(req.body)
    }
    await mydb.createTest(newTest);
    res.redirect('../');   
});

router.get('/search', auth, async function(req, res, next){
    res.render('test/searchTest', {});
});

router.post('/search', auth, async function(req, res, next){
    const form = req.body;
    let tests = [],
        context = {};
    if (form.test_id){
        tests = await mydb.getTestById(form.test_id);
    }
    if (!tests){
        context = {
            tests: []
        }
    }
    else {
        context = {
            tests: tests
        } 
    }

    res.status(200).send(context);
});

router.get('/find/:login', auth, async function(req, res, next) {
    if (req.params.login === req.cookies['LOGIN'] || req.signedCookies['ROLE' === 'Administrator']){
        let testList = await mydb.getTestsByUserLogin(req.cookies['LOGIN']);
        res.render('test/userTests', {testList: testList, login: req.cookies['LOGIN']});
    }
    else res.redirect('/');
});

router.get('/results', auth, async function(req, res, next){
    const results = await mydb.getResultsByLogin(req.cookies['LOGIN']);
    res.render('test/userTestsResults', {results: results});
});

router.get('/:test_id', auth, async function(req, res, next){
    const testInfo = (await mydb.getTestById(req.params.test_id))[0];

    if (!testInfo)
        res.redirect('/');
    else{
        const questionsList = testInfo.content;
        const context = {
            login: req.cookies['LOGIN'], 
            testInfo: testInfo, 
            questionsList: questionsList}
        res.render('test/testView', context);
    }
    
});

router.get('/delete/:test_id', auth, async function(req, res, next){
    var test = (await mydb.getTestById(req.params.test_id))[0];
    if (!test || test.creator_login !== req.cookies['LOGIN']) 
        res.redirect('/');
    else 
        res.render('test/deleteTest', {test: test});
});

router.post('/delete/:test_id', auth, async function(req, res, next){
    await mydb.deleteTest(req.params.test_id);
    res.redirect('/find/'+req.cookies['LOGIN']);
});

router.get('/pass/:test_id', auth, async function(req, res, next){
    var test = (await mydb.getTestById(req.params.test_id))[0];
    if (!test) 
        res.redirect('/');
    else 
        res.render('test/passTest', {test: test});
});

function parseForm(form, test){
    let pointsCounter = 0;
    for (let question of test.content){
        if (question.question_type === 'text'){
            if (form['text_answer_' + question.question_id]===question.question_text_answer){
                // Если добавится функция баллов за вопрос, то зддсс нужно поменять
                pointsCounter += 1;
            }
        }
        else if (question.question_type === 'test'){
            let isCorrectArray = [];
            for (let test_answer of question.question_test_answers){
                if (form[`checkbox_${question.question_id}_${test_answer.test_answer_id}`] 
                    && test_answer.test_answer_is_correct){
                    isCorrectArray.push(true);
                }
                else if (
                (form[`checkbox_${question.question_id}_${test_answer.test_answer_id}`] 
                && !test_answer.test_answer_is_correct)
                || 
                (!form[`checkbox_${question.question_id}_${test_answer.test_answer_id}`] 
                && test_answer.test_answer_is_correct)){
                    isCorrectArray.push(false);
                }
            }
            if (!isCorrectArray.includes(false)){
                // Если добавится функция баллов за вопрос, то зддсс нужно поменять
                pointsCounter += 1;
            }
        }
        
    }
    return pointsCounter;
}

router.post('/pass/:test_id', auth, async function(req, res, next){
    const form = req.body;
    const test = (await mydb.getTestById(req.params.test_id))[0];

    const result_points = parseForm(form, test);
    const result = {
        examinee_login: req.cookies['LOGIN'],
        test_id: req.params.test_id, 
        result_points: result_points
    }
    await mydb.createResult(result);
    res.redirect('/');
});




module.exports = router;