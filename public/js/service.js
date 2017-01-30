(function() {
'use strict';

    angular
        .module('FraudSystem')
        .service('APIService', APIService);

    APIService.inject = ['$http'];

    function APIService($http) {
        this.addCollision           = addCollision;
        this.getNetworks            = getNetworks;
        this.searchCollisionNetwork = searchCollisionNetwork;

        ////////////////

        function addCollision(x, y) {
            var req = {
                method: 'POST',
                url: '/collision',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {'nodeX': x, 'nodeY': y}
            }
            return $http(req).then(function(response){
                return response.data;
            });
         }

         function searchCollisionNetwork(x, y) {
            var req = {
                method: 'POST',
                url: '/search-collision',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {'nodeX': x, 'nodeY': y}
            }
            return $http(req).then(function(response){
                return response.data;
            });
         }

         function getNetworks() {
             return $http.get("/networks");
         }
    }
})();