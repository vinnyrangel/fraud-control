'use strict';

angular.module('FraudSystem').config(appRouter);

appRouter.$inject = ['$stateProvider', '$urlRouterProvider'];

function appRouter($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider        
        .state('/',
        {
            url: '/',
            views: {
                'content': {
                    templateUrl: 'templates/main.html',
                    controller: 'MainController as main'
                },
            }
        })
        .state('simulador', 
        {
            url: '/simulador',
            views: {
                'content': {
                    // templateUrl: 'simulador/simulador.html',
                    // controller: 'simuladorController as simulador'
                }
            }
        })        
    };
