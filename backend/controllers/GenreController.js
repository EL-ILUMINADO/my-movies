import Genre from "../models/Genre.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const createGenre = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }
    const existingGenre = await Genre.findOne({ name });

    if (existingGenre) {
      return res.status(400).json({ error: "Genre already exists" });
    }

    const genre = await new Genre({ name }).save();
    res.status(201).json(genre);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

// updateGenre

const updateGenre = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    const genre = await Genre.findOne({ _id: id });

    if (!genre) {
      return res.status(404).json({ error: "Genre not found" });
    }

    genre.name = name;

    const updatedGenre = await genre.save();
    res.status(200).json(updatedGenre);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const removeGenre = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const removed = await Genre.findByIdAndDelete(id);

    if (!removed) {
      return res.status(404).json({ error: "Genre not found" });
    }

    res.json(removed);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const listGenres = asyncHandler(async (req, res) => {
  try {
    const all = await Genre.find({});
    res.json(all);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.message);
  }
});

const readGenre = asyncHandler(async (req, res) => {
  try {
    const genre = await Genre.findOne({ _id: req.params.id });
    res.json(genre);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.message);
  }
});

export { createGenre, updateGenre, removeGenre, listGenres, readGenre };
