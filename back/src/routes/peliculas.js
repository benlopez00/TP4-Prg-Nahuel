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


//Editar película
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { titulo, año, generoId } = req.body;

    try {
        // Validar que la película exista antes de editar
        const peliculaExistente = await prisma.pelicula.findUnique({
            where: { id: parseInt(id) }
        });

        if (!peliculaExistente) {
            return res.status(404).json({ error: "Película no encontrada" });
        }

        // Validar año 
        if (parseInt(año) < 1895) {
            return res.status(400).json({ error: "Año inválido" });
        }

        // Actualizar
        const peliculaActualizada = await prisma.pelicula.update({
            where: { id: parseInt(id) },
            data: { titulo, año: parseInt(año), generoId: parseInt(generoId) },
        });

        res.json(peliculaActualizada);
    } catch (error) {
        res.status(400).json({ error: "Error al actualizar la película" });
    }
});

//Barra de busqueda
router.get("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const pelicula = await prisma.pelicula.findUnique({
            where: { id: parseInt(id) },
            include: {
                genero: true
            }
        });

        if (!pelicula) {
            return res.status(404).json({ error: "Película no encontrada" });
        }

        res.json(pelicula);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener la película" });
    }
});
