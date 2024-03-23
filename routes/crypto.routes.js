const express = require("express");

// Modelos
const { Coin } = require("../models/Coin.js");
const { cryptoSeed } = require("../seeds/coin.seed.aux.js");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const coins = await Coin.find()
      .limit(limit)
      .skip((page - 1) * limit);

    const totalElements = await Coin.countDocuments();

    const response = {
      totalItems: totalElements,
      totalPages: Math.ceil(totalElements / limit),
      currentPage: page,
      data: coins,
    };

    res.json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/reset", async (req, res) => {
  try {
    const resetedCoins = await cryptoSeed();
    res.json(resetedCoins);
  } catch (error) {
    res.status(500).json(error);
  }
});

// CSV
router.get("/csv", async (req, res) => {
  try {
    let csv = "";
    csv = csv + "Name;Price;MarketCap,created_at \n";

    const coins = await Coin.find();

    coins.forEach((item) => {
      csv = csv + item.name + ";" + item.price + ";" + item.marketCap + ";" + item.createdAt + ";";
      csv = csv + "\n";
    });

    res.set("Content-Type", "text/text");
    res.send(csv);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/sorted-by-marketcap", async (req, res) => {
  try {
    const order = req.query.order ? req.query.order : "asc";
    const coins = await Coin.find().sort({ marketCap: order });

    res.json(coins);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/sorted-by-date", async (req, res) => {
  try {
    const order = req.query.order ? req.query.order : "asc";
    const coins = await Coin.find().sort({ createdAt: order });

    res.json(coins);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/price-range", async (req, res) => {
  try {
    const min = parseInt(req.query.min);
    const max = parseInt(req.query.max);
    const coins = await Coin.find({ price: { $gte: min, $lte: max } });

    res.json(coins);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/name/:name", async (req, res) => {
  const name = req.params.name;

  try {
    const coin = await Coin.find({ name: new RegExp("^" + name.toLowerCase(), "i") });
    if (coin?.length) {
      res.json(coin);
    } else {
      res.status(404).json([]);
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/", async (req, res) => {
  try {
    const book = new Coin({
      name: req.body.name,
      price: req.body.price,
      marketCap: req.body.marketCap,
    });

    const createdCoin = await book.save();
    return res.status(201).json(createdCoin);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const coinDeleted = await Coin.findByIdAndDelete(id);
    if (coinDeleted) {
      res.json(coinDeleted);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const coinUpdated = await Coin.findByIdAndUpdate(id, req.body, { new: true });
    if (coinUpdated) {
      res.json(coinUpdated);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const coin = await Coin.findById(id);
    if (coin) {
      res.json(coin);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = { cryptoRouter: router };
