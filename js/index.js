

document.addEventListener('DOMContentLoaded', () => {

    const containerElement = document.querySelector('.recipe');

    getRandomRecipe();

    async function getRandomRecipe() {
        const response = await fetch('https://serverweek11.onrender.com/random');
        const recipe = await response.json();

        const recipeName = recipe.recipe.recipename;
        const recipeIngredients = recipe.ingredients;
        const imageUrl = recipe.recipe.imageurl;
        const recipeInstructions = recipe.recipe.instructions;

        // Title
        const recipeNameTitle = document.createElement('h2');
        recipeNameTitle.innerHTML = recipeName;
        containerElement.appendChild(recipeNameTitle);

        // Image
        const recipeImage = document.createElement('img');
        recipeImage.src = imageUrl;
        containerElement.appendChild(recipeImage);

        console.log(recipe);
        console.log(imageUrl);

        // Ingredients
        const ingredientsTitle = document.createElement('h3');
        ingredientsTitle.textContent = 'Ingredients:';
        containerElement.appendChild(ingredientsTitle);

        const ingredientsTable = document.createElement('ingredientsTable');
        ingredientsTable.classList.add('ingredientsTablee'); //FOR CSS
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr')
        const thIndex = document.createElement('th');
        thIndex.textContent = 'Ingredient number:';
        const thIngredient = document.createElement('th');
        thIngredient.textContent = 'Ingredient name:';
        headerRow.appendChild(thIndex);
        headerRow.appendChild(thIngredient);
        thead.appendChild(headerRow);

        ingredientsTable.appendChild(thead);

        const tbody = document.createElement('tbody');
        recipeIngredients.forEach((ingredient, index) => {
            const row = document.createElement('th');

            const cellIndex = document.createElement('td');
            cellIndex.textContent = index + 1;

            const cellIngredient = document.createElement('td');
            cellIngredient.textContent = ingredient;

            row.appendChild(cellIndex);
            row.appendChild(cellIngredient);
            tbody.appendChild(row);

        });

        ingredientsTable.appendChild(tbody);
        containerElement.appendChild(ingredientsTable);



        // Instructions

        if(recipeInstructions === null) {
            const noInst = document.createElement('noInst');
            noInst.classList.add('noInst');
            const noInstructions = document.createElement('p');
            noInstructions.textContent = "No instructions for this recipe, I'm terribly sorry";
            noInst.appendChild(noInstructions);
            containerElement.appendChild(noInst);
        } else {
        const instructionsTitle = document.createElement('h3');
        instructionsTitle.textContent = 'Instructions:';
        containerElement.appendChild(instructionsTitle);

        const instructionsList = document.createElement('p');
        instructionsList.innerHTML = recipeInstructions
        containerElement.appendChild(instructionsList);
        }
      
    }
});