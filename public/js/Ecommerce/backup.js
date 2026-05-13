
document.addEventListener("DOMContentLoaded", function() {

    let carrinho = [];
    if(localStorage.getItem("carrinho") != null) {
        let carrinhoSerializado = localStorage.getItem("carrinho");
        carrinho = JSON.parse(carrinhoSerializado);
    }

    let btns = document.querySelectorAll(".addCarrinho");

    document.addEventListener("show.bs.modal", renderCarrinho);

    for(let i = 0; i<btns.length; i++) {
        btns[i].addEventListener("click", adicionarAoCarrinho);
    }

    function renderCarrinho() {
        let html = "";

        if(carrinho.length > 0) {

            //cabecalho da tabela
            html = `<table class="table table-striped">
                        <thead>
                            <tr>
                                <th>Imagem</th>
                                <th>Produto</th>
                                <th>Quantidade</th>
                                <th>Valor unitário</th>                            
                                <th>Valor total</th>
                            </tr>
                        </thead>
                        <tbody>`;

            for(let i = 0; i<carrinho.length; i++) {
                    html += `<tr>
                                <td><img src="${carrinho[i].imagem}" width="80" /></td>                     
                                <td>${carrinho[i].nome}</td>
                                <td>${carrinho[i].quantidade}</td>
                                <td>${carrinho[i].preco}</td>
                                <td>${carrinho[i].quantidade * carrinho[i].preco}</td>
                            </tr>`;
            }

            html += `   </tbody>
                    </table>`;

            document.querySelector(".modal-body").innerHTML = html;
        }
        else {
            html = "Carrinho vazio!";
        }

    }

    function adicionarAoCarrinho() {
       let produtoId = this.dataset.produto;
       let that = this; 
       //fetch para buscar as informações do produto;
       fetch("/produto/obter/" + produtoId)
       .then(function(cabecalho) {
            return cabecalho.json();
       })
       .then(function(corpo) {
            let produto = corpo.produto;
            //adiciona o produto no localStorage
            //antes de adicionar, verificar se o produto já existe;
            let produtoCarrinho = carrinho.filter(x => x.id == produto.id);
            if(produtoCarrinho.length == 0) { //nao encontrei, adiciona
                //inicializa a quantidade com 1;
                produto.quantidade = 1;
                carrinho.push(produto);
            }
            else { //encontrei, incrementa a quantidade

                produtoCarrinho[0].quantidade += 1;
            }

            localStorage.setItem("carrinho", JSON.stringify(carrinho));

            that.innerHTML = "<i class='fas fa-check'></i> Produto Adicionado!";
            setTimeout(function() {
                that.innerHTML = `<i class="bi-cart-fill me-1"></i> Adicionar ao carrinho`
            }, 3000)
       })
    }
})