const nav = $(".nav")
// Не пвторяем jquery елементы, загоняем их в переменную и потом используем
// Здесь можно использовать объявление глобально, так как ты используешь это и вне функций


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


nav.append(`
    <a href="/" class="btn my-link-confirm col">
        Главная
    </a>
`);


if (getCookie('TOKEN')){
    // ссылки на создание теста, просмотр своих тестов и выход
    nav.append(`
        <a href="/test/" class="btn my-link-confirm col">
            Тесты
        </a>
        <a href="/test/find/${getCookie('LOGIN')}" class="btn my-link-confirm col">
            Мои тесты
        </a>
        <a href="/test/results" class="btn my-link-confirm col">
            Мои результаты
        </a>
        <a href="/users/logout" class="btn my-link-confirm col">
            Выйти
        </a>
        
    `); // Очень хорошо, что ты знаешь про интерполяцию строки!

} else {
    // ссылки регистрации и входа

    nav.append(`
        <a href="/users/register" class="btn my-link-confirm col">
            Зарегистрироваться
        </a>
        <a href="/users/login" class="btn my-link-confirm col">
            Войти
        </a>
    `);
}


