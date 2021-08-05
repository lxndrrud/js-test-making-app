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

$(".nav").append(`
    <a href="/" class="btn my-link col">
        Главная
    </a>
`);


if (getCookie('TOKEN')){

  $(".nav").append(`
        <a href="/admin/" class="btn my-link col">
          Администраторская
        </a>
        <a href="/admin/user/create" class="btn my-link col">
            Создать пользователя
        </a>
        <a href="/admin/test/create" class="btn my-link col">
            Создать тест
        </a>
        <a href="/admin/search" class="btn my-link col">
            Поиск
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


