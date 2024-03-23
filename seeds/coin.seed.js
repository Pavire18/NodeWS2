const { mongoose } = require("mongoose");
const { connect } = require("../db.js");
const { cryptoSeed } = require("../seeds/coin.seed.aux.js");

const seed = async () => {
  try {
    await connect();
    console.log("Tenemos conexión");
    await cryptoSeed();
  } catch (error) {
    console.log(error);
  } finally {
    mongoose.disconnect();
  }
};

seed();
