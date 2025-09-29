const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', async (req, res) => {
    const recipes = await db.query('SELECT * FROM recipe;');
    res.json(recipes.rows);
});

router.post('/', async (req, res) => {
    const { recipenames } = req.body;

    if (!Array.isArray(recipenames)) {
        return res.status(400).json({ message: "recipenames should be an array" });
    }

    const results = [];

    for (const recipename of recipenames) {
        try {
            const data = await db.query("SELECT * FROM recipe WHERE recipename = $1;", [recipename]);

            if (data.rows.length !== 0) {
                results.push({ recipename, status: "exists", message: "Recipe already exists" });
            } else {
                const result = await db.query("INSERT INTO recipe (recipename) VALUES ($1);", [recipename]);

                if (result.rowCount === 1) {
                    results.push({ recipename, status: "added", message: "Recipe added successfully" });
                } else {
                    results.push({ recipename, status: "error", message: "Failed to add recipe" });
                }
            }

        } catch (error) {
            results.push({ recipename, status: "error", message: error.message });
        }
    }
    return res.status(200).json({ results });
});

router.put('/', async (req, res) => {
    const { recipenames, instructions } = req.body;

    if (!Array.isArray(recipenames)) {
        return res.status(400).json({ message: "recipenames should be an array" });
    }

    if (!Array.isArray(instructions)) {
        return res.status(400).json({ message: "instructions should be an array" });
    }

    if (recipenames.length !== instructions.length) {
        return res.status(400).json({ message: "recipenames and instructions arrays should be the same length" });
    }

    const results = [];

    for (let i = 0; i < recipenames.length; i++) {
        const recipename = recipenames[i];
        const instruction = instructions[i];


        try {
            const data = await db.query("SELECT * FROM recipe WHERE recipename = $1;", [recipename]);

            if (data.rows.length === 0) {
                results.push({ recipename, status: "doesn't exist", message: "There is no such recipe" });
            } else {
                const result = await db.query("UPDATE recipe SET instructions = $1 WHERE recipename = $2;", [instruction, recipename]);

                if (result.rowCount === 1) {
                    results.push({ recipename, status: "updated", message: "Recipe updated sucessfully" });
                } else {
                    results.push({ recipename, status: "error", message: "Recipe update unsucessful" });
                }
            }

        } catch (error) {
            results.push({ recipename, status: "error", message: error.message });
        }
    }
    return res.status(200).json({ results });



});

router.delete('/', async (req, res) => {
    const { recipenames } = req.body;

    if (!Array.isArray(recipenames)) {
        return res.status(400).json({ message: "recipenames should be an array" });
    }

    const results = [];

    for (const recipename of recipenames) {
        try {
            const data = await db.query("SELECT * FROM recipe WHERE recipename = $1;", [recipename]);

            if (data.rows.length === 0) {
                results.push({ recipename, status: "doesn't exist", message: "There is no such recipe" });
            } else {
                const result = await db.query("DELETE FROM recipe WHERE recipename = $1;", [recipename]);

                if (result.rowCount === 1) {
                    results.push({ recipename, status: "deleted", message: "Recipe deleted successfully" });
                } else {
                    results.push({ recipename, status: "error", message: "Recipe deletion unsuccessful" });
                }
            }

        } catch (error) {
            results.push({ recipename, status: "error", message: error.message });
        }
    }
    return res.status(200).json({ results });
});

router.post('/addingredient', async (req, res) => {
    const { recipenames, ingredientnames } = req.body;

    if (!Array.isArray(recipenames) || recipenames.length === 0) {
        return res.status(400).json({ message: "recipenames should be a non-empty array" });
    }

    if (!Array.isArray(ingredientnames) || ingredientnames.length === 0) {
        return res.status(400).json({ message: "ingredientnames should be a non-empty array" });
    }

    const results = [];

    for (const recipename of recipenames) {
        for (const ingredientname of ingredientnames) {
            try {
                const exists = await db.query('SELECT 1 FROM recipe a INNER JOIN IngredientInRecipe c ON a.id = c.recipeId INNER JOIN ingredient b ON b.id = c.ingredientId WHERE a.recipeName = $1 AND b.ingredientName = $2;', [recipename, ingredientname]);

                if (exists.rows.length > 0) {
                    results.push({ recipename, ingredientname, status: "skipped", message: "Ingredient already exists in recipe" });
                    continue;
                }

                const insert = await db.query("INSERT INTO ingredientinrecipe (recipeid, ingredientid) SELECT a.id, b.id FROM recipe a JOIN ingredient b ON a.recipename = $1 AND b.ingredientname = $2;", [recipename, ingredientname]);

                if (insert.rowCount === 1) {
                    results.push({ recipename, ingredientname, status: "updated", message: "Ingredient has been added to the recipe" });
                } else {
                    results.push({ recipename, ingredientname, status: "error", message: "Recipe or ingredient not found" });
                }

            } catch (error) {
                results.push({ recipename, ingredientname, status: "error", message: error.message });
            }
        }

    }
    return res.status(200).json({ results });
});


module.exports = router;