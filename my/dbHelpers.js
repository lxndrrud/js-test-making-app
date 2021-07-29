const knex = require('knex');
const config = require('./knexfile');
const db = knex(config.development);

async function registerUser(newUser){
    return await db.insert(newUser).into('users');
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
    deleteTest
};