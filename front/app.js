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
		li.innerHTML = `
            <strong>${pelicula.titulo}</strong> (${pelicula.año}) - Género: ${pelicula.genero?.nombre || "N/A"}
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


// Codigo de validaciones 


//Validación manual extra para el POST/PUT (evita trampas con la barra espaciadora)
function sonDatosValidos(titulo, anio) {
	if (titulo.trim() === "") {
		alert("Error: El título no puede estar vacío ni tener solo espacios.")
		return false;
	}
	if (isNaN(anio) || anio < 1895 || anio > 2026) {
		alert("Error: El año debe ser un número entre 1895 y 2026.")
		return false;
	}
	return true;
}

//Validacion deL GET por id (buscador) verifica que exista o tira 404

async function buscarValidarPelicula(id) {
	const res = await fetch('http://localhost:3000/api/peliculas/${id}')

	if (res.status === 404) {
		alert('Error 404: La película con ID ${id} no existe en la base de datos.')
		return null
	}
	return await res.json()
}

// Validacion de existencia antes de editar PUT

async function validarPeliculaParaEditar(id) {
	const res = await fetch('http://localhost:3000/api/peliculas/${id}')

	if (res.status === 404) {
		alert('Error 404: No se puede editar la película con ID ${id} porque no existe.')
		return false
	}
	return true
}

