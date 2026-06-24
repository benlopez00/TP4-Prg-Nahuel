const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { NotFoundError, ValidationError } = require("../utils/errors");
const { verifyToken, authorizeRoles } = require("../middlewares/auth");
const { peliculaRules } = require("../validators/peliculaValidator");
const validateFields = require("../middlewares/validateFields");

const router = express.Router();
const prisma = new PrismaClient();

// GET todas las películas
router.get("/", async (req, res, next) => {
	try {
		const peliculas = await prisma.pelicula.findMany({
			include: { genero: true },
		});
		res.json(peliculas);
	} catch (error) {
		next(error);
	}
});

// GET por id
router.get("/:id", async (req, res, next) => {
	try {
		const pelicula = await prisma.pelicula.findUnique({
			where: { id: parseInt(req.params.id) },
			include: { genero: true },
		});
		if (!pelicula) throw new NotFoundError("Película no encontrada");
		res.json(pelicula);
	} catch (error) {
		next(error);
	}
});

// POST pelicula (Solo ADMIN)
router.post(
	"/",
	verifyToken,
	authorizeRoles("ADMIN"),
	peliculaRules, // 1. Aplica las reglas
	validateFields, // 2. Intercepta errores si falla
	async (req, res, next) => {
		// 3. El controlador ya no necesita validar manualmente
		try {
			const { titulo, año, generoId } = req.body;
			const nuevaPelicula = await prisma.pelicula.create({
				data: {
					titulo,
					año: parseInt(año),
					generoId: parseInt(generoId),
				},
			});
			res.status(201).json(nuevaPelicula);
		} catch (error) {
			next(error);
		}
	},
);

// Editar película
router.put(
	"/:id",
	verifyToken,
	authorizeRoles("ADMIN"),
	async (req, res, next) => {
		try {
			const id = parseInt(req.params.id);
			const { titulo, año, generoId } = req.body;

			if (año && parseInt(año) < 1895)
				throw new ValidationError("El año no puede ser menor a 1895");

			const existe = await prisma.pelicula.findUnique({ where: { id } });
			if (!existe)
				throw new NotFoundError(`La película con ID ${id} no existe.`);

			const actualizada = await prisma.pelicula.update({
				where: { id },
				data: {
					titulo,
					año: parseInt(año),
					generoId: parseInt(generoId),
				},
			});
			res.json(actualizada);
		} catch (error) {
			next(error);
		}
	},
);

// Eliminar película
router.delete(
	"/:id",
	verifyToken,
	authorizeRoles("ADMIN"),
	async (req, res, next) => {
		try {
			const id = parseInt(req.params.id);
			const existe = await prisma.pelicula.findUnique({ where: { id } });
			if (!existe)
				throw new NotFoundError(
					"No se puede eliminar: ID inexistente.",
				);

			await prisma.pelicula.delete({ where: { id } });
			res.json({ message: "Película eliminada" });
		} catch (error) {
			next(error);
		}
	},
);

module.exports = router;
