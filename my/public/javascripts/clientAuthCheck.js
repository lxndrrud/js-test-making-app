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


$(".nav").append(`
    <a href="/" class="btn my-link col">
        Главная
    </a>
`);


if (getCookie('TOKEN')){
    // ссылки на создание теста, просмотр своих тестов и выход
    $(".nav").append(`
        <a href="/test/make" class="btn my-link col">
            Создать тест
        </a>
        <a href="/test/find/${getCookie('LOGIN')}" class="btn my-link col">
            Мои тесты
        </a>
        <a href="/test/results" class="btn my-link col">
            Мои результаты
        </a>
        <a href="/users/logout" class="btn my-link-danger col">
            Выйти
        </a>
        
    `);  

} else {
    // ссылки регистрации и входа

    $(".nav").append(`
        <a href="/users/register" class="btn my-link-danger col">
            Зарегистрироваться
        </a>
        <a href="/users/login" class="btn my-link-danger col">
            Войти
        </a>
    `);
}


