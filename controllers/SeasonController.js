// create controller for season to create season delete season
const { Season, Movie } = require("../models");

// create season by movie id
const createSeason = async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id);

    if (!movie) return res.status(404).json({ error: "movie not found" });

    if (movie.type === "Movie") {
      return res.status(404).json({ error: "can not add season on movie" });
    }

    const MovieSeasons = await Season.findAll({
      where: { movieId: req.params.id },
    });

    const season = await Season.create({
      movieId: req.params.id,
      seasonNumber: MovieSeasons.length + 1,
    });

    res.status(201).json({ season });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

// remove season by seasone id
const destroySeason = async (req, res) => {
  try {
    const season = await Season.findByPk(req.params.id);

    if (!season) return res.status(400).json({ error: "season not found" });

    await season.destroy();

    res.status(200).json({ message: "season deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

// edit season by season id
const updateSeason = async (req, res) => {
  try {
    const season = await Season.findByPk(req.params.id);

    if (!season) return res.status(400).json({ error: "season not found" });

    if (req.body.seasonNumber) {
      season.seasonNumber = req.body.seasonNumber;
    }

    await season.save();

    res.status(200).json({ season });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

//export controller
module.exports = {
  createSeason,
  destroySeason,
  updateSeason,
};
