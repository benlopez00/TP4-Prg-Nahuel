const { body, param } = require("express-validator");

const addToWatchlistRules = [
    body("movieId")
        .notEmpty()
        .withMessage("El ID de la película es obligatorio")
        .isInt()
        .withMessage("El ID de la película debe ser un número entero"),
];

module.exports = {
    addToWatchlistRules,
};
