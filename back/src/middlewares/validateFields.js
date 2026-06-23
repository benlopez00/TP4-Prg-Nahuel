const { validationResult } = require("express-validator");
const { ValidationError } = require("../utils/errors");

const validateFields = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		// Obtenemos el primer mensaje de error y lo enviamos al manejador centralizado
		const errorMsg = errors.array()[0].msg;
		return next(new ValidationError(errorMsg));
	}
	next();
};

module.exports = validateFields;
