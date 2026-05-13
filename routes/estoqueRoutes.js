const express = require ('express');
const router = express.Router();
const EstoqueController = require('../controllers/estoqueController');

let ctrl = new EstoqueController();

router.get("/", ctrl.listarView);

module.exports = router;