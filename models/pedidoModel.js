const Database = require("../db/database");

const banco = new Database();

class PedidoModel {

    #pedidoId;
    #pedidoData;
    #pedidoValorTotal;

    get pedidoId() {
        return this.#pedidoId;
    }
    set pedidoId(pedidoId){
        this.#pedidoId = pedidoId;
    }

    get pedidoData() {
        return this.#pedidoData;
    }
    set pedidoData(pedidoData){
        this.#pedidoData = pedidoData;
    }

    get pedidoValorTotal() {
        return this.#pedidoValorTotal;
    }

    set pedidoValorTotal(value) {
        this.#pedidoValorTotal = value;
    }

    constructor(pedidoId, pedidoData, pedidoValorTotal) {
        this.#pedidoId = pedidoId;
        this.#pedidoData = pedidoData;
        this.#pedidoValorTotal = pedidoValorTotal;
    }

    async listar() {
        let sql = "select * from tb_pedido";

        let valores = [];

        let rows = await banco.ExecutaComando(sql, valores);

        let listaPedidos = [];

        for(let i =0; i< rows.length; i++) {
            let row = rows[i];
            listaPedidos.push(new PedidoModel(row["ped_id"], row["ped_data"], row["ped_valortotal"]));
        }

        return listaPedidos;
    }

    async gravar() {
        //now() é um função do mysql para retornar a data e hora atual
        let sql = "insert into tb_pedido (ped_data) values (now())";     
        let valores = [];
        
        let result = await banco.ExecutaComandoLastInserted(sql, valores);
        this.#pedidoId = result;
        return result;
    }

    async atualizar() {
        let sql = "update tb_pedido set ped_valortotal = ? where ped_id = ?";

        let valores = [this.#pedidoValorTotal, this.#pedidoId];

        let result = await banco.ExecutaComandoLastInserted(sql, valores);

        return result;
    }

}

module.exports = PedidoModel;