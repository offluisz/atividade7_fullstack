const EstoqueModel = require('../models/estoqueModel');

class EstoqueController {
    async listarView(req, res) {
        let estoque = new EstoqueModel();
        let lista = await estoque.listarEstoque();
        res.render('estoque/listar', {estoque: lista});
    }
}

module.exports = EstoqueController;