const knex = require('knex');
const config = require('./knexfile');
const db = knex(config.development);

// Здесь нет необходимости использовать асинхрон
// Так же не хранить все модели в одном файле, для этого есть папка models
// Где разбиваем на файлы по логике

function registerUser(newUser){
    return db.insert(newUser).into('users');
    /*
    .then(()=>{console.log(returnValue); return returnValue })
    .catch((err) => {console.log(err); throw err});
    */
}

async function checkUser(userLogin){
    return await db.select().from('users').where({
        login: userLogin
    });
    /*
    .then(()=>{console.log(returnValue); return returnValue })
    .catch((err) => {console.log(err); throw err});
    */
}

async function editUser(userInfo, old_login){
    return await db('users')
    .where({
        login: old_login
    })
    .update(userInfo);
}

async function deleteUser(login){
    return await db('users')
    .where({
        login: login
    })
    .del();
}

async function getUsers(){
    return await db.select().from('users');
}

async function getUsersByQuery(query){
    return await db.select().from('users').where(query);
}

async function getUserInfoByLogin(login){
    return await db.select().from('users').where({
        login: login
    });
}

async function getTestsByUserLogin(creator_login){
    return await db.select().from('tests').where({
        creator_login: creator_login
    });
}

async function getTestById(test_id){
    return await db.select().from('tests').where({
        id: test_id
    });
}

async function createTest(test){
    return await db.insert(test).into('tests');
}

async function editTest(testInfo, test_id){
    return await db('tests')
    .where({
        id: test_id
    })
    .update(testInfo);
}

async function deleteTest(test_id){
    return await db('tests')
    .where({
        id: test_id
    })
    .del();
}

async function getRolePermissions(role_title){
    return await db('roles')
    .select('permissions')
    .where({
        title: role_title
    });
}

async function createResult(result){
    return await db.insert(result).into('results');
}

async function getResultsByLogin(login){
    return await db('results').select()
    .where({
        examinee_login: login
    });
}

async function getResultsByTestId(test_id){
    return await db('results').select()
    .where({
        test_id: test_id
    });
}

async function getResultByResultId(result_id){
    return await db('results').select()
    .where({
        id: result_id
    });
}

async function getResultsByQuery(query){
    return await db('results').select().where(query);
}

async function editResult(resultInfo, result_id){
    return await db('results')
    .where({
        id: result_id
    })
    .update(resultInfo);
}

async function deleteResult(result_id){
    return await db('results')
    .where({
        id: result_id
    })
    .del();
}

module.exports = {
    registerUser, 
    checkUser,
    editUser,
    deleteUser,
    getUsers,
    getUsersByQuery,
    getUserInfoByLogin,
    getTestsByUserLogin,
    getTestById,
    createTest,
    editTest,
    deleteTest,
    getRolePermissions,
    createResult,
    getResultsByLogin,
    getResultsByTestId,
    getResultsByQuery,
    getResultByResultId,
    editResult,
    deleteResult
};