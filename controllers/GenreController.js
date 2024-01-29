// create Genre controller for create getall getone update destroy
const { Genre } = require("../models");

// create genre
const createGenre = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "All input is required" });
    }

    // make sure genre doesn't already exist
    const genreExists = await Genre.findOne({ where: { genreName: name } });
    if (genreExists) {
      return res.status(400).json({ error: "Genre already exists" });
    }

    const genre = await Genre.create({ genreName: name });
    console.log(name, genre);
    res.status(201).json({ genre });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

// get all genres
const getGenres = async (req, res) => {
  try {
    const genres = await Genre.findAll();
    res.status(200).json(genres);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

// get genre by id
const getGenre = async (req, res) => {
  try {
    const genre = await Genre.findByPk(req.params.id);
    if (!genre) {
      return res.status(404).json({ error: "Genre not found" });
    }
    res.status(200).json(genre);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

// update genre by id
const updateGenre = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "All input is required" });
    }
    const genre = await Genre.findByPk(req.params.id);
    if (!genre) {
      return res.status(404).json({ error: "Genre not found" });
    }

    genre.genreName = name;
    await genre.save();
    res.status(200).json(genre);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

// destroy genre by id
const destroyGenre = async (req, res) => {
  try {
    const genre = await Genre.findByPk(req.params.id);
    if (!genre) {
      return res.status(404).json({ error: "Genre not found" });
    }
    await genre.destroy();
    res.status(200).json({ message: "Genre deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

module.exports = {
  createGenre,
  getGenres,
  getGenre,
  updateGenre,
  destroyGenre,
};
