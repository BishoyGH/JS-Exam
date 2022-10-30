/*********************************************
 * Loading Animation
 *********************************************/
function hideLoadingSpinner() {
  $(document).ready(() => {
    $('.loader i').fadeOut(800, function () {
      $('.loader').fadeOut(800, function () {
        $('.loader').remove();
        $(document.body).removeClass('overflow-hidden');
      });
    });
  });
}

function showLoadingSpinner() {
  $(document.body).append(
    `     
  <div class="loader bg-black d-flex align-items-center justify-content-center position-fixed top-0 start-0 end-0 bottom-0 vh-100">
      <i class="fa fa-spinner fa-spin fa-5x color-white"></i>
  </div>`
  );
  $(this).addClass('overflow-hidden');
}
/*********************************************
 * Meal & Recipe Templates
 ********************************************/
function mealsTemplate(meals) {
  $(window).scrollTop(0);
  for (const meal of meals) {
    // Meal Template
    $('#app').append(
      `<div data-itemid="${meal.idMeal}" class="item-container col-md-6 col-lg-3 d-flex align-items-center">
        <div class="position-relative overflow-hidden">
          <div class="item-image-container">
            <img src="${meal.strMealThumb}" alt="Corba" class="img-fluid rounded-4">
          </div>
        <div class="item-name-container position-absolute bg-light px-3 bg-opacity-75 rounded-4 flex-column justify-content-center">
          <h2 class="display-6 fw-bolder text-dark">${meal.strMeal}</h2>
      </div>`
    );
  }
  // Recepie Template
  $('.item-container').click(async function () {
    $(window).scrollTop(0);
    closeNavSearch();
    showLoadingSpinner();
    const mealID = $(this).attr('data-itemid');
    const req = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`
    );
    const res = req.ok ? await req.json() : '';
    const meal = await res.meals[0];
    $('#app').html(`
    <div class="col-md-4 text-white">
					<img class="w-100" src="${meal.strMealThumb}" alt="${meal.strMeal}">
					<h1 class="mt-3">${meal.strMeal}</h1>
          <button class="btn btn-warning w-100" id="goBack">Back To Previous Meals</button>
				</div>
				<div class="col-md-8 text-white">
					<h2 class="display-5">Instructions</h2>
					<p class="lead">${meal.strInstructions}</p>
					<p>
            <strong class="fw-bolder">Area:</strong>
            <a href="" class="area-link">${meal.strArea}</a>
          </p>
					<p>
            <strong class="fw-bolder">Category:</strong>
            <a href="" class="category-link">${meal.strCategory}</a>
          </p>
					<h3 class="mt-2">Ingredients:</h3>
					<ul class="list-unstyled" id="ingredients">
					</ul>
          ${
            meal.strTags !== null
              ? '<h3 class="mt-2">Tags:</h3><ul class="list-unstyled" id="tags"></ul>'
              : ''
          }
          <div class="row g-3">
            <div class="col-6">
              <a class="d-block btn btn-info text-dark" target="_blank" href="${
                meal.strSource
              }">Source</a>
            </div>
            <div class="col-6">
              <a class="d-block btn btn-danger text-light" target="_blank" href="${
                meal.strYoutube
              }">Youtube</a>
            </div>
          </div>
				</div>`);
    const strMeasures = Array.from(Object.entries(meal)).filter(
      (i) => i[0].includes('strMeasure') && i[1] !== ' ' && i[1] !== ''
    );
    const strIngredients = Array.from(Object.entries(meal)).filter(
      (i) => i[0].includes('strIngredient') && i[1] !== ''
    );
    for (let i = 0; i < strIngredients.length; i++) {
      const ingredient = document.createElement('li');
      $(ingredient).html(
        `${strMeasures[i][1]} of <a class="ingredient-link" href="#">${strIngredients[i][1]}</a>`
      );
      $(ingredient).addClass(
        'fs-5 text-capitalize badge rounded-pill text-bg-primary px-3 mx-1 my-2'
      );
      $('#ingredients').append(ingredient);
    }
    if (meal.strTags !== null) {
      for (const tagText of meal.strTags.split(/[, ]+/g)) {
        const tag = document.createElement('li');
        $(tag).text(tagText);
        $(tag).addClass(
          'fs-5 text-capitalize badge rounded-pill text-bg-secondary px-3 mx-1 my-2'
        );
        $('#tags').append(tag);
      }
    }
    $('#goBack').click(function () {
      $('#app').html('');
      showLoadingSpinner();
      mealsTemplate(meals);
      hideLoadingSpinner();
    });
    $('.category-link').click(function (e) {
      e.preventDefault();
      showLoadingSpinner();
      categoryFilter($(this).text());
      hideLoadingSpinner();
    });
    $('.area-link').click(function (e) {
      e.preventDefault();
      showLoadingSpinner();
      areaFilter($(this).text());
      hideLoadingSpinner();
    });
    $('.ingredient-link').click(function (e) {
      e.preventDefault();
      showLoadingSpinner();
      ingredientFilter($(this).text());
      hideLoadingSpinner();
    });
    hideLoadingSpinner();
  });
  hideLoadingSpinner();
}
/*********************************************
 * Categories Template
 *********************************************/
async function categoryFilter(category) {
  $(window).scrollTop(0);
  const req = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
  );
  const res = req.ok ? await req.json() : '';
  let meals = await res.meals;
  $('#app').html('');
  mealsTemplate(meals);
}

function categoryTemplate() {
  $('#app').html('');
  showLoadingSpinner();
  (async function () {
    const req = await fetch(
      'https://www.themealdb.com/api/json/v1/1/categories.php'
    );
    const res = req.ok ? await req.json() : 'Error';
    const categories = res.categories;
    for (category of categories) {
      $('#app').append(
        `<div data-category-name="${
          category.strCategory
        }" class="item-container col-md-6 col-lg-3 d-flex align-items-center">
        <div class="position-relative overflow-hidden">
          <div class="item-image-container">
            <img src="${
              category.strCategoryThumb
            }" alt="Corba" class="img-fluid rounded-4">
          </div>
        <div class="item-name-container position-absolute bg-light px-3 bg-opacity-75 rounded-4 flex-column justify-content-center">
          <h2 class="fs-2 fw-bolder text-dark">${category.strCategory}</h2>
          <p class="text-dark">${category.strCategoryDescription
            .split(' ')
            .slice(0, 10)
            .join(' ')}...</p>
      </div>`
      );
    }
    $('.item-container').click(function () {
      const category = $(this).attr('data-category-name');
      categoryFilter(category);
    });
  })();
  hideLoadingSpinner();
}

/*********************************************
 * Area Template
 *********************************************/

async function areaFilter(area) {
  $(window).scrollTop(0);
  const req = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
  );
  const res = req.ok ? await req.json() : '';
  let meals = await res.meals;
  $('#app').html('');
  mealsTemplate(meals);
}

function areaTemplate() {
  showLoadingSpinner();
  $('#app').html('');
  (async function () {
    const req = await fetch(
      'https://www.themealdb.com/api/json/v1/1/list.php?a=list'
    );
    const res = req.ok ? await req.json() : 'Error';
    const areas = res.meals;
    for (area of areas) {
      $('#app').append(
        `<div data-area-name="${area.strArea}" class="item-container col-md-6 col-lg-3 d-flex flex-column justify-content-center text-center">
        <i class="fa-solid fa-city fa-5x text-info"></i>
        <h2>${area.strArea}</h2>
        </div>`
      );
    }
    $('.item-container').click(function () {
      const area = $(this).attr('data-area-name');
      areaFilter(area);
    });
  })();
  hideLoadingSpinner();
}

/*********************************************
 * Ingredient Template
 *********************************************/
async function ingredientFilter(ingredient) {
  $(window).scrollTop(0);
  const req = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`
  );
  const res = req.ok ? await req.json() : '';
  let meals = await res.meals;
  $('#app').html('');
  mealsTemplate(meals);
}

function ingredientTemplate() {
  $('#app').html('');
  showLoadingSpinner();
  (async function () {
    const req = await fetch(
      'https://www.themealdb.com/api/json/v1/1/list.php?i=list'
    );
    const res = req.ok ? await req.json() : 'Error';
    const ingredients = res.meals;
    for (ingredient of ingredients.slice(0, 20)) {
      $('#app').append(
        `<div data-ingredient-name="${
          ingredient.strIngredient
        }" class="item-container col-md-6 col-lg-3 d-flex flex-column justify-content-center text-center">
        <i class="fa-solid fa-bowl-food fa-4x text-success"></i>
        <h2>${ingredient.strIngredient}</h2>
        <p>${ingredient.strDescription.split(' ').slice(0, 15).join(' ')}...</p>
        </div>`
      );
    }
    $('.item-container').click(function () {
      const ingredient = $(this).attr('data-ingredient-name');
      ingredientFilter(ingredient);
    });
  })();
  hideLoadingSpinner();
}

/*********************************************
 * Contact Form Template
 *********************************************/

function contactUsTemplate() {
  $('#app').html('');
  showLoadingSpinner();
  $('#app').html(`
    <section id="contact-us" class="container mx-auto mb-5">
      <div class="p-2">
        <h2 class="text-light p-3 mb-5">Contact Us</h2>
        <div class="row">
          <div class="col-md-6">
            <div class="form-group p-3">
              <input class="form-control p-3 text-bg-dark" id="name"
                placeholder="Enter Your Name" autocomplete="off">
              <div class="alert mt-2 alert-danger text-capitalize d-none" role="alert">
                Minmum Chars is 3 & Special Characters and Numbers not allowed
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group p-3">
              <input class="form-control p-3 text-bg-dark" id="email" placeholder="Enter Email" autocomplete="off">
              <div class="alert mt-2 alert-danger text-capitalize d-none" role="alert">
                Enter valid email. *Ex: xxx@yyy.z
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group p-3">
              <input class="form-control p-3 text-bg-dark" id="phone" placeholder="Enter phone" autocomplete="off">
              <div class="alert mt-1 alert-danger text-capitalize d-none" role="alert">
                Enter valid Phone Number: *Ex: 01000000000
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group p-3">
              <input class="form-control p-3 text-bg-dark" id="age" placeholder="Enter Age" autocomplete="off">
              <div class="alert mt-1 alert-danger text-capitalize d-none" role="alert">
                Enter valid Age Between 18 &amp; 99
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group p-3">
              <input class="form-control p-3 text-bg-dark" type="password" id="password"
                placeholder="Enter Password" autocomplete="off">
              <div class="alert mt-1 alert-danger text-capitalize d-none" role="alert">
                Enter valid password :Minimum 8 chars, at least one capital letter and one small letter and one number
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group p-3">
              <input class="form-control p-3 text-bg-dark" type="password" id="repassword" 
                placeholder="Enter RePassword" autocomplete="off">
              <div class="alert mt-1 alert-danger text-capitalize d-none" role="alert">
                this field should match the other password field
              </div>
            </div>
          </div>
        </div>
        <div class="p-3">
          <button type="submit" disabled id="submit" class="btn btn-outline-warning w-100 mt-3">Submit</button>
          <div class="alert mt-1 text-capitalize text-center d-none" role="alert">
          </div>
        </div>
      </div>
    </section>`);
  $('#name').on('keyup', function () {
    validate(this, isUserNameValid($(this).val()));
    toggleSubmitBtn();
  });
  $('#email').on('input', function () {
    validate(this, isUserEmailValid($(this).val().toLowerCase()));
    toggleSubmitBtn();
  });
  $('#phone').on('input', function () {
    validate(this, isUserPhoneValid($(this).val()));
    toggleSubmitBtn();
  });
  $('#age').on('input', function () {
    validate(this, isUserAgeValid($(this).val()));
    toggleSubmitBtn();
  });
  $('#password').on('input', function () {
    validate(this, isUserPasswordValid($(this).val()));
    toggleSubmitBtn();
  });
  $('#repassword').on('input', function () {
    validate(this, $(this).val() === $('#password').val());
    toggleSubmitBtn();
  });
  $('#submit').click(function (e) {
    e.preventDefault();
    if (
      $(this).attr('disabled') !== 'disabled' ||
      $(this).attr('disabled') !== 'true'
    ) {
      $(this).next().text('Your Message Is Delivered.');
      $(this).next().addClass('alert-success');
    } else {
      $(this).next().text('Please Fill Data First Then Try Again');
      $(this).next().addClass('alert-danger');
    }
    $(this).next().removeClass('d-none');
    toggleSubmitBtn();
  });
  hideLoadingSpinner();
}

/*********************************************
 * Validation
 *********************************************/

function validate(element, condition) {
  $('#submit').next().removeClass('alert-danger', 'alert-success');
  $('#submit').next().addClass('d-none');
  if (condition) {
    $(element).addClass('is-valid');
    $(element).removeClass('is-invalid');
    $(element).next().addClass('d-none');
  } else {
    $(element).removeClass('is-valid');
    $(element).addClass('is-invalid');
    $(element).next().removeClass('d-none');
  }
}
function toggleSubmitBtn() {
  if (
    isUserNameValid($('#name').val()) &&
    isUserEmailValid($('#email').val()) &&
    isUserPhoneValid($('#phone').val()) &&
    isUserAgeValid($('#age').val()) &&
    isUserPasswordValid($('#password').val()) &&
    $('#repassword').val() === $('#password').val()
  ) {
    document.querySelector('#submit').removeAttribute('disabled');
  } else {
    document.querySelector('#submit').setAttribute('disabled', true);
  }
}

function isUserNameValid(value) {
  // Only Latin Chars and Spaces Allowed - Minimum 3 Digits
  return /^[a-zA-Z ]{3,}$/.test(value);
}

function isUserEmailValid(value) {
  // Email Validation as per RFC2822 standards.
  return /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(
    value
  );
}
function isUserPhoneValid(value) {
  // Egyptian Valid Phone Number Formats
  return /^01[0125][0-9]{8}$/.test(value);
}

function isUserAgeValid(value) {
  // From 18 to 99
  return /^(1[89]|[2-9]\d)$/.test(value);
}
function isUserPasswordValid(value) {
  /**
   * - at least 8 characters
   * - must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number
   * - Can contain special characters
   */
  return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(value);
}

/*********************************************
 * Initial Connect
 *********************************************/

(async () => {
  const req = await fetch(
    'https://www.themealdb.com/api/json/v1/1/search.php?s='
  );
  res = req.ok ? await req.json() : '';
  meals = await res.meals;
  mealsTemplate(meals);
})();

/*********************************************
 * Toggle Side Panal
 *********************************************/
function toggleSidePanel() {
  if (sidePanel.getAttribute('data-status') === 'closed') {
    sidePanel.setAttribute('data-status', 'opened');
    $('.nav').animate({ left: '0' }, 500);
    $('.nav ul li').animate({ 'padding-bottom': '0', opacity: '1' }, 1200);
  } else {
    sidePanel.setAttribute('data-status', 'closed');
    $('.nav ul li').animate({ 'padding-bottom': '400', opacity: '0' }, 1200);
    $('.nav').animate({ left: '-250' }, 500);
  }
}

const sidePanel = document.querySelector('.sidePanel');

document.querySelector('#app').addEventListener('click', function () {
  sidePanel.setAttribute('data-status', 'closed');
  $('.nav').animate({ left: '-250' }, 500);
});

document
  .querySelector('.menu-button')
  .addEventListener('click', toggleSidePanel);

/*********************************************
 * Toggle Side Panel & Search Panel
 *********************************************/
function closeNavSearch() {
  $('#search').slideUp();
  sidePanel.setAttribute('data-status', 'closed');
  $('.nav ul li').animate({ 'padding-bottom': '400', opacity: '0' }, 1200);
  $('.nav').animate({ left: '-250' }, 500);
}
/*********************************************
 * Using Nav
 *********************************************/
// Search
$('#nav-search').click(function (e) {
  e.preventDefault();
  $('#app').html('');
  $('#search').slideDown();
  toggleSidePanel();

  $('#search-by-word').on('keyup', async function () {
    $('#app').html('');
    if ($(this).val() === '') return;
    if ($('#search-by-letter').val()) $('#search-by-letter').val('');
    const req = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${$(this).val()}`
    );
    const res = req.ok ? await req.json() : 'Error';

    mealsTemplate(res.meals);
  });

  $('#search-by-letter').on('keyup', async function () {
    $('#app').html('');
    if ($(this).val() === '') return;
    if ($('#search-by-word').val()) $('#search-by-word').val('');
    const req = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?f=${$(this).val()}`
    );
    const res = req.ok ? await req.json() : 'Error';

    mealsTemplate(res.meals);
  });
});

// Category
$('#nav-categories').click(function (e) {
  e.preventDefault();
  closeNavSearch();
  categoryTemplate();
});
// Area
$('#nav-area').click(function (e) {
  e.preventDefault();
  closeNavSearch();
  areaTemplate();
});
// Ingredients
$('#nav-ingredients').click(function (e) {
  e.preventDefault();
  closeNavSearch();
  ingredientTemplate();
});
// Contact Form
$('#nav-contact').click(function (e) {
  e.preventDefault();
  closeNavSearch();
  contactUsTemplate();
});
