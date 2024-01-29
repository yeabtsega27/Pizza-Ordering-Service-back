// create like controller to create like by id and delete like by id and movie id and edit like by id and movie id
const { Like } = require("../models");
const { Movie } = require("../models");
const { User } = require("../models");

// create like by id
const createLike = async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id);

    if (!movie) return res.status(404).json({ error: "movie not found" });

    const likeExists = await Like.findOne({
      where: {
        userId: req.user.id,
        movieId: req.params.id,
      },
    });

    if (likeExists)
      return res.status(400).json({ error: "like already exists" });

    // get length all move likes by movie id where like is true
    const likes = await Like.findAll({
      where: {
        movieId: req.params.id,
        like: true,
      },
    });

    const like = await Like.create({
      userId: req.user.id,
      movieId: req.params.id,
      like: req.body.like,
    });

    const voteCount = movie.voteCount + 1;
    const rating =
      ((likes.length + (req.body.like == "true" ? 1 : 0)) * 10) / voteCount;

    movie.voteCount = voteCount;

    movie.rating = rating;

    await movie.save();

    res.status(201).json({ like });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

// edit like by id and movie id
const updateLike = async (req, res) => {
  try {
    const like = await Like.findOne({
      where: {
        userId: req.user.id,
        movieId: req.params.id,
      },
    });
    if (!like) return res.status(404).json({ error: "like not found" });

    if (req.body.like == "true" && like.like == false) {
      like.like = true;
      const movie = await Movie.findByPk(req.params.id);
      const likes = await Like.findAll({
        where: {
          movieId: req.params.id,
          like: true,
        },
      });
      const voteCount = movie.voteCount;
      const rating = ((likes.length + 1) * 10) / voteCount;
      movie.voteCount = voteCount;
      movie.rating = rating;
      await movie.save();
    } else if (req.body.like == "false" && like.like == true) {
      like.like = false;
      const movie = await Movie.findByPk(req.params.id);
      const likes = await Like.findAll({
        where: {
          movieId: req.params.id,
          like: true,
        },
      });
      const voteCount = movie.voteCount;
      const rating = ((likes.length - 1) * 10) / voteCount;
      movie.voteCount = voteCount;
      movie.rating = rating;
      await movie.save();
    }
    await like.save();

    // await like.update({ like: req.body.like });
    res.status(200).json({ like });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

// get all likes

const getLikes = async (req, res) => {
  try {
    const likes = await Like.findAll({
      include: [
        {
          model: Movie,
          as: "movie",
          attributes: ["id", "title"],
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "firstName", "lastName"],
        },
      ],
    });
    res.status(200).json(likes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

// get like by id
const getLikeById = async (req, res) => {
  try {
    const like = await Like.findByPk(req.params.id, {
      include: [
        {
          model: Movie,
          as: "movie",
          attributes: ["id", "title"],
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "firstName", "lastName"],
        },
      ],
    });
    if (!like) return res.status(404).json({ error: "like not found" });
    res.status(200).json({ like });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

module.exports = {
  createLike,
  updateLike,
  getLikes,
  getLikeById,
};
