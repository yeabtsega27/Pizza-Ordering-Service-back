// create movie controller for create getall getone update destroy
const { Movie } = require("../models");
const { Genre } = require("../models");
const { MovieGenre } = require("../models");
const { MovieLink } = require("../models");
const { Season } = require("../models");
const { Episode } = require("../models");
const { Like } = require("../models");

const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");

// create movie
const createMovie = async (req, res) => {
  try {
    const {
      title,
      slug,
      releaseDate,
      duration,
      cast,
      overview,
      trailer,
      production,
      type,
    } = req.body;
    if (!req.files.posterLandscape || !req.files.posterPortrait) {
      return res.status(400).json({ error: "All poster images is requred " });
    }

    if (
      !title ||
      !slug ||
      !releaseDate ||
      !duration ||
      !type ||
      !production ||
      !trailer ||
      !overview ||
      !cast
    ) {
      return res.status(400).json({ error: "all filds are required" });
    }
    if (!(type === "Movie" || type === "Drama"))
      return res.status(400).json({ error: "incorect movie type" });

    const findmovie = await Movie.findOne({ where: { slug } });

    if (findmovie) {
      console.log(findmovie);
      return res.status(400).json({ error: "movie already exist" });
    }

    // get the uploaded files
    const posterPortrait = req.files.posterPortrait;
    const posterLandscape = req.files.posterLandscape;

    // uploade files to server
    const posterPortraitName = uuidv4() + posterPortrait.name;
    const posterLandscapeName = uuidv4() + posterLandscape.name;

    // move files to server
    posterPortrait.mv(
      `${__dirname}/../public/uploads/${posterPortraitName}`,
      (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "An error occurred" });
        }
      }
    );

    posterLandscape.mv(
      `${__dirname}/../public/uploads/${posterLandscapeName}`,
      (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "An error occurred" });
        }
      }
    );

    // create movie
    const movie = await Movie.create({
      title,
      slug,
      releaseDate,
      duration,
      cast,
      overview,
      trailer,
      production,
      type,
      posterPortrait: posterPortraitName,
      posterLandscape: posterLandscapeName,
    });

    // add genres to movie
    const genres = req.body.genres;
    console.log(genres.split(","));
    genres.split(",").forEach(async (genre) => {
      console.log(genre);
      const genreData = await Genre.findByPk(genre.split(" ")[0]);
      if (genreData) {
        await MovieGenre.create({
          genreId: genre.split(" ")[0],
          movieId: movie.id,
        });
      }
    });

    if (type === "Movie") {
      if (!req.body.MovieLink)
        return res.status(400).json({ error: "movie link is required" });

      await MovieLink.create({
        movieId: movie.id,
        link: req.body.MovieLink,
      });
    }

    res.status(201).json({ movie });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

//get all movies with genres and links
const getMovies = async (req, res) => {
  try {
    const movies = await Movie.findAll();
    res.status(200).json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

//get one movie with genres and links by id
const getMovieById = async (req, res) => {
  try {
    let respons = {};
    const movie = await Movie.findByPk(req.params.id, {
      include: [
        {
          model: Like,
          as: "like",
          attributes: ["userId", "like"],
        },
      ],
    });
    if (!movie) return res.status(400).json({ error: "movie not found" });
    //get all MovieGenre by movie id includ name from gener by generid

    const geners = await MovieGenre.findAll({
      where: { movieId: movie.id },
      include: [
        {
          model: Genre,
          as: "movieGenre",
          attributes: ["genreName"],
        },
      ],
    });

    if (movie.type === "Drama") {
      const season = await Season.findAll({
        where: { movieId: movie.id },
        include: [
          {
            model: Episode,
            as: "episodes",
            attributes: ["id", "episodeNumber", "title", "episodeLink"],
          },
        ],
      });

      respons = { movie, geners, season };
    } else {
      const movieLink = await MovieLink.findAll({
        where: { movieId: movie.id },
      });
      respons = { movie, geners, movieLink };
    }

    res.status(200).json(respons);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

// update movie by id if fill is not empty and if file is uploaded
const updateMovie = async (req, res) => {
  try {
    const {
      title,
      slug,
      releaseDate,
      duration,
      cast,
      overview,
      trailer,
      production,
      type,
    } = req.body;
    if (
      !title ||
      !slug ||
      !releaseDate ||
      !duration ||
      !type ||
      !production ||
      !trailer ||
      !overview ||
      !cast
    ) {
      return res.status(400).json({ error: "all filds are required" });
    }
    if (!(type === "Movie" || type === "Drama"))
      return res.status(400).json({ error: "incorect movie type" });

    const movie = await Movie.findByPk(req.params.id);
    if (!movie) return res.status(400).json({ error: "movie not found" });

    // get the uploaded files

    if (req.files?.posterPortrait) {
      const posterPortrait = req.files.posterPortrait;
      const posterPortraitName = uuidv4() + posterPortrait.name;
      posterPortrait.mv(
        `${__dirname}/../public/uploads/${posterPortraitName}`,
        (err) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: "An error occurred" });
          }
        }
      );

      movie.posterPortrait = posterPortraitName;
    }
    // move files to server

    if (req.files?.posterLandscape) {
      const posterLandscape = req.files.posterLandscape;
      const posterLandscapeName = uuidv4() + posterLandscape.name;

      posterLandscape.mv(
        `${__dirname}/../public/uploads/${posterLandscapeName}`,
        (err) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: "An error occurred" });
          }
        }
      );

      movie.posterLandscape = posterLandscapeName;
    }

    movie.title = title;
    movie.slug = slug;
    movie.releaseDate = releaseDate;
    movie.duration = duration;
    movie.cast = cast;
    movie.overview = overview;
    movie.trailer = trailer;
    movie.production = production;
    movie.type = type;

    await movie.save();
    res.status(200).json({ movie });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

// delete movie by id
const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id);
    if (!movie) return res.status(400).json({ error: "movie not found" });
    await movie.destroy();
    res.status(200).json({ message: "movie deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

//

const filterMovies = async (req, res) => {
  try {
    const { type, gener, releaseYear } = req.query; // Get the 'type' URL parameter

    // Build the filter object based on the URL parameters
    const filter = {};

    // Filter by type
    if (type && type !== "all") {
      filter.type = type;
    }

    // Filter by genre
    if (gener && gener !== "all") {
      filter["$genres.id$"] = gener.split("-").map(Number);
    }

    // Filter by release year
    if (releaseYear && releaseYear !== "all") {
      const startDate = new Date(releaseYear);
      const endDate = new Date(releaseYear);
      endDate.setFullYear(endDate.getFullYear() + 1);

      filter.releaseDate = {
        [Op.between]: [startDate, endDate],
      };
    }

    const movies = await Movie.findAll({
      where: filter,
      include: [
        {
          model: Genre,
          as: "genres",
          through: { attributes: [] }, // Exclude the join table attributes
        },
      ],
    });

    res.status(200).json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

//search by title
const searchMovie = async (req, res) => {
  try {
    const { title } = req.query;

    const movies = await Movie.findAll({
      where: {
        title: {
          [Op.like]: `%${title}%`,
        },
      },
    });

    res.status(200).json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

//search by title
const searchMovieByCast = async (req, res) => {
  try {
    const { cast } = req.query;

    const movies = await Movie.findAll({
      where: {
        cast: {
          [Op.like]: `%${cast}%`,
        },
      },
    });

    res.status(200).json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

module.exports = {
  createMovie,
  getMovies,
  getMovieById,
  deleteMovie,
  updateMovie,
  filterMovies,
  searchMovie,
  searchMovieByCast,
};
