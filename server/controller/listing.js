const router = require("express").Router();
const Listing = require("../models/Listing");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

router.post("/create", upload.array("listingPhotos"), async (req, res) => {
  try {
    const {
      creator,
      category,
      type,
      streetAddress,
      appSuite,
      city,
      localGovt,
      state,
      bedroomCount,
      bathroomCount,
      amenities,
      title,
      description,
      price,
    } = req.body;

    const listingPhotos = req.files;
    if (!listingPhotos) {
      return res.status(400).send("No Photo uploaded");
    }
    const listingPhotoPaths = listingPhotos.map((file) => file.path);

    const newListing = new Listing({
      creator,
      category,
      type,
      streetAddress,
      appSuite,
      city,
      localGovt,
      state,
      bedroomCount,
      bathroomCount,
      amenities,
      listingPhotoPaths,
      title,
      description,
      price,
    });

    await newListing.save();

    res.status(200).json(newListing);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to create Listing", error: err.message });
  }
});

router.get("/get-listings", async (req, res) => {
  try {
    const listings = await Listing.find({});
    res.status(201).json({
      success: true,
      listings,
    });
  } catch (err) {
    res
      .status(404)
      .json({ message: "Fail to fetch listings", error: err.message });
    console.log(err);
  }
});

/* GET LISTINGS BY SEARCH */
router.get("/search/:search", async (req, res) => {
  const { search } = req.params;

  try {
    let listings = [];

    if (search === "all") {
      listings = await Listing.find().populate("creator");
    } else {
      listings = await Listing.find({
        $or: [
          { category: { $regex: search, $options: "i" } },
          { title: { $regex: search, $options: "i" } },
        ],
      }).populate("creator");
    }

    res.status(200).json(listings);
  } catch (err) {
    res
      .status(404)
      .json({ message: "Fail to fetch listings", error: err.message });
    console.log(err);
  }
});

/* LISTING DETAILS */
router.get("/:listingId", async (req, res) => {
  try {
    const { listingId } = req.params;
    const listing = await Listing.findById(listingId).populate("creator");
    res.status(202).json(listing);
  } catch (err) {
    res
      .status(404)
      .json({ message: "Listing can not found!", error: err.message });
  }
});

module.exports = router;
