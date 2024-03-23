const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Creamos el schema del usuario
const coinSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    marketCap: {
      type: Number,
      required: false,
    }
  },
  {
    timestamps: true,
  }
);

const Coin = mongoose.model("Crypto", coinSchema);
module.exports = { Coin };
