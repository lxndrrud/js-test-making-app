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
body.appendChild(indexButton);


if (getCookie('TOKEN')){
    // ссылки на создание теста, просмотр своих тестов и выход  
    var testButton = document.createElement("a");
    testButton.href='/test/make';
    testButton.innerText='Cоздать тест';
    body.appendChild(testButton);

    var userTestsButton = document.createElement("a");
    userTestsButton.href='/test/find/' + getCookie('LOGIN');
    userTestsButton.innerText='Мои тесты';
    body.appendChild(userTestsButton);

    var userTestResultsButton = document.createElement("a");
    userTestResultsButton.href='/test/results';
    userTestResultsButton.innerText='Мои результаты';
    body.appendChild(userTestResultsButton);

    var logoutButton = document.createElement("a");
    logoutButton.href='/users/logout/';
    logoutButton.innerText='Выйти';
    body.appendChild(logoutButton);

} else {
    // ссылки регистрации и входа
    var registerButton = document.createElement("a");
    registerButton.href='/users/register/';
    registerButton.innerText='Зарегистрироваться';
    body.appendChild(registerButton);

    var loginButton = document.createElement("a");
    loginButton.href='/users/login/';
    loginButton.innerText='Войти';
    body.appendChild(loginButton);
}


