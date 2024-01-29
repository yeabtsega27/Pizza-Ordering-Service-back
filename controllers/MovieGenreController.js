// create controller to add movie link by movie id remove movie link by movie id and edit movie link by movie id
const { MovieGenre, Movie } = require("../models");

// create movie link by movie id
const createMovieGener = async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id);

    if (!req.body.genre)
      return res.status(400).json({ error: "genre is required" });
    if (!movie) return res.status(404).json({ error: "movie not found" });

    const movieGenre = await MovieGenre.create({
      movieId: req.params.id,
      genreId: req.body.genre,
    });

    res.status(201).json({ movieGenre });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

// remove movie link by movie id
const destroyMovieGener = async (req, res) => {
  try {
    const movieGenre = await MovieGenre.findByPk(req.params.id);

    if (!movieGenre)
      return res.status(400).json({ error: "movie genre not found" });

    await movieLink.destroy();

    res.status(200).json({ message: "movie genre deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

module.exports = {
  createMovieGener,
  destroyMovieGener,
};
