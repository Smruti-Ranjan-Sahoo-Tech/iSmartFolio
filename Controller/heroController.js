const mongoose = require("mongoose");
const heroModel = require("../Modal/heroModel");

class HeroService {
  static async addHero(req, res) {
    try {
      const { name, hero_about } = req.body;
      const bodyUrl = req.body?.imgUrl;
      const imgUrl = req.file ? req.file.path : bodyUrl || undefined;// ✅ safe check
      if (imgUrl && name && hero_about) {

        const { nanoid } = req.user
        const userPresent = await heroModel.findOne({ nanoid });
        if (userPresent) {
          return res.status(409).json({ message: "Hero already exists for this user" });
        }


        const newHeroModel = await heroModel.create({
          nanoid,
          imgUrl,
          name,
          hero_about,
        });

        res.status(201).json({
          message: "Hero saved successfully",
          data: newHeroModel,
        });
      } else {
        res.status(400).json({
          message: "All fields are required",
        });
      }
    } catch (error) {
      console.log("Error while saving hero: ", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async updateHero(req, res) {
    try {
      const { name, hero_about } = req.body;
      const { nanoid } = req.user
      const bodyUrl = req.body?.imgUrl;
      const imgUrl = req.file ? req.file.path : bodyUrl || undefined;// ✅ safe check
      const userPresent = await heroModel.findOne({ nanoid });

      if (!userPresent) {
        return res.status(404).json({ message: "User not found" });
      }
      if (imgUrl || name || hero_about) {
        const updatedHero = await heroModel.findOneAndUpdate(
          { nanoid }, // ✅ match by nanoid
          { imgUrl, name, hero_about },
          { new: true }
        );

        if (!updatedHero) {
          return res.status(404).json({ message: "Hero not found" });
        }

        res.status(200).json({
          message: "Hero updated successfully",
          data: updatedHero,
        });
      } else {
        res.status(400).json({
          message: "At least one field is required to update",
        });
      }
    } catch (error) {
      console.log("Error while updating hero: ", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getHeroes(req, res) {
    try {
      const { nanoid } = req.user;
      const heroes = await heroModel.find({ nanoid }); // ✅ get by nanoid

      res.status(200).json({
        message: "Heroes fetched successfully",
        data: heroes,
      });
    } catch (error) {
      console.log("Error while getting heroes: ", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = HeroService;
