В папке routes, должны храниться только маршруты приложения. Вся логика
должна быть описанна в папке controllers, а роуты должны лишь импортировать
себе нужные модули из контроллеров.
Пример:
    const express = require('express');
    const router = express.Router();
    const { addUser } = require("../controllers/user.controller.js")
    router.post('/addUser', addUser)
    module.exports = router;
