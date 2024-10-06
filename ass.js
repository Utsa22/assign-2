let addedMeals = [];
let mealCount = 0;
const loadMeals = () => {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=`)
        .then(res => res.json())
        .then(data => {
            if (data.meals) {
                displayMeals(data.meals);
            } 
            else {
                alert('No meals found');
            }
        })
        .catch(err => {
            console.log('Error fetching default meals:', err);
        });
};

const displayMeals = (meals) => {
    const mealContainer = document.getElementById('meal-container');
    mealContainer.innerHTML = '';
    meals.forEach(meal => {
        const div = document.createElement('div');
        div.classList.add('col-md-4');
        div.innerHTML = `
            <div class="card">
                <img src="${meal.strMealThumb || 'https://via.placeholder.com/100'}" class="card-img-top" alt="Meal Image">
                <div class="card-body">
                    <h5 class="card-title">${meal.strMeal || 'No Name'}</h5>
                    <p class="card-text"><strong>Country:</strong> ${meal.strArea || 'Not Available'}</p>
                    <p class="card-text"><strong>Catagory:</strong> ${meal.strCategory || 'Not Available'}</p>
                    <p class="card-text">Instructions: ${meal.strInstructions ? meal.strInstructions.slice(0, 50) : 'No Instructions'}...</p>
                    <button class="btn btn-primary" onclick="showMealDetails(${meal.idMeal})" data-bs-toggle="modal" data-bs-target="#mealModal">Details</button>
                    <button class="btn btn-warning mt-2" onclick="addToGroup('${meal.strMeal}')">Add to Group</button>
                </div>
            </div>
        `;
        mealContainer.appendChild(div);
    });
};

const showMealDetails = (mealId) => {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
        .then(res => res.json())
        .then(data => {
            const meal = data.meals[0];
            document.getElementById('modal-body').innerHTML = `
                <img src="${meal.strMealThumb}" class="img-fluid" alt="Meal Image">
                <h5>${meal.strMeal}</h5>
                <p><strong>Category:</strong> ${meal.strCategory}</p>
                <p><strong>Country:</strong> ${meal.strArea}</p>
                <p><strong>Instructions:</strong> ${meal.strInstructions.slice(0, 50)}...</p>
                <p><strong>Ingredients:</strong></p>
                <ul>
                    ${getIngredients(meal).map(ingredient => `<li>${ingredient}</li>`).join('')}
                </ul>
            `;
        })
        .catch(err => {
            console.log('Error fetching meal details:', err);
        });
};

const getIngredients = (meal) => {
    let ingredients = [];
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient && ingredient.trim()) {
            ingredients.push(`${ingredient} - ${measure || ''}`.trim());
        }
    }
    return ingredients;
};

const addToGroup = (mealName) => {
    if (mealCount >= 11) {
        alert('You can only add up to 11 meals!');
        return;
    }
    if (!addedMeals.includes(mealName)) {
        addedMeals.push(mealName);
        mealCount++;
        updateGroupSection();
    }
};

const updateGroupSection = () => {
    const groupList = document.getElementById('group-list');
    const mealCountElement = document.getElementById('meal-count');
    groupList.innerHTML = '';
    addedMeals.forEach(meal => {
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.textContent = meal;
        groupList.appendChild(li);
    });
    mealCountElement.textContent = mealCount;
};

document.getElementById('search-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const searchValue = document.getElementById('search-input').value;
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchValue}`)
        .then(res => res.json())
        .then(data => {
            if (data.meals) {
                displayMeals(data.meals);
            } 
            else {
                alert('No meals found for this search term.');
            }
        })
        .catch(err => {
            console.log('Error searching for meals:', err);
        });
});

loadMeals();
