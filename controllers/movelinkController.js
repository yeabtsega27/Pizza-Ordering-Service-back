// create controller to add movie link by movie id remove movie link by movie id and edit movie link by movie id
const { MovieLink, Movie } = require("../models");

// create movie link by movie id
const createMovieLink = async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id);

    if (!req.body.link)
      return res.status(400).json({ error: "link is required" });
    if (!movie) return res.status(404).json({ error: "movie not found" });

    if (movie.type === "Drama") {
      return res.status(404).json({ error: "can not add movie link on drama" });
    }

    const movieLink = await MovieLink.create({
      movieId: req.params.id,
      link: req.body.link,
    });

    res.status(201).json({ movieLink });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

// remove movie link by movie id
const destroyMovieLink = async (req, res) => {
  try {
    const movieLink = await MovieLink.findByPk(req.params.id);

    if (!movieLink)
      return res.status(400).json({ error: "movie link not found" });

    await movieLink.destroy();

    res.status(200).json({ message: "movie link deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

// edit movie link by movie id
const updateMovieLink = async (req, res) => {
  try {
    if (!req.body.link)
      return res.status(400).json({ error: "link is required" });
    const movieLink = await MovieLink.findByPk(req.params.id);

    if (!movieLink)
      return res.status(400).json({ error: "movie link not found" });

    movieLink.link = req.body.link;

    await movieLink.save();

    res.status(200).json({ movieLink });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

module.exports = {
  createMovieLink,
  destroyMovieLink,
  updateMovieLink,
};
