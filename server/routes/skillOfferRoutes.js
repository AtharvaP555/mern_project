const express = require("express");
const router = express.Router();
const skillOfferController = require("../controllers/skillOfferController");
const authMiddleware = require("../middleware/authMiddleware"); // checks JWT

// CRUD Routes
router.get("/my-offers", authMiddleware, skillOfferController.getMySkillOffers);
router.post("/", authMiddleware, skillOfferController.createSkillOffer);
router.get("/", skillOfferController.getSkillOffers);
router.get("/:id", skillOfferController.getSkillOfferById);
router.put("/:id", authMiddleware, skillOfferController.updateSkillOffer);
router.delete("/:id", authMiddleware, skillOfferController.deleteSkillOffer);

module.exports = router;
