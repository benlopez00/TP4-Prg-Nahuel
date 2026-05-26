const express = require("express");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();

// Obtener todas las películas
router.get("/", async (req, res) => {
	const peliculas = await prisma.pelicula.findMany({
		include: { genero: true },
	});
	res.json(peliculas);
});

// Crear película
router.post("/", async (req, res) => {
	const { titulo, año, generoId } = req.body;
	try {
		const nuevaPelicula = await prisma.pelicula.create({
			data: { titulo, año: parseInt(año), generoId: parseInt(generoId) },
		});
		res.json(nuevaPelicula);
	} catch (error) {
		res.status(400).json({ error: "Error al crear la película" });
	}
});

// Eliminar película
router.delete("/:id", async (req, res) => {
	const { id } = req.params;
	await prisma.pelicula.delete({ where: { id: parseInt(id) } });
	res.json({ message: "Película eliminada" });
});

module.exports = router;
