const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { verifyToken } = require("../middlewares/auth");
const { addToWatchlistRules } = require("../validators/watchlistValidator");
const validateFields = require("../middlewares/validateFields");
const { NotFoundError, ValidationError } = require("../utils/errors");

const router = express.Router();
const prisma = new PrismaClient();

// 1. OBTENER LA WATCHLIST DEL USUARIO LOGUEADO
router.get("/", verifyToken, async (req, res, next) => {
    try {
        const userId = req.user.id;

        // Buscamos la watchlist del usuario (si no existe, la creamos en el momento)
        let watchlist = await prisma.watchlist.findFirst({
            where: { userId },
            include: {
                items: {
                    include: {
                        pelicula: {
                            include: { genero: true },
                        },
                    },
                },
            },
        });

        if (!watchlist) {
            watchlist = await prisma.watchlist.create({
                data: { userId, nombre: "Mi Lista" },
                include: { items: true },
            });
        }

        res.json(watchlist);
    } catch (error) {
        next(error);
    }
});

// 2. AGREGAR UNA PELÍCULA A LA WATCHLIST
router.post(
    "/",
    verifyToken,
    addToWatchlistRules,
    validateFields,
    async (req, res, next) => {
        try {
            const userId = req.user.id;
            const { movieId } = req.body;

            // Verificar que la película exista en la BD
            const peliculaExiste = await prisma.pelicula.findUnique({
                where: { id: parseInt(movieId) },
            });
            if (!peliculaExiste) {
                throw new NotFoundError(
                    `La película con ID ${movieId} no existe.`,
                );
            }

            // Obtener o crear la cabecera de la watchlist
            let watchlist = await prisma.watchlist.findFirst({
                where: { userId },
            });
            if (!watchlist) {
                watchlist = await prisma.watchlist.create({ data: { userId } });
            }

            // Verificar si la película ya está en la lista para evitar duplicados
            const yaExisteEnLista = await prisma.watchlistItem.findUnique({
                where: {
                    watchlistId_movieId: {
                        watchlistId: watchlist.id,
                        movieId: parseInt(movieId),
                    },
                },
            });

            if (yaExisteEnLista) {
                throw new ValidationError(
                    "Esta película ya se encuentra en tu lista de favoritos.",
                );
            }

            // Agregar al detalle
            const nuevoItem = await prisma.watchlistItem.create({
                data: {
                    watchlistId: watchlist.id,
                    movieId: parseInt(movieId),
                },
                include: { pelicula: true },
            });

            res.status(201).json({
                message: "Película agregada a favoritos",
                item: nuevoItem,
            });
        } catch (error) {
            next(error);
        }
    },
);

// 3. ELIMINAR UNA PELÍCULA DE LA WATCHLIST
router.delete("/:movieId", verifyToken, async (req, res, next) => {
    try {
        const userId = req.user.id;
        const movieId = parseInt(req.params.movieId);

        // Buscar la lista del usuario
        const watchlist = await prisma.watchlist.findFirst({
            where: { userId },
        });
        if (!watchlist) {
            throw new NotFoundError("No tienes una lista de favoritos activa.");
        }

        // Verificar si el item existe en su lista antes de borrar
        const item = await prisma.watchlistItem.findUnique({
            where: {
                watchlistId_movieId: {
                    watchlistId: watchlist.id,
                    movieId: movieId,
                },
            },
        });

        if (!item) {
            throw new NotFoundError(
                "La película no está en tu lista de favoritos.",
            );
        }

        // Eliminar el registro del detalle
        await prisma.watchlistItem.delete({
            where: { id: item.id },
        });

        res.json({ message: "Película eliminada de tus favoritos" });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
