document.addEventListener("DOMContentLoaded", function(){
    let btn = document.getElementById("btnBuscar");
    btn.addEventListener("click", listarPedidosId);
    
    listarPedidos();

    function listarPedidos(){
        fetch("/pedido/listar")
        .then(res =>{
            return res.json();
        })
        .then(data =>{
            montarTabela(data);
        })
    }


    function montarTabela(listaPedidos){
        let html = ""

        for(let lista of listaPedidos){
            html +=
            `<tr>
                        <td>${lista.pedidoId}</td>
                        <td>R$ ${lista.pedidoValor}</td>
                        <td>${lista.itemNome}</td>
                        <td>${lista.itemQuantidade}</td>  
                        <td>R$ ${lista.itemValor}</td>                         
                        <td>R$ ${lista.itemValorTotal}</td>
                    </tr>`;
        }

        document.querySelector("#tabelaPedidos > tbody").innerHTML = html;
    }

    function listarPedidosId(){
        let pedidoId = document.getElementById("txtBusca").value;
        fetch("/pedido/listar/" + pedidoId)
        .then(res =>{
            return res.json();
        })
        .then(data =>{
            montarTabela(data);
        })
    }
})