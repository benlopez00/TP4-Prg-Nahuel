const { body } = require("express-validator");

const registerRules = [
	body("email")
		.isEmail()
		.withMessage("Debe ingresar un correo electrónico válido")
		.notEmpty()
		.withMessage("El email es obligatorio")
		.trim(),
	body("password")
		.isLength({ min: 6 })
		.withMessage("La contraseña debe tener al menos 6 caracteres")
		.notEmpty()
		.withMessage("La contraseña es obligatoria"),
	body("role")
		.optional()
		.isIn(["USER", "ADMIN"])
		.withMessage("El rol proporcionado no es válido"),
];

const loginRules = [
	body("email")
		.isEmail()
		.withMessage("Debe ingresar un correo electrónico válido")
		.notEmpty()
		.withMessage("El email es obligatorio"),
	body("password").notEmpty().withMessage("La contraseña es obligatoria"),
];

module.exports = {
	registerRules,
	loginRules,
};
