// create episode controller to create episode delete episode and edit episode
const { Episode, Season } = require("../models");

// create episode by season id
const createEpisode = async (req, res) => {
  try {
    if (!req.body.title || !req.body.episodeLink)
      return res.status(400).json({ error: "title, episodeLink is required" });

    const season = await Season.findByPk(req.params.id);
    if (!season) return res.status(404).json({ error: "season not found" });

    const seasonEpisodes = await Episode.findAll({
      where: { seasonId: req.params.id },
    });

    const episode = await Episode.create({
      seasonId: req.params.id,
      episodeNumber: seasonEpisodes.length + 1,
      episodeLink: req.body.episodeLink,
      title: req.body.title,
      movieId: season.movieId,
    });

    res.status(201).json({ episode });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

// remove episode by episode id
const destroyEpisode = async (req, res) => {
  try {
    const episode = await Episode.findByPk(req.params.id);

    if (!episode) return res.status(400).json({ error: "episode not found" });

    await episode.destroy();

    res.status(200).json({ message: "episode deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

// edit episode by episode id
const updateEpisode = async (req, res) => {
  try {
    if (!req.body.title || !req.body.episodeLink)
      return res.status(400).json({ error: "title, episodeLink is required" });
    const episode = await Episode.findByPk(req.params.id);

    if (!episode) return res.status(400).json({ error: "episode not found" });

    episode.title = req.body.title;
    episode.episodeLink = req.body.episodeLink;

    if (req.body.episodeNumber) {
      episode.episodeNumber = req.body.episodeNumber;
    }

    await episode.save();

    res.status(200).json({ episode });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

//export controller
module.exports = {
  createEpisode,
  destroyEpisode,
  updateEpisode,
};
