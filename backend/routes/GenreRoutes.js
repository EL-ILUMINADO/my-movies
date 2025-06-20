import express from "express";

const router = express.Router();

// controllers
import {
  createGenre,
  updateGenre,
  removeGenre,
  listGenres,
  readGenre,
} from "../controllers/GenreController.js";
// middlewares
import {
  authenticate,
  authorizedAdmin,
} from "../middlewares/authMiddleware.js";

// POST - Only admins can create genres
router.post("/", authenticate, authorizedAdmin, createGenre);

// PUT - Only admins can update genres
router.put("/:id", authenticate, authorizedAdmin, updateGenre);

// DELETE - Only admins can delete genres
router.delete("/:id", authenticate, authorizedAdmin, removeGenre);

// GET - ✅ Make this public so anyone can fetch genres for dropdowns
router.get("/genres", listGenres);

// READ a genre - Already public
router.get("/:id", readGenre);

export default router;
