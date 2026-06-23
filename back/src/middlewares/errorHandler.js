const { AppError } = require("../utils/errors");

const errorHandler = (err, req, res, next) => {
	// 1. Si el error es uno de los nuestros (AppError o sus hijos)
	if (err instanceof AppError) {
		return res.status(err.statusCode).json({
			error: err.message,
		});
	}

	// 2. Manejo de errores específicos de Prisma (Opcional pero recomendado)
	// P2002 es el código de Prisma para "Unique constraint failed" (Ej: Email duplicado)
	if (err.code === "P2002") {
		return res.status(400).json({
			error: "El registro ya existe en la base de datos.",
		});
	}

	// 3. Si es un error inesperado (Ej: se cayó la base de datos o un error de sintaxis)
	console.error("💥 ERROR INESPERADO:", err);
	res.status(500).json({
		error: "Error interno del servidor.",
	});
};

module.exports = errorHandler;
