const API_URL = "http://localhost:3000/api/peliculas";
const AUTH_URL = "http://localhost:3000/api/auth";
const WATCHLIST_URL = "http://localhost:3000/api/watchlist";

const form = document.getElementById("form-pelicula");
const lista = document.getElementById("lista-peliculas");
const listaWatchlist = document.getElementById("lista-watchlist");
let usuarioActual = null; // Guardará los datos del usuario logueado

// --- INICIALIZACIÓN ---
document.addEventListener("DOMContentLoaded", () => {
	verificarSesion();
	obtenerPeliculas();
});

// --- AUTENTICACIÓN Y SESIÓN ---
async function verificarSesion() {
	const token = localStorage.getItem("token");
	if (!token) return;

	try {
		const res = await fetch(`${AUTH_URL}/me`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		if (res.ok) {
			usuarioActual = await res.json();
			document.getElementById("auth-message").innerText =
				`Logueado como ${usuarioActual.email} (${usuarioActual.role})`;
			document.getElementById("btn-logout").style.display =
				"inline-block";
			document.getElementById("watchlist-section").style.display =
				"block";

			// Ocultar formulario de creación si no es ADMIN
			if (usuarioActual.role !== "ADMIN") {
				form.style.display = "none";
			} else {
				form.style.display = "block";
			}

			obtenerWatchlist();
		} else {
			logout(); // Si el token expiró, cerramos sesión
		}
	} catch (error) {
		console.error("Error al verificar sesión", error);
	}
}

async function register() {
	const email = document.getElementById("email").value;
	const password = document.getElementById("password").value;
	const role = document.getElementById("role-select").value;

	const res = await fetch(`${AUTH_URL}/register`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ email, password, role }),
	});
	const data = await res.json();
	document.getElementById("auth-message").innerText =
		data.message || data.error;
}

async function login() {
	const email = document.getElementById("email").value;
	const password = document.getElementById("password").value;

	const res = await fetch(`${AUTH_URL}/login`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ email, password }),
	});
	const data = await res.json();

	if (res.ok) {
		localStorage.setItem("token", data.token);
		verificarSesion(); // Carga el perfil y ajusta la UI
		obtenerPeliculas();
	} else {
		document.getElementById("auth-message").innerText = data.error;
	}
}

function logout() {
	localStorage.removeItem("token");
	usuarioActual = null;
	document.getElementById("auth-message").innerText = "Sesión cerrada";
	document.getElementById("btn-logout").style.display = "none";
	document.getElementById("watchlist-section").style.display = "none";
	form.style.display = "block"; // Mostrar formulario por defecto
	listaWatchlist.innerHTML = "";
	obtenerPeliculas(); // Refrescar lista sin botones especiales
}

// --- GESTIÓN DE PELÍCULAS (CRUD) ---
async function obtenerPeliculas() {
	const res = await fetch(API_URL);
	const peliculas = await res.json();
	renderizarPeliculas(peliculas);
}

function renderizarPeliculas(peliculas) {
	lista.innerHTML = "";
	// Si viene un solo objeto (por la búsqueda), lo convertimos en array
	const data = Array.isArray(peliculas) ? peliculas : [peliculas];

	data.forEach((pelicula) => {
		const nombreGenero = pelicula.genero?.nombre || "Indefinido";
		const li = document.createElement("li");
		li.innerHTML = `<strong>${pelicula.titulo}</strong> (${pelicula.año}) - Género: ${nombreGenero} (ID: ${pelicula.id})`;

		// Botones según el rol
		if (usuarioActual) {
			// Todos los logueados pueden agregar a favoritos
			li.innerHTML += ` <button onclick="agregarAWatchlist(${pelicula.id})">⭐ Favorito</button>`;

			// Solo ADMIN puede editar y eliminar
			if (usuarioActual.role === "ADMIN") {
				li.innerHTML += `
                    <button onclick="cargarEdicion(${pelicula.id}, '${pelicula.titulo}', ${pelicula.año}, ${pelicula.generoId})">Editar</button>
                    <button onclick="eliminarPelicula(${pelicula.id})">Eliminar</button>
                `;
			}
		}
		lista.appendChild(li);
	});
}

// Lógica combinada para CREAR o EDITAR
form.addEventListener("submit", async (e) => {
	e.preventDefault();
	const id = document.getElementById("pelicula-id").value;
	const titulo = document.getElementById("titulo").value;
	const año = document.getElementById("año").value;
	const generoId = document.getElementById("generoId").value;
	const token = localStorage.getItem("token");

	const method = id ? "PUT" : "POST"; // Si hay ID, actualiza. Si no, crea.
	const url = id ? `${API_URL}/${id}` : API_URL;

	const res = await fetch(url, {
		method: method,
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({ titulo, año, generoId }),
	});

	const data = await res.json();
	if (!res.ok) {
		alert("Error: " + (data.error || "No autorizado"));
	} else {
		form.reset();
		document.getElementById("pelicula-id").value = "";
		document.getElementById("btn-submit").innerText = "Agregar Película";
		obtenerPeliculas();
	}
});

function cargarEdicion(id, titulo, año, generoId) {
	document.getElementById("pelicula-id").value = id;
	document.getElementById("titulo").value = titulo;
	document.getElementById("año").value = año;
	document.getElementById("generoId").value = generoId;
	document.getElementById("btn-submit").innerText = "Guardar Cambios";
	window.scrollTo(0, 0);
}

async function eliminarPelicula(id) {
	if (!confirm("¿Seguro que deseas eliminar esta película?")) return;
	const token = localStorage.getItem("token");
	const res = await fetch(`${API_URL}/${id}`, {
		method: "DELETE",
		headers: { Authorization: `Bearer ${token}` },
	});

	if (res.ok) {
		obtenerPeliculas();
		if (usuarioActual) obtenerWatchlist(); // Refrescar watchlist por si estaba ahí
	} else {
		const data = await res.json();
		alert(data.error);
	}
}

// --- BÚSQUEDA ---
document.getElementById("btn-buscar").addEventListener("click", async () => {
	const id = document.getElementById("buscar-id").value;
	if (!id) return;
	const res = await fetch(`${API_URL}/${id}`);
	if (res.ok) {
		const pelicula = await res.json();
		renderizarPeliculas(pelicula);
	} else {
		alert("Película no encontrada");
	}
});

document
	.getElementById("btn-todas")
	.addEventListener("click", obtenerPeliculas);

// --- WATCHLIST (FAVORITOS) ---
async function obtenerWatchlist() {
	const token = localStorage.getItem("token");
	if (!token) return;

	const res = await fetch(WATCHLIST_URL, {
		headers: { Authorization: `Bearer ${token}` },
	});

	if (res.ok) {
		const watchlist = await res.json();
		listaWatchlist.innerHTML = "";

		if (watchlist.items.length === 0) {
			listaWatchlist.innerHTML = "<li>Tu lista está vacía</li>";
			return;
		}

		watchlist.items.forEach((item) => {
			const peli = item.pelicula;
			const li = document.createElement("li");
			li.innerHTML = `
                <strong>${peli.titulo}</strong> (${peli.año})
                <button onclick="eliminarDeWatchlist(${peli.id})">❌ Quitar</button>
            `;
			listaWatchlist.appendChild(li);
		});
	}
}

async function agregarAWatchlist(movieId) {
	const token = localStorage.getItem("token");
	const res = await fetch(WATCHLIST_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({ movieId }),
	});

	const data = await res.json();
	if (res.ok) {
		obtenerWatchlist();
	} else {
		alert(data.error);
	}
}

async function eliminarDeWatchlist(movieId) {
	const token = localStorage.getItem("token");
	const res = await fetch(`${WATCHLIST_URL}/${movieId}`, {
		method: "DELETE",
		headers: { Authorization: `Bearer ${token}` },
	});

	if (res.ok) {
		obtenerWatchlist();
	} else {
		const data = await res.json();
		alert(data.error);
	}
}
