'use strict';

angular
    .module('FraudSystem')
    .controller('MainController', MainController);

MainController.$inject = ['APIService'];

function MainController(APIService) {
    var vm = this;

    // propriedades
    vm.networks          = [];
    vm.status            = [];
    vm.collision_network = [];

    // métodos
    vm.addCollision    = addCollision;
    vm.refreshNetworks = refreshNetworks;
    vm.searchCollision = searchCollision;

    /////////////

    /**
     * {description} Método público responsável por enviar uma colisão para o servidor.
     * @param {int} nodeX Primeiro nó da colisão
     * @param {int} nodeY Segundo nó da colisão
     * 
     */
    function addCollision(nodeX, nodeY) {
        log("Adicionando colisão..");
        APIService.addCollision(nodeX, nodeY).then(function(result) {
            log(result);
        });
        vm.refreshNetworks();
        vm.nodeX = "";
        vm.nodeY = "";
    }


    /**
     * {description} Método público responsável por atualizar as redes de colisões na view.
     * 
     */
    function refreshNetworks() {
        APIService.getNetworks().then(function(response) {
            log("Atualizando redes de colisões");
            vm.networks = response.data.networks;
        })
    }


    /**
     * {description} Método público responsável por buscar uma rede de colisões contendo os dois nós informados.
     * @param {int} nodeX Primeiro nó da colisão
     * @param {int} nodeY Segundo nó da colisão
     */
    function searchCollision(nodeX, nodeY) {        
        APIService.searchCollisionNetwork(nodeX, nodeY).then(function(result) {
            if (result.network) {
                log("Rede encontrada: " + result.network.join(","));
            } else {
                log("Nenhuma rede encontrada.");
            }
        });
    }


    /**
     * {description} Método privado responsável por gerar um log de status da aplicação.
     * @param {string} message Mensagem para inserir no status
     * 
     */
    function log(message) {
        vm.status.push(logTime() + " - " + message);
    }


    /**
     * {description} Método privado responsável por exibir a data e hora do log.
     * @return {string} 
     * 
     */
    function logTime() {
        var currentdate = new Date(); 
        var month = currentdate.getMonth()+1;
        var currentMonth,
            hour = currentdate.getHours(),
            minutes = currentdate.getMinutes(),
            seconds = currentdate.getSeconds();

        if (month < 10)
            currentMonth = '0' + month;
        if (hour < 10)
            hour = '0' + currentdate.getHours();
        if (minutes < 10)
            minutes = '0' + currentdate.getMinutes();
        if (seconds < 10)
            seconds = '0' + currentdate.getSeconds();

        var datetime =  currentdate.getDate() + "/"
                        + currentMonth + "/" 
                        + currentdate.getYear() + " "  
                        + hour + ":"                          
                        + minutes + ":" 
                        + seconds;
        
        return datetime;
    }

    vm.$onInit = function() {
        vm.refreshNetworks();
    }
}