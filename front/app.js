const API_URL = "http://localhost:3000/api/peliculas";
const form = document.getElementById("form-pelicula");
const lista = document.getElementById("lista-peliculas");

// Cargar películas al iniciar
document.addEventListener("DOMContentLoaded", obtenerPeliculas);

async function obtenerPeliculas() {
	const res = await fetch(API_URL);
	const peliculas = await res.json();

	lista.innerHTML = "";
	peliculas.forEach((pelicula) => {
		const li = document.createElement("li");

		const nombreGenero = pelicula.genero?.nombre || "Indefinido";

		li.innerHTML = `
			<strong>${pelicula.titulo}</strong> (${pelicula.año}) - Género: <span class="badge">${nombreGenero}</span>
			<button onclick="eliminarPelicula(${pelicula.id})">Eliminar</button>
		`;
		lista.appendChild(li);
	});
}

form.addEventListener("submit", async (e) => {
	e.preventDefault();
	const titulo = document.getElementById("titulo").value;
	const año = document.getElementById("año").value;
	const generoId = document.getElementById("generoId").value;

	await fetch(API_URL, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ titulo, año, generoId }),
	});

	form.reset();
	obtenerPeliculas();
});

async function eliminarPelicula(id) {
	await fetch(`${API_URL}/${id}`, { method: "DELETE" });
	obtenerPeliculas();
}
