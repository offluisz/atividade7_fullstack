const PedidoItemModel = require("../models/pedidoItemModel");
const PedidoModel = require("../models/pedidoModel");
const ProdutoModel = require("../models/produtoModel");
const EstoqueModel = require('../models/estoqueModel')
const LoteModel = require('../models/loteModel')


class PedidoController {

    async gravar(req, res) {
        console.log(req.body);
        let ok = false;
        let msg = "";
        if(req.body.length > 0) {
            //se veio itens, cria o pedido
            let pedido = new PedidoModel();
            let pedidoId = await pedido.gravar(); 
            pedido.pedidoValorTotal = 0;
            if(pedidoId) {
                //concluiu a geração do pedido, iremos gerar os itens
                let produto = new ProdutoModel();
                for(let i=0; i<req.body.length; i++) {
                    produto = await produto.buscarProduto(req.body[i].id);
                    if(produto.produtoQuantidade < req.body[i].quantidade) {
                        return res.send({ok:false, msg: "Produto " + produto.produtoNome + " não possui estoque suficiente!"});
                    }
                    let item = new PedidoItemModel();
                    item.pedidoId = pedidoId;
                    item.produtoId = produto.produtoId;
                    item.pedidoItemQuantidade = req.body[i].quantidade;
                    item.pedidoItemValor = produto.produtoValor;
                    item.pedidoItemValorTotal = item.pedidoItemQuantidade * item.pedidoItemValor;
                    await item.gravar();
                    pedido.pedidoValorTotal += item.pedidoItemValorTotal;

                    //atualizar o estoque
                    let lote = await new LoteModel().buscarPorProdutoId(produto.produtoId);
                    let estoque = new EstoqueModel(0, item.pedidoItemQuantidade, "Saída", produto.produtoId, lote ? lote.id : null);
                    await estoque.gravar();
                    //atualizar a quantidade do produto
                    produto.produtoQuantidade -= item.pedidoItemQuantidade;
                    await produto.gravar();
                }

                await pedido.atualizar();
                ok = true;
                msg = "Pedido gerado com sucesso!";
            }
            else {
                msg = "Erro ao gerar pedido.";
            }
        }
        else {
            //sem itens
            msg = "Nenhum produto enviado!";
        }
        //resposta ao frontend
        res.send({ok, msg});
    }
}

module.exports = PedidoController;