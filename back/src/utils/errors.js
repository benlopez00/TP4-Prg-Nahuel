// Clase base
class AppError extends Error {
	constructor(message, statusCode) {
		super(message);
		this.statusCode = statusCode;
		this.isOperational = true;
		Error.captureStackTrace(this, this.constructor);
	}
}

// Error 400 - Bad Request (Ej: Faltan campos, año inválido)
class ValidationError extends AppError {
	constructor(message = "Error de validación en los datos ingresados") {
		super(message, 400);
	}
}

// Error 401 - Unauthorized (Ej: Token inválido o no enviado)
class UnauthorizedError extends AppError {
	constructor(message = "Acceso denegado. No autorizado.") {
		super(message, 401);
	}
}

// Error 403 - Forbidden (Ej: El usuario es USER y la ruta pide ADMIN)
class ForbiddenError extends AppError {
	constructor(message = "No tienes permisos para realizar esta acción.") {
		super(message, 403);
	}
}

// Error 404 - Not Found (Ej: Película o Género no existe)
class NotFoundError extends AppError {
	constructor(message = "Recurso no encontrado.") {
		super(message, 404);
	}
}

module.exports = {
	AppError,
	ValidationError,
	UnauthorizedError,
	ForbiddenError,
	NotFoundError,
};
