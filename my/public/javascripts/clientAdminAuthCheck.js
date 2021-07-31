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

  var adminMainPageButton = document.createElement("a");
  adminMainPageButton.href='/admin/';
  adminMainPageButton.innerText='Администраторская';
  body.appendChild(adminMainPageButton);

  // ссылки на тест и выход  
  var userCreateButton = document.createElement("a");
  userCreateButton.href='/admin/user/create';
  userCreateButton.innerText='Cоздать пользователя';
  body.appendChild(userCreateButton);

  var testCreateButton = document.createElement("a");
  testCreateButton.href='/admin/test/create';
  testCreateButton.innerText='Cоздать тест';
  body.appendChild(testCreateButton);

  var resultCreateButton = document.createElement("a");
  resultCreateButton.href='/admin/result/create';
  resultCreateButton.innerText='Cоздать результат';
  body.appendChild(resultCreateButton);

  var searchButton = document.createElement("a");
  searchButton.href='/admin/search/';
  searchButton.innerText='Поиск';
  body.appendChild(searchButton);

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


