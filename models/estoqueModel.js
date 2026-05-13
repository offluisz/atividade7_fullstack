const Database = require("../db/database");
const banco = new Database()

class EstoqueModel{
    #id
    #quant
    #tipo
    #produtoId
    #produtoNome
    #produtoQuantidade
    #itensId

    get id(){
        return this.#id
    }

    set id(value){
        this.#id = value
    }

    get quant(){
        return this.#quant
    }

    set quant(value){
        this.#quant = value
    }

    get tipo(){
        return this.#tipo
    }

    set tipo(value){
        this.#tipo = value
    }

    get produtoId(){
        return this.#produtoId
    }

    set produtoId(value){
        this.#produtoId = value
    }

    get produtoNome(){
        return this.#produtoNome
    }

    set produtoNome(value){
        this.#produtoNome = value
    }

    get produtoQuantidade(){
        return this.#produtoQuantidade
    }

    set produtoQuantidade(value){
        this.#produtoQuantidade = value
    }

    get itensId(){
        return this.#itensId
    }

    set itensId(value){
        this.#itensId = value
    }

    constructor(id, quant, tipo, produtoId, itensId, produtoNome, produtoQuantidade){
        this.#id = id
        this.#quant = quant
        this.#tipo = tipo
        this.#produtoId = produtoId
        this.#itensId = itensId
        this.#produtoNome = produtoNome
        this.#produtoQuantidade = produtoQuantidade
    }

    async gravar(){
        let sql = "insert into movi_estoque(prod_id, itens_id, movi_tipo, movi_quantidade) values (?,?,?,?)"

        let values = [this.#produtoId, this.#itensId, this.#tipo, this.#quant]

        let result = await banco.ExecutaComandoLastInserted(sql, values)

        this.#id = result

        return result
    }

    async listarEstoque(){
        let sql = "select * from movi_estoque me inner join tb_produto p on p.prd_id = me.prod_id order by movi_id desc"

        let rows = await banco.ExecutaComando(sql)

        let lista = []

        rows.forEach(row =>{
            let estoque = new EstoqueModel(
                row.movi_id,
                row.movi_quantidade,
                row.movi_tipo,
                row.prod_id,
                row.itens_id,
                row.prd_nome,
                row.prd_quantidade
            )
            lista.push(estoque)
        })
        return lista
    }
}

module.exports = EstoqueModel