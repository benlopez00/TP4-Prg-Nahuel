const express = require("express");
const cors = require("cors");
const peliculasRoutes = require("./routes/peliculas");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use("/api/peliculas", peliculasRoutes);

//si no hay generos, crear algunos por defecto hardcodeados
async function sembrarGeneros() {
	try {
		const cantidadGeneros = await prisma.genero.count();

		if (cantidadGeneros === 0) {
			console.log(
				"--- La tabla de géneros está vacía. Creando géneros por defecto... ---",
			);
			await prisma.genero.createMany({
				data: [
					{ id: 1, nombre: "Acción" },
					{ id: 2, nombre: "Ciencia Ficción" },
					{ id: 3, nombre: "Drama" },
					{ id: 4, nombre: "Comedia" },
					{ id: 5, nombre: "Terror" },
				],
			});
			console.log("--- Géneros por defecto creados con éxito ---");
		}
	} catch (error) {
		console.error("Error al verificar o crear géneros por defecto:", error);
	}
}
sembrarGeneros();

// Crear generos
app.post("/api/generos", async (req, res) => {
	const { nombre } = req.body;
	const genero = await prisma.genero.create({ data: { nombre } });
	res.json(genero);
});

app.listen(PORT, () => {
	console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
