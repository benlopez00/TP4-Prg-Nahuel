const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const { verifyToken } = require("../middlewares/auth");
// 1. Importar las reglas y el interceptor
const { registerRules, loginRules } = require("../validators/userValidator");
const validateFields = require("../middlewares/validateFields");

const router = express.Router();
const prisma = new PrismaClient();

// Registro de usuario (Refactorizado)
router.post(
	"/register",
	registerRules,
	validateFields,
	async (req, res, next) => {
		const { email, password, role } = req.body;

		try {
			// Hasheo con bcrypt (10 salt rounds)
			const saltRounds = 10;
			const hashedPassword = await bcrypt.hash(password, saltRounds);

			const nuevoUsuario = await prisma.usuario.create({
				data: {
					email,
					password: hashedPassword,
					role: role || "USER",
				},
			});

			res.status(201).json({
				message: "Usuario registrado exitosamente",
				usuarioId: nuevoUsuario.id,
			});
		} catch (error) {
			// Enviamos el error al manejador centralizado (ej: si el email ya existe)
			next(error);
		}
	},
);

// Login de usuario (Refactorizado)
router.post("/login", loginRules, validateFields, async (req, res, next) => {
	const { email, password } = req.body;

	try {
		const usuario = await prisma.usuario.findUnique({ where: { email } });
		if (!usuario) {
			// Usamos el flujo de manejo centralizado de errores con un return para cortar ejecución
			return res.status(404).json({ error: "Usuario no encontrado" });
		}

		const validPassword = await bcrypt.compare(password, usuario.password);
		if (!validPassword) {
			return res.status(401).json({ error: "Contraseña incorrecta" });
		}

		const token = jwt.sign(
			{ id: usuario.id, role: usuario.role },
			process.env.JWT_SECRET,
			{ expiresIn: "2h" },
		);

		res.json({ message: "Login exitoso", token, role: usuario.role });
	} catch (error) {
		next(error);
	}
});

// Endpoint para obtener el perfil del usuario autenticado (Protegido)
router.get("/me", verifyToken, async (req, res, next) => {
	try {
		// El ID viene del token decodificado en req.user por el middleware verifyToken
		const usuario = await prisma.usuario.findUnique({
			where: { id: req.user.id },
			select: {
				id: true,
				email: true,
				role: true, // No seleccionamos el password por seguridad
			},
		});

		if (!usuario) {
			return res.status(404).json({ error: "Usuario no encontrado" });
		}

		res.json(usuario);
	} catch (error) {
		next(error);
	}
});

module.exports = router;
