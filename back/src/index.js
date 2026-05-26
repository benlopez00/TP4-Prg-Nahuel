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

// Crear generos
app.post("/api/generos", async (req, res) => {
	const { nombre } = req.body;
	const genero = await prisma.genero.create({ data: { nombre } });
	res.json(genero);
});

app.listen(PORT, () => {
	console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
