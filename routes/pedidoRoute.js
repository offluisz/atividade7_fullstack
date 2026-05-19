const express = require("express");
const PedidoController = require("../controllers/pedidoController");

const router = express.Router();

let ctrl = new PedidoController();
router.post("/gravar", ctrl.gravar);
router.get("/", ctrl.pedidosView);
router.get("/listar", ctrl.listarPedidos);

module.exports = router;