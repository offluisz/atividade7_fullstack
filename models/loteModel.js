const Database = require('../db/database');
const banco = new Database()

class LoteModel{
    #id
    #nome
    #quant
    #produtoId

    get id(){
        return this.#id
    }

    set id(value){
        this.#id = value
    }

    get nome(){
        return this.#nome
    }

    set nome(value){
        this.#nome = value
    }

    get quant(){
        return this.#quant
    }

    set quant(value){
        this.#quant = value
    }

    get produtoId(){
        return this.#produtoId
    }

    set produtoId(value){
        this.#produtoId = value
    }

    constructor(nome, quant, produtoId){
        this.#nome = nome
        this.#quant = quant
        this.#produtoId = produtoId
    }

    async Save(){
        let sql = "insert into tb_lote (lote_nome, lote_quant, prd_id) values (?, ?, ?)"
        let values = [this.#nome, this.#quant, this.#produtoId]
       
        let result = await banco.ExecutaComandoLastInserted(sql, values)

        this.#id = result

        return result
    }

    async buscarPorProdutoId(produtoId){
        let sql = "select * from tb_lote where prd_id = ?"

        let values = [produtoId]

        let rows = await banco.ExecutaComando(sql, values)

        if(rows.length > 0){
            let lote = new LoteModel(rows[0]["lote_nome"], rows[0]["lote_quant"], rows[0]["prd_id"])
            lote.id = rows[0]["lote_id"]
            return lote
        }
    }
}

module.exports = LoteModel