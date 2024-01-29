// create controller to favorite to add favorite by id and delete favorite by id and movie id and get all favorite by user id
const { Favorite } = require("../models");
const { Movie } = require("../models");
const { User } = require("../models");

// create favorite by id
const createFavorite = async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id);

    if (!movie) return res.status(404).json({ error: "movie not found" });

    const favoriteExists = await Favorite.findOne({
      where: {
        userId: req.user.id,
        movieId: req.params.id,
      },
    });

    if (favoriteExists)
      return res.status(400).json({ error: "favorite already exists" });

    const favorite = await Favorite.create({
      userId: req.user.id,
      movieId: req.params.id,
    });

    res.status(201).json({ favorite });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

// get all favorite by user id
const getMyFavorite = async (req, res) => {
  try {
    const favorite = await Favorite.findAll({
      where: {
        userId: req.user.id,
      },
      include: [
        {
          model: Movie,
          as: "movie",
          attributes: [
            "id",
            "title",
            "posterPortrait",
            "slug",
            "duration",
            "releaseDate",
            "rating",
            "type",
          ],
        },
      ],
    });

    res.status(200).json({ favorite });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

// delete favorite by id and movie id
const destroyFavorite = async (req, res) => {
  try {
    const favorite = await Favorite.findOne({
      where: {
        userId: req.user.id,
        movieId: req.params.id,
      },
    });

    if (!favorite) return res.status(404).json({ error: "favorite not found" });

    await favorite.destroy();

    res.status(200).json({ favorite });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};
// export module
module.exports = {
  createFavorite,
  getMyFavorite,
  destroyFavorite,
};
