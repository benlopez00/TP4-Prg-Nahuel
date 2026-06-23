const jwt = require("jsonwebtoken");

// Validar el token JWT
const verifyToken = (req, res, next) => {
	const authHeader = req.headers["authorization"];
	// El formato es "Bearer <token>"
	const token = authHeader && authHeader.split(" ")[1];

	if (!token) {
		return res
			.status(401)
			.json({ error: "Acceso denegado. Token no proporcionado." });
	}

	try {
		const verified = jwt.verify(token, process.env.JWT_SECRET);
		req.user = verified; // Guardamos los datos del usuario (id, role) en la request
		next();
	} catch (error) {
		res.status(403).json({ error: "Token inválido o expirado." });
	}
};

// Control de acceso basado en roles (RBAC)
const authorizeRoles = (...allowedRoles) => {
	return (req, res, next) => {
		if (!req.user || !allowedRoles.includes(req.user.role)) {
			return res.status(403).json({
				error: "No tienes permisos para realizar esta acción.",
			});
		}
		next();
	};
};

module.exports = { verifyToken, authorizeRoles };
