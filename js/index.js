
const rowData = document.getElementById("rowData");
const searchContainer = document.getElementById("searchContainer");
// display home 


getMainMeals()



// open nav 


function openNav() {
  $("nav").animate({
    left: 0
  }, 500)
  $(".open-close-icon").removeClass("fa-align-justify");
  $(".open-close-icon").addClass("fa-x");


  $(".list ul").animate({
    top: 0
  }, 1000)


};

// close nav

function CloseNav() {
  $('nav').animate({
    left: -260
  }, 500)
  $(".open-close-icon").removeClass("fa-x");
  $(".open-close-icon").addClass("fa-align-justify");

}

// test nav is close or open

$(" nav i.open-close-icon").click(() => {
  if ($("nav").css("left") == "0px") {
    CloseNav()
  } else {
    openNav()
  }
})

//  get Main Meals in home screen
async function getMainMeals() {
  CloseNav()
  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=`)
  response = await response.json()
  displayMeals(response.meals);
}
// show meal in home screen
function displayMeals(arr) {

  let mealBox = "";

  for (let i = 0; i < arr.length; i++) {
    mealBox += `
    <div class="col-md-3 py-3" style="cursor: pointer ;">
          <div onclick="getMealDetails('${arr[i].idMeal}')" class="meal position-relative overflow-hidden rounded-3">
            <img class="img-fluid" src="${arr[i].strMealThumb}" alt="">
            <div class="meal-layer  position-absolute d-flex align-items-center text-black p-2">
              <h3 class="m-auto">${arr[i].strMeal}</h3>
            </div>
          </div>
        </div>  
      `
  }

  rowData.innerHTML = mealBox
}

// get meal Detalis
async function getMealDetails(mealID) {
  CloseNav()

  searchContainer.innerHTML = "";
  let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
  respone = await respone.json();

  displayMealDetails(respone.meals[0])
}

// show meal Ditalis
function displayMealDetails(meal) {
  $('#searchContainer').addClass('d-none')
  let ingredients = ``

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients += `<li class="alert alert-info m-2 p-1">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`
    }
  }

  let tags = meal.strTags?.split(",")
  if (!tags) tags = []

  let tagsStr = ''
  for (let i = 0; i < tags.length; i++) {
    tagsStr += `
      <li class="alert alert-danger m-2 p-1">${tags[i]}</li>`
  }



  let MealDetails = `
  <div class="col-md-4 text-white">
              <img class="w-100 rounded-3" src="${meal.strMealThumb}"
                  alt="">
                  <h2>${meal.strMeal}</h2>
          </div>
          <div class="col-md-8 text-white">
              <h2>Instructions</h2>
              <p>${meal.strInstructions}</p>
              <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
              <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
              <h3>Recipes :</h3>
              <ul class="list-unstyled d-flex g-3 flex-wrap">
                  ${ingredients}
              </ul>

              <h3>Tags :</h3>
              <ul class="list-unstyled d-flex g-3 flex-wrap">
                  ${tagsStr}
              </ul>

              <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
              <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
          </div>`

  rowData.innerHTML = MealDetails
}

// open search Page

function showSearchInputs() {
  $('#searchContainer').removeClass('d-none')
  CloseNav()
  searchContainer.innerHTML = `
  <div class="row py-4 ">
      <div class="col-md-6 ">
          <input onkeyup="searchByName(this.value)" class="form-control bg-transparent text-white" type="text" placeholder="Search By Name">
      </div>
      <div class="col-md-6">
          <input onkeyup="searchByFLetter(this.value)" maxlength="1" class="form-control bg-transparent text-white" type="text" placeholder="Search By First Letter">
      </div>
  </div>`

  rowData.innerHTML = ""
}


async function searchByName(term) {
  $('#searchContainer').removeClass('d-none')
  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
  response = await response.json()
  response.meals ? displayMeals(response.meals) : displayMeals([])

}


async function searchByFLetter(term) {
  $('#searchContainer').removeClass('d-none')
  rowData.innerHTML = ""

  term == "" ? term = "a" : "";
  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${term}`)
  response = await response.json()

  response.meals ? displayMeals(response.meals) : displayMeals([])

}



// get categories

async function getCategories() {
  CloseNav()

  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
  response = await response.json()

  displayCategories(response.categories)

}
// display categories

function displayCategories(arr) {
  $('#searchContainer').addClass('d-none')
  let categories = "";

  for (let i = 0; i < arr.length - 2; i++) {
    categories += `
      <div class="col-md-3">
              <div style="cursor: pointer;" onclick="getCategoryMeals('${arr[i].strCategory}')" class="meal position-relative overflow-hidden rounded-2">
                  <img class="w-100" src="${arr[i].strCategoryThumb}" alt="" srcset="">
                  <div class="meal-layer position-absolute text-center text-black p-2">
                      <h3>${arr[i].strCategory}</h3>
                      <p>${arr[i].strCategoryDescription.split(" ").slice(0, 20).join(" ")}</p>
                  </div>
              </div>
      </div>
      `
  }

  rowData.innerHTML = categories
}

// get meals by categories 

async function getCategoryMeals(category) {
  rowData.innerHTML = ""

  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
  response = await response.json()

  displayMeals(response.meals.slice(0, 20))

}

// get area
async function getArea() {
  CloseNav()
  let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)
  respone = await respone.json()
  displayArea(respone.meals)

}

// displayArea
function displayArea(arr) {
  $('#searchContainer').addClass('d-none')
  let areas = "";

  for (let i = 0; i < arr.length; i++) {
    areas += `
      <div class="col-md-3 text-white py-3 ">
              <div style="cursor: pointer;" onclick="getAreaMeals('${arr[i].strArea}')" class="rounded-2 text-center">
                      <i class="fa-solid fa-location-dot fa-4x"></i>
                      <h3>${arr[i].strArea}</h3>
              </div>
      </div>
      `
  }

  rowData.innerHTML = areas
}

// area's meals
async function getAreaMeals(area) {
  CloseNav()
  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
  response = await response.json()


  displayMeals(response.meals.slice(0, 20))


}


// get Ingredients
async function getIngredients() {
  CloseNav()
  let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`)
  respone = await respone.json()

  displayIngredients(respone.meals.slice(0, 20))


}

// display Ingredients
function displayIngredients(arr) {
  $('#searchContainer').addClass('d-none')
  let ingredients = "";

  for (let i = 0; i < arr.length; i++) {
    ingredients += `
      <div class="col-md-3 text-white py-3">
              <div style="cursor: pointer;"  onclick="getIngredientsMeals('${arr[i].strIngredient}')" class="rounded-2 text-center">
                      <i class="fa-solid fa-utensils fa-4x"></i>
                      <h3>${arr[i].strIngredient}</h3>
                      <p>${arr[i].strDescription.split(" ").slice(0, 20).join(" ")}</p>
              </div>
      </div>
      `
  }

  rowData.innerHTML = ingredients
}

async function getIngredientsMeals(ingredients) {

  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`)
  response = await response.json()

  displayMeals(response.meals.slice(0, 20))


}

// contact us


function showContacts() {
  $('#searchContainer').addClass('d-none')
  CloseNav()
  rowData.innerHTML = `<div class="contact min-vh-100 d-flex justify-content-center align-items-center">
  <div class="container w-75 text-center">
      <div class="row g-4">
          <div class="col-md-6">
              <input id="nameInput" onkeyup="inputsValidation()" type="text" class="form-control" placeholder="Enter Your Name">
              <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                 <p>Special characters and numbers not allowed</p> 
              </div>
          </div>
          <div class="col-md-6">
              <input id="emailInput" onkeyup="inputsValidation()" type="email" class="form-control " placeholder="Enter Your Email">
              <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                  <p>Email not valid *exemple@gmail.com</p> 
              </div>
          </div>
          <div class="col-md-6">
              <input id="phoneInput" onkeyup="inputsValidation()" type="text" class="form-control " placeholder="Enter Your Phone">
              <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
              <p> Enter valid Phone Number</p>
              </div>
          </div>
          <div class="col-md-6">
              <input id="ageInput" onkeyup="inputsValidation()" type="number" class="form-control " placeholder="Enter Your Age">
              <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                 <p> Enter valid age </p> 
              </div>
          </div>
          <div class="col-md-6">
              <input  id="passwordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Enter Your Password">
              <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                 <p>Enter valid password *Minimum eight characters, at least one letter and one number:*</p> 
              </div>
          </div>
          <div class="col-md-6">
              <input  id="repasswordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Repassword">
              <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                 <p>Repassword is not matched </p> 
              </div>
          </div>
      </div>
      <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
  </div>
</div> `
  submitBtn = document.getElementById("submitBtn")


  document.getElementById("nameInput").addEventListener("focus", () => {
    nameInputTouched = true
  })

  document.getElementById("emailInput").addEventListener("focus", () => {
    emailInputTouched = true
  })

  document.getElementById("phoneInput").addEventListener("focus", () => {
    phoneInputTouched = true
  })

  document.getElementById("ageInput").addEventListener("focus", () => {
    ageInputTouched = true
  })

  document.getElementById("passwordInput").addEventListener("focus", () => {
    passwordInputTouched = true
  })

  document.getElementById("repasswordInput").addEventListener("focus", () => {
    repasswordInputTouched = true
  })
}

let nameInputTouched = false;
let emailInputTouched = false;
let phoneInputTouched = false;
let ageInputTouched = false;
let passwordInputTouched = false;
let repasswordInputTouched = false;




function inputsValidation() {
  if (nameInputTouched) {
    if (nameValidation()) {
      document.getElementById("nameAlert").classList.replace("d-block", "d-none")

    } else {
      document.getElementById("nameAlert").classList.replace("d-none", "d-block")

    }
  }
  if (emailInputTouched) {

    if (emailValidation()) {
      document.getElementById("emailAlert").classList.replace("d-block", "d-none")
    } else {
      document.getElementById("emailAlert").classList.replace("d-none", "d-block")

    }
  }

  if (phoneInputTouched) {
    if (phoneValidation()) {
      document.getElementById("phoneAlert").classList.replace("d-block", "d-none")
    } else {
      document.getElementById("phoneAlert").classList.replace("d-none", "d-block")

    }
  }

  if (ageInputTouched) {
    if (ageValidation()) {
      document.getElementById("ageAlert").classList.replace("d-block", "d-none")
    } else {
      document.getElementById("ageAlert").classList.replace("d-none", "d-block")

    }
  }

  if (passwordInputTouched) {
    if (passwordValidation()) {
      document.getElementById("passwordAlert").classList.replace("d-block", "d-none")
    } else {
      document.getElementById("passwordAlert").classList.replace("d-none", "d-block")

    }
  }
  if (repasswordInputTouched) {
    if (repasswordValidation()) {
      document.getElementById("repasswordAlert").classList.replace("d-block", "d-none")
    } else {
      document.getElementById("repasswordAlert").classList.replace("d-none", "d-block")

    }
  }


  if (nameValidation() &&
    emailValidation() &&
    phoneValidation() &&
    ageValidation() &&
    passwordValidation() &&
    repasswordValidation()) {
    submitBtn.removeAttribute("disabled")
  } else {
    submitBtn.setAttribute("disabled", true)
  }
}

function nameValidation() {
  return (/^[a-zA-Z ]+$/.test(document.getElementById("nameInput").value))
}

function emailValidation() {
  return (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(document.getElementById("emailInput").value))
}

function phoneValidation() {
  return (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(document.getElementById("phoneInput").value))
}

function ageValidation() {
  return (/^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(document.getElementById("ageInput").value))
}

function passwordValidation() {
  return (/^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(document.getElementById("passwordInput").value))
}

function repasswordValidation() {
  return document.getElementById("repasswordInput").value == document.getElementById("passwordInput").value
}
