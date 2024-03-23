const express = require("express");
const { cryptoRouter } = require("./routes/crypto.routes.js");

// Conexión a la BBDD
const { connect } = require("./db.js");
connect();

// Creamos router de expres
const PORT = 3000;
const server = express();
const router = express.Router();

// Configuración del server
server.use(express.json());
server.use(express.urlencoded({ extended: false }));

// Rutas
router.get("/", (req, res) => {
  res.send("Esta es la home de nuestra API");
});

router.get("*", (req, res) => {
  res.status(404).send("Lo sentimos :( No hemos encontrado la página solicitada.");
});

server.use("/crypto", cryptoRouter);
server.use("/", router);

server.listen(PORT, () => {
  console.log(`Server levantado en el puerto ${PORT}`);
});
