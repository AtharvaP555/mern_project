const SkillOffer = require("../models/SkillOffer");

// Create a new skill offer
exports.createSkillOffer = async (req, res) => {
  try {
    const { title, description, category, price } = req.body;
    const newOffer = new SkillOffer({
      title,
      description,
      category,
      price,
      createdBy: req.user.id, // comes from auth middleware
    });
    await newOffer.save();

    // Populate creator name and send only as string
    await newOffer.populate("createdBy", "name");
    const offerWithName = {
      ...newOffer.toObject(),
      creatorName: newOffer.createdBy?.name || "Unknown",
    };
    delete offerWithName.createdBy; // remove original object

    res.status(201).json(offerWithName);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all skill offers
exports.getSkillOffers = async (req, res) => {
  try {
    const offers = await SkillOffer.find().populate("createdBy", "name").lean();

    const formattedOffers = offers.map((offer) => {
      const { createdBy, ...rest } = offer;
      return {
        ...rest,
        creatorName: createdBy?.name || "Unknown",
      };
    });

    res.json(formattedOffers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single skill offer by ID
exports.getSkillOfferById = async (req, res) => {
  try {
    const offer = await SkillOffer.findById(req.params.id).populate(
      "createdBy",
      "name"
    );
    if (!offer) return res.status(404).json({ message: "Offer not found" });

    const { createdBy, ...rest } = offer.toObject();
    const formattedOffer = {
      ...rest,
      creatorName: createdBy?.name || "Unknown",
    };

    res.json(formattedOffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update skill offer
exports.updateSkillOffer = async (req, res) => {
  try {
    const offer = await SkillOffer.findById(req.params.id);
    if (!offer) return res.status(404).json({ message: "Offer not found" });

    if (offer.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updatedOffer = await SkillOffer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("createdBy", "name");

    const { createdBy, ...rest } = updatedOffer.toObject();
    const formattedOffer = {
      ...rest,
      creatorName: createdBy?.name || "Unknown",
    };

    res.json(formattedOffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete skill offer
exports.deleteSkillOffer = async (req, res) => {
  try {
    const offer = await SkillOffer.findById(req.params.id);
    if (!offer) return res.status(404).json({ message: "Offer not found" });

    if (offer.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await offer.deleteOne();
    res.json({ message: "Offer deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get logged-in user's skill offers
exports.getMySkillOffers = async (req, res) => {
  try {
    const offers = await SkillOffer.find({ createdBy: req.user.id })
      .populate("createdBy", "name")
      .lean();

    const formattedOffers = offers.map((offer) => {
      const { createdBy, ...rest } = offer;
      return {
        ...rest,
        creatorName: createdBy?.name || "Unknown",
      };
    });

    res.json(formattedOffers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
