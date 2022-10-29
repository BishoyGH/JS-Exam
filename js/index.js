'user strict';

let templateContainer = document.getElementById('templateContainer');
let arr = [];
let nvWidth = 0;
let isTrue = true;
let x;

/**************************************************************
 * Meals & Recipes
 *************************************************************/

function displayMeals(arr) {
  let meals = '';
  for (let i = 0; i < arr.length; i++) {
    meals += `
        <div class="col-md-6 col-lg-3">
            <div class="overlay single-meal position-relative">
                <div class="post ">
                    <img src='${arr[i].strMealThumb}' class="img-fluid" />
                    <div class="layer d-flex align-items-center text-bg-light bg-opacity-75">
                        <div class="p-2">
                            <h2>${arr[i].strMeal}</h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
  }
  templateContainer.innerHTML = meals;
  $('html, body').animate(
    {
      scrollTop: 0,
    },
    200
  );
  $('.single-meal').click(function () {
    getRecipe(arr[$(this).parent().index()].idMeal);
  });
}

function displayMeal(meal) {
  // Combine Measures With Ingredients
  let ingredients = '';
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients += `
      <li class="text-capitalize fs-6 badge mx-1 my-2 rounded-pill text-bg-primary">
        ${meal[`strMeasure${i}`]} of ${meal[`strIngredient${i}`]}
      </li>`;
    }
  }
  // Split Tags In Response By Comma
  let tags = meal.strTags?.split(',');
  let tagsStr = '';
  for (let i = 0; i < tags?.length; i++) {
    tagsStr += `<li class="text-capitalize fs-6 badge mx-1 my-2 rounded-pill text-bg-info">${tags[i]}</li>`;
  }

  // Recipe Instruction Template
  const recipeTemplate = `
    <div class="col-md-4 myM text-white">
					<img class="w-100" src="${meal.strMealThumb}" alt="${meal.strMeal}">
					<h1 class="mt-3">${meal.strMeal}</h1>
				</div>
				<div class="col-md-8 text-white">
					<h2 class="display-5">Instructions</h2>
					<p class="lead">${meal.strInstructions}</p>
					<p>
            <strong class="fw-bolder">Area:</strong>
            <span class="text-warning">${meal.strArea}</span>
          </p>
					<p>
            <strong class="fw-bolder">Category:</strong>
            <span class="text-warning"> ${meal.strCategory}</span>
          </p>

					<h3 class="mt-2">Ingredients:</h3>
					<ul class="list-unstyled" id="ingredients">
					</ul>

					<h3 class="mt-2">Tags:</h3>
					<ul class="list-unstyled" id="tags">
					</ul>

          <div class="row g-3">
            <div class="col-6">
              <a class="d-block btn btn-warning text-dark" target="_blank" href="${meal.strSource}">Source</a>
            </div>
            <div class="col-6">
              <a class="d-block btn btn-danger text-light" target="_blank" href="${meal.strYoutube}">Youtube</a>
            </div>
          </div>
				</div>`;
  templateContainer.innerHTML = recipeTemplate;
  document.getElementById('ingredients').innerHTML = ingredients;
  document.getElementById('tags').innerHTML = tagsStr;
  $('html, body').animate(
    {
      scrollTop: 0,
    },
    400
  );
}

// Get Recipe
async function getRecipe(mealID) {
  $('.loading-container').fadeIn(100);
  let meal = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`
  );
  meal = await meal.json();
  displayMeal(meal.meals[0]);
  $('.loading-container').fadeOut(500);
}

/**************************************************************
 * Area
 *************************************************************/
function displayArea() {
  let e = '';
  for (var i = 0; i < arr.length; i++)
    e += `
    <div class="col-md-6 col-lg-3 my-3 text-center">
        <div class="position-relative">
            <div onclick=(filterByArea('${arr[i].strArea}')) class="post ">
                <i class="fa-solid fa-city fa-5x"></i>
                <h2 class="text-white">${arr[i].strArea}</h2>
            </div>
        </div>
    </div>`;
  templateContainer.innerHTML = e;
  $('html, body').animate(
    {
      scrollTop: 0,
    },
    200
  );
}
async function filterByArea(area) {
  $('.loading-container').fadeIn(100);
  let meals = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
  );
  meals = await meals.json();
  displayMeals(meals.meals);
  $('.loading-container').fadeOut(500);
}

/**************************************************************
 * Category Template
 *************************************************************/
function displayCategories() {
  let e = '';
  for (var i = 0; i < arr.length; i++)
    e += `
    <div class="col-md-6 col-lg-3 my-3">
        <div class="overlay shadow rounded position-relative ">
            <div onclick="filterByCategory('${
              arr[i].strCategory
            }')" class="post ">
                <img src='${arr[i].strCategoryThumb}' class="w-100 rounded" />
                <div class="layer d-flex align-items-center bg-light bg-opacity-75">
                    <div class="info p-3 ">
                        <h2>${arr[i].strCategory}</h2>
                        <p>${arr[i].strCategoryDescription
                          .split(' ')
                          .slice(0, 15)
                          .join(' ')}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
  templateContainer.innerHTML = e;
  $('html, body').animate(
    {
      scrollTop: 0,
    },
    200
  );
}

async function getCategories(listBy) {
  x = await fetch(`https://www.themealdb.com/api/json/v1/1/${listBy}`);
  x = await x.json();
  return x;
}

/**************************************************************
 * Ingredients Template
 *************************************************************/
function displayIngredients() {
  let e = '';
  for (var i = 0; i < arr.length; i++)
    e += `
    <div class="col-md-6 col-lg-3 my-3">
        <div onclick="getMainIngredient('${
          arr[i].strIngredient
        }')" class="overlay shadow rounded position-relative">
            <div class="post ">
                <i class="fa-solid fa-bowl-food fa-3x"></i>
                <h2 class="text-white">${arr[i].strIngredient}</h2>
                <p class="text-white">${arr[i].strDescription
                  .split(' ')
                  .splice(0, 20)
                  .join(' ')}</p>
            </div>
        </div>
    </div>`;
  templateContainer.innerHTML = e;
  $('html, body').animate(
    {
      scrollTop: 0,
    },
    200
  );
}

async function getMainIngredient(mealName) {
  $('.loading-container').fadeIn(100);
  let meal = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${mealName}`
  );
  meal = await meal.json();
  displayMeals(meal.meals);
  $('.loading-container').fadeOut(500);
}
/**************************************************************
 * Search
 *************************************************************/
search('').then(() => {
  $('.loading-screen').fadeOut(500, () => {
    $('body').css('overflow', 'visible');
  });
});

async function search(q) {
  $('.loading-container').fadeIn(100);
  let meals = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${q}`
  );
  meals = await meals.json();
  displayMeals(meals.meals);
  $('.loading-container').fadeOut(500);
  return meals;
}

async function getByLetter(letter) {
  if (letter) {
    $('.loading-container').fadeIn(200);
    let meals = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`
    );
    meals = await meals.json();
    if (meals.meals) {
      displayMeals(meals.meals);
    }
    $('.loading-container').fadeOut(200);
  }
}
/**************************************************************
 * Contact Us
 *************************************************************/
let userName,
  userNameAlert,
  userEmail,
  userEmailAlert,
  userPhone,
  userPhoneAlert,
  userAge,
  userAgeAlert,
  userPassword,
  userpasswordAlert,
  userRePassword,
  userRepasswordAlert;

let nameInvalid = false,
  emailInvalid = false,
  phoneInvalid = false,
  ageInvalid = false,
  passwordInvalid = false,
  repasswordInvalid = false;

$('.nav-item a').click(async (e) => {
  let listBy = e.target.getAttribute('data-list');

  document.getElementById('search-container').innerHTML = '';
  templateContainer.innerHTML = '';
  $('html, body').animate(
    {
      scrollTop: 0,
    },
    200
  );

  if (listBy == 'contact') {
    templateContainer.innerHTML = `
    <section id="contact" class="container mx-auto mb-5">
      <div class="p-2">
        <h2 class="text-light mb-5">Contact Us</h2>
        <div class="row">
          <div class="col-md-6">
            <div class="form-group p-3">
              <input class="form-control p-3 text-bg-dark" id="name"
                placeholder="Enter Your Name">
              <div class="alert mt-2 alert-danger d-none" id="namealert" role="alert">
                Minmum Chars is 3 & Special Characters and Numbers not allowed
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group p-3">
              <input class="form-control p-3 text-bg-dark" id="email" placeholder="Enter Email">
              <div class="alert mt-2 alert-danger d-none" id="emailalert" role="alert">
                Enter valid email. *Ex: xxx@yyy.zz
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group p-3">
              <input class="form-control p-3 text-bg-dark" id="phone" placeholder="Enter phone">
              <div class="alert mt-1 alert-danger  d-none" id="phonealert" role="alert">
                Enter valid Phone Number: *Ex: 01000000000
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group p-3">
              <input class="form-control p-3 text-bg-dark" id="age" placeholder="Enter Age">
              <div class="alert mt-1 alert-danger  d-none" id="agealert" role="alert">
                Enter valid Age Between 18 &amp; 99
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group p-3">
              <input class="form-control p-3 text-bg-dark" type="password" id="password"
                placeholder="Enter Password">
              <div class="alert mt-1 alert-danger  d-none" id="passwordalert" role="alert">
                Enter valid password :Minimum 8 chars, at least one letter and one number
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group p-3">
              <input class="form-control p-3 text-bg-dark" type="password" id="rePassword"
                placeholder="Enter RePassword">
              <div class="alert mt-1 alert-danger  d-none" id="repasswordalert" role="alert">
                Password Is Not The Same
              </div>
            </div>
          </div>
        </div>
        <div class="p-3">
          <button type="submit" disabled id="submit" class="btn btn-outline-warning w-100 mt-3">Submit</button>
        </div>
      </div>
    </section>`;
    userName = document.getElementById('name');
    userEmail = document.getElementById('email');
    userPhone = document.getElementById('phone');
    userAge = document.getElementById('age');
    userPassword = document.getElementById('password');
    userRePassword = document.getElementById('rePassword');
    userNameAlert = document.getElementById('namealert');
    userEmailAlert = document.getElementById('emailalert');
    userPhoneAlert = document.getElementById('phonealert');
    userAgeAlert = document.getElementById('agealert');
    userpasswordAlert = document.getElementById('passwordalert');
    userRepasswordAlert = document.getElementById('repasswordalert');

    $(userName).on('focus', () => {
      nameInvalid = true;
    });
    $(userEmail).on('focus', () => {
      emailToached = true;
    });
    $(userPhone).on('focus', () => {
      phoneToached = true;
    });
    $(userAge).on('focus', () => {
      ageToached = true;
    });
    $(userPassword).on('focus', () => {
      passwordToached = true;
    });
    $(userRePassword).on('focus', () => {
      repasswordToached = true;
    });

    $('.form-control').on('keyup', () => {
      validation();
    });
  }

  if (listBy == 'search') {
    templateContainer.innerHTML = '';
    document.getElementById('search-container').innerHTML = `
        <div class="row">
				<div class="col-md-6">
          <input id="searchInput" class="form-control text-bg-dark mb-2 " placeholder="Search By Name">
				</div>
				<div class="col-md-6">
					<input class="form-control text-bg-dark" type="text" maxlength="1" id="letter" placeholder="search By First Letter">
				</div>

			</div>`;

    $('#searchInput').keyup((e) => {
      search(e.target.value);
    });
    $('#letter').keyup((e) => {
      getByLetter(e.target.value);
    });

    $('#letter').on('input', function () {
      if (this.value.length > 1) this.value = this.value.slice(0, 1);
    });
  }

  if (listBy == 'categories') {
    $('.loading-container').fadeIn(100);

    x = await getCategories(listBy + '.php');
    arr = x.categories.splice(0, 20);
    displayCategories();
    $('.loading-container').fadeOut(500);
  } else if (listBy == 'a') {
    $('.loading-container').fadeIn(100);

    x = await getCategories('list.php?a=list');
    arr = x.meals.splice(0, 20);
    displayArea();
    $('.loading-container').fadeOut(500);
  } else if (listBy == 'i') {
    $('.loading-container').fadeIn(100);

    x = await getCategories('list.php?i=list');
    arr = x.meals.splice(0, 20);
    displayIngredients();
    $('.loading-container').fadeOut(500);
  }
});

function isUserNameValid() {
  // Only Latin Chars and Spaces Allowed - Minimum 3 Digits
  return /^[a-zA-Z ]{3,}$/.test(userName.value);
}

function isUserEmailValid() {
  // Email Validation as per RFC2822 standards.
  return /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(
    userEmail.value
  );
}
function isUserPhoneValid() {
  // Egyptian Valid Phone Number Formats
  return /^01[0125][0-9]{8}$/.test(userPhone.value);
}

function isUserAgeValid() {
  // From 18 to 99
  return /^(1[89]|[2-9]\d)$/.test(userAge.value);
}
function isUserPasswordValid() {
  /**
   * - at least 8 characters
   * - must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number
   * - Can contain special characters
   */
  return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(
    userPassword.value
  );
}

function isUserRePasswordValid() {
  return userPassword.value == userRePassword.value;
}

function validation() {
  if (nameInvalid) {
    if (isUserNameValid()) {
      userName.classList.remove('is-invalid');
      userName.classList.add('is-valid');
      userNameAlert.classList.replace('d-block', 'd-none');
      userNameAlert.classList.replace('d-block', 'd-none');
    } else {
      userName.classList.replace('is-valid', 'is-invalid');
      userNameAlert.classList.replace('d-none', 'd-block');
    }
  }

  if (emailInvalid) {
    if (isUserEmailValid()) {
      userEmail.classList.remove('is-invalid');
      userEmail.classList.add('is-valid');
      userEmailAlert.classList.replace('d-block', 'd-none');
      userEmailAlert.classList.replace('d-block', 'd-none');
    } else {
      userEmail.classList.replace('is-valid', 'is-invalid');
      userEmailAlert.classList.replace('d-none', 'd-block');
    }
  }

  if (phoneInvalid) {
    if (isUserPhoneValid()) {
      userPhone.classList.remove('is-invalid');
      userPhone.classList.add('is-valid');
      userPhoneAlert.classList.replace('d-block', 'd-none');
      userPhoneAlert.classList.replace('d-block', 'd-none');
    } else {
      userPhone.classList.replace('is-valid', 'is-invalid');
      userPhoneAlert.classList.replace('d-none', 'd-block');
    }
  }

  if (ageInvalid) {
    if (isUserAgeValid()) {
      userAge.classList.remove('is-invalid');
      userAge.classList.add('is-valid');
      userAgeAlert.classList.replace('d-block', 'd-none');
      userAgeAlert.classList.replace('d-block', 'd-none');
    } else {
      userAge.classList.replace('is-valid', 'is-invalid');
      userAgeAlert.classList.replace('d-none', 'd-block');
    }
  }

  if (passwordInvalid) {
    if (isUserPasswordValid()) {
      userPassword.classList.remove('is-invalid');
      userPassword.classList.add('is-valid');
      userpasswordAlert.classList.replace('d-block', 'd-none');
      userpasswordAlert.classList.replace('d-block', 'd-none');
    } else {
      userPassword.classList.replace('is-valid', 'is-invalid');
      userpasswordAlert.classList.replace('d-none', 'd-block');
    }
  }

  if (repasswordInvalid) {
    if (isUserRePasswordValid()) {
      userRePassword.classList.remove('is-invalid');
      userRePassword.classList.add('is-valid');
      userRepasswordAlert.classList.replace('d-block', 'd-none');
      userRepasswordAlert.classList.replace('d-block', 'd-none');
    } else {
      userRePassword.classList.replace('is-valid', 'is-invalid');
      userRepasswordAlert.classList.replace('d-none', 'd-block');
    }
  }

  if (
    isUserNameValid() &&
    isUserEmailValid() &&
    isUserPhoneValid() &&
    isUserAgeValid() &&
    isUserPasswordValid() &&
    isUserRePasswordValid()
  ) {
    document.getElementById('submit').removeAttribute('disabled');
  } else {
    document.getElementById('submit').setAttribute('disabled', 'true');
  }
}

/**************************************************************
 * Slide Menu
 *************************************************************/

$('.strip-toggel-menu').click(function () {
  isTrue
    ? ($('.nav-tab-menu').addClass('open-menu').removeClass('close-menu'),
      (nvWidth = $('.nav-tab-menu').width() - 10),
      $('.strip-header-nav').css('left', nvWidth),
      $('.fa-align-justify').toggleClass('fa-times'),
      $('.nav-tab-menu .item1').animate(
        {
          opacity: '1',
          paddingTop: '25px',
        },
        1000
      ),
      $('.nav-tab-menu .item2').animate(
        {
          opacity: '1',
          paddingTop: '25px',
        },
        1200
      ),
      $('.nav-tab-menu .item3').animate(
        {
          opacity: '1',
          paddingTop: '25px',
        },
        1400
      ),
      $('.nav-tab-menu .item4').animate(
        {
          opacity: '1',
          paddingTop: '25px',
        },
        1600
      ),
      $('.nav-tab-menu .item5').animate(
        {
          opacity: '1',
          paddingTop: '25px',
        },
        1800
      ),
      $('.nav-tab-menu .item6').animate(
        {
          opacity: '1',
          paddingTop: '25px',
        },
        2000
      ),
      (isTrue = !isTrue))
    : ($('.nav-tab-menu').addClass('close-menu').removeClass('open-menu'),
      $('.fa-align-justify').toggleClass('fa-times'),
      $('.strip-header-nav').css('left', 0),
      $('.nav-tab-menu li').animate(
        {
          opacity: '0',
          paddingTop: '500px',
        },
        500
      ),
      (isTrue = !isTrue));
});

var isSearchTrue = !0;
$('.strip-search').click(function () {
  isSearchTrue
    ? ($('.search').addClass('open-menu').removeClass('close-search'),
      $('.fa-search').toggleClass('fa-times'),
      $('.search-input').animate(
        {
          top: '49%',
        },
        1500,
        function () {
          $('.search-input').animate(
            {
              top: '50%',
            },
            250
          );
        }
      ),
      (isSearchTrue = !isSearchTrue))
    : ($('.search').addClass('close-search').removeClass('open-menu'),
      $('.fa-search').toggleClass('fa-times'),
      $('.search-input').animate({
        top: '300%',
      }),
      (isSearchTrue = !isSearchTrue));
});

/**************************************************************
 * Loading Effect
 *************************************************************/

async function filterByCategory(category) {
  $('.loading-container').fadeIn(100);
  let meals = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
  );
  meals = await meals.json();
  displayMeals(meals.meals);
  $('.loading-container').fadeOut(500);
}

$(document).scroll((e) => {
  if ($(document).scrollTop()) {
    $('.mmm').css('backgroundColor', '#0D0D0D');
  }
});
