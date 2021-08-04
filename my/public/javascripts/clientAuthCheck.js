function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

var body = document.getElementsByTagName("body")[0];

var indexButton = document.createElement("a");
indexButton.href='/';
indexButton.innerText='Главная';
indexButton.classList.add("btn");
indexButton.classList.add("btn-outline-primary");
body.appendChild(indexButton);


if (getCookie('TOKEN')){
    // ссылки на создание теста, просмотр своих тестов и выход  
    var testButton = document.createElement("a");
    testButton.href='/test/make';
    testButton.innerText='Cоздать тест';
    testButton.classList.add("btn");
    testButton.classList.add("btn-outline-success");
    body.appendChild(testButton);

    var userTestsButton = document.createElement("a");
    userTestsButton.href='/test/find/' + getCookie('LOGIN');
    userTestsButton.innerText='Мои тесты';
    userTestsButton.classList.add("btn");
    userTestsButton.classList.add("btn-outline-success");
    body.appendChild(userTestsButton);

    var userTestsResultsButton = document.createElement("a");
    userTestsResultsButton.href='/test/results';
    userTestsResultsButton.innerText='Мои результаты';
    userTestsResultsButton.classList.add("btn");
    userTestsResultsButton.classList.add("btn-outline-success");
    body.appendChild(userTestsResultsButton);

    var logoutButton = document.createElement("a");
    logoutButton.href='/users/logout/';
    logoutButton.classList.add("btn");
    logoutButton.classList.add("btn-outline-danger");
    logoutButton.innerText='Выйти';
    body.appendChild(logoutButton);

} else {
    // ссылки регистрации и входа
    var registerButton = document.createElement("a");
    registerButton.href='/users/register/';
    registerButton.innerText='Зарегистрироваться';
    registerButton.classList.add("btn");
    registerButton.classList.add("btn-outline-primary");
    body.appendChild(registerButton);

    var loginButton = document.createElement("a");
    loginButton.href='/users/login/';
    loginButton.innerText='Войти';
    loginButton.classList.add("btn");
    loginButton.classList.add("btn-outline-primary");
    body.appendChild(loginButton);
}


