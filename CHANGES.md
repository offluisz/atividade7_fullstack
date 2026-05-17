# Mudanças: Vinculação de Lote ao Estoque

## Problema
Ao cadastrar um produto, o lote era criado separadamente do registro de movimentação de estoque. O campo `itens_id` em `movi_estoque` era salvo como `null`, impossibilitando exibir o nome do lote na listagem de estoque.

---

## Arquivos Alterados

### 1. `models/loteModel.js`

**Método `Save()`**: alterado de `ExecutaComandoNonQuery` para `ExecutaComandoLastInserted`, fazendo com que o método retorne o `lote_id` gerado pelo banco e salve em `this.#id`.

```js
// Antes
let result = await banco.ExecutaComandoNonQuery(sql, values)
return result

// Depois
let result = await banco.ExecutaComandoLastInserted(sql, values)
this.#id = result
return result
```

---

### 2. `controllers/produtoController.js`

**Método `cadastrarProduto()`**: a ordem de criação foi invertida. O lote agora é criado **antes** do registro de estoque, e o `lote_id` retornado é passado como `itensId` ao gravar o estoque.

```js
// Antes
await estoque.gravar()       // itensId = null
await lote.Save()            // lote criado depois, sem vínculo

// Depois
let loteId = await lote.Save()   // lote criado primeiro, retorna o ID
estoque.itensId = loteId         // ID vinculado ao estoque
await estoque.gravar()
```

---

### 3. `models/estoqueModel.js`

- Adicionado campo privado `#loteNome` com getter e setter.
- Parâmetro `loteNome` incluído no construtor.
- SQL de `listarEstoque()` atualizado para incluir `LEFT JOIN tb_lote` pelo `lote_id`.

```sql
-- Antes
SELECT * FROM movi_estoque me
INNER JOIN tb_produto p ON p.prd_id = me.prod_id
ORDER BY movi_id DESC

-- Depois
SELECT me.*, p.prd_nome, p.prd_quantidade, l.lote_nome
FROM movi_estoque me
INNER JOIN tb_produto p ON p.prd_id = me.prod_id
LEFT JOIN tb_lote l ON l.lote_id = me.itens_id
ORDER BY movi_id DESC
```

---

### 4. `views/estoque/listar.ejs`

Coluna "Lote" atualizada para usar `item.loteNome` com fallback para `-` quando não houver lote vinculado.

```html
<!-- Antes -->
<td><%= item.lote %></td>

<!-- Depois -->
<td><%= item.loteNome || '-' %></td>
```

---

## Observação

Registros de estoque já existentes no banco com `itens_id = null` continuarão exibindo `-` na coluna Lote. Apenas novos cadastros de produtos terão o lote corretamente vinculado.
