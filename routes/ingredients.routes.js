const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', async (req, res) => {
    const ingredients = await db.query('SELECT * FROM ingredient;');
    res.json(ingredients.rows);
});

router.post('/', async (req, res) => {
    const { ingredientnames } = req.body;

    if (!Array.isArray(ingredientnames)) {
        return res.status(400).json({ message: "ingredientnames should be an array" });
    }

    const results = [];

    for (const ingredientname of ingredientnames) {
        try {
            const data = await db.query("SELECT * FROM ingredient WHERE ingredientname = $1;", [ingredientname]);

            if (data.rows.length !== 0) {
                results.push({ ingredientname, status: "exists", message: "Ingredient already exists" });
            } else {
                const result = await db.query("INSERT INTO ingredient (ingredientname) VALUES ($1);", [ingredientname]);

                if (result.rowCount === 1) {
                    results.push({ ingredientname, status: "added", message: "Ingredient added successfully" });
                } else {
                    results.push({ ingredientname, status: "error", message: "Failed to add ingredient" });
                }
            }

        } catch (error) {
            results.push({ ingredientname, status: "error", message: error.message });
        }
    }
    return res.status(200).json({ results });
});

router.delete('/', async (req, res) => {
    const { ingredientnames } = req.body;

    if (!Array.isArray(ingredientnames)) {
        return res.status(400).json({ message: "ingredientnames should be an array" });
    }

    const results = [];

    for (const ingredientname of ingredientnames) {
        try {
            const data = await db.query("SELECT * FROM ingredient WHERE ingredientname = $1;", [ingredientname]);

            if (data.rows.length === 0) {
                results.push({ ingredientname, status: "doesn't exist", message: "There is no such ingredient" });
            } else {
                const result = await db.query("DELETE FROM ingredient WHERE ingredientname = $1;", [ingredientname]);

                if (result.rowCount === 1) {
                    results.push({ ingredientname, status: "deleted", message: "Ingredient deleted successfully" });
                } else {
                    results.push({ ingredientname, status: "error", message: "Ingredient deletion unsuccessful" });
                }
            }

        } catch (error) {
            results.push({ ingredientname, status: "error", message: error.message });
        }
    }
    return res.status(200).json({ results });
});

module.exports = router;