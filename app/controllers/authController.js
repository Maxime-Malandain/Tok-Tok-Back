const bcrypt = require("bcrypt");
const validator = require("email-validator");
const { v4: uuidv4 } = require("uuid");
//const zxcvbn = require("zxcvbn");

const jwt = require("jsonwebtoken");

const { User } = require("../models/index");

const authController = {
  signup: async (req, res) => {
    try {
      //! Ne pas oublier le champ confirmation en front et reprendre exactement les mêmes names
      const {
        firstname,
        lastname,
        address,
        city,
        longitude,
        latitude,
        email,
        password,
        confirmation,
      } = req.body;

      //! NOUVEAU
      if (
        !firstname ||
        !lastname ||
        !address ||
        !city ||
        !longitude ||
        !latitude ||
        !email ||
        !password ||
        !confirmation
      ) {
        res
          .status(400)
          .json({ error: "Tous les champs doivent être renseignés !" });
        return;
      }

      if (password !== confirmation) {
        res
          .statut(400)
          .json({ error: "Les deux mots de passe ne correspondent pas !" });
        return;
      }

      if (!validator.validate(email)) {
        res.status(400).json({ error: "Le format de l'email est invalide !" });
        return;
      }

      //! NOUVEAU
      const existingEmail = await User.findOne({
        where: {
          email: email,
        },
      });

      if (existingEmail) {
        res
          .status(400)
          .json({ error: "Cet email est déjà associé à un compte" });
        return;
      }

      //* on le retire tant qu'on ne sait pas à quoi correspond le score (pas cool pour l'ux si pas d'indications), voire on fait notre propre fonction
      // const passwordStrength = zxcvbn(password);
      // if (passwordStrength.score < 1) {
      //   res
      //     .status(400)
      //     .json({ errorMessage: "Le mot de passe est trop faible." });
      //   return;
      // }

      const saltRounds = parseInt(process.env.SALT_ROUNDS);
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      //! NOUVEAU : slug, city, lon, lat
      const user = new User({
        firstname,
        lastname,
        address,
        city,
        longitude,
        latitude,
        email: email.toLowerCase(),
        password: hashedPassword,
        slug: `${firstname.toLowerCase()}-${lastname.toLowerCase()}-${uuidv4()}`,
      });
      await user.save();

      const token = jwt.sign({ userId: user.id }, process.env.SECRETTOKEN, {
        expiresIn: process.env.EXPIREDATETOKEN,
      });

      //! NOUVEAU
      const userObj = {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        address: user.address,
        city: user.city,
        longitude: user.longitude,
        latitude: user.latitude,
        thumbnail: user.thumbnail,
        slug: user.slug
      };

      res.status(201).json({
        message: "Compte crée",
        auth: true,
        token: token,
        user: userObj,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({error: "Erreur Serveur !"});
    }

  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({
        where: { email: email.toLowerCase() },
      });

      if (!user) {
        return res
          .status(400)
          .json({ errorMessage: "Mauvais couple email/password !" });
      }

      const isMatching = await bcrypt.compare(password, user.password);

      if (!isMatching) {
        return res
          .status(400)
          .json({ errorMessage: "Mauvais couple email/password !" });
      }


      // A chaque connexion, le user reçoit un token que l'on mettra en en-tête des requêtes http sur les routes où il faut être loggué/authentifié
      const token = jwt.sign({ userId: user.id }, process.env.SECRETTOKEN, {
        expiresIn: process.env.EXPIREDATETOKEN,
      });

      //! NOUVEAU
      const userObj = {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        address: user.address,
        city: user.city,
        thumbnail: user.thumbnail,
      };

      res.json({ auth: true, token: token, user: userObj });
    } catch (error) {
      console.log(error);
      res.status(500).json({error: "Erreur Serveur !"});
    }
  },
};

module.exports = authController;
