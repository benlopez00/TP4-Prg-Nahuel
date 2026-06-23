const { body, param } = require("express-validator");

const peliculaRules = [
	body("titulo").notEmpty().withMessage("El título es obligatorio"),
	body("año")
		.isInt({ min: 1895 })
		.withMessage("El año debe ser un número mayor a 1895"),
	body("generoId")
		.isInt()
		.withMessage("El ID del género debe ser un número entero"),
];

module.exports = { peliculaRules };
