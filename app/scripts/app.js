'use strict';

/**
 * @ngdoc overview
 * @name falconCodeChallengeApp
 * @description
 * # falconCodeChallengeApp
 *
 * Main module of the application.
 */
angular
    .module('falconCodeChallengeApp', [
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngCsv',
        'ui.bootstrap',
        'ngLodash',
        'ngCsvImport'
    ])
    .run(function($rootScope, FetchDataService) {
        // Get all the shops and attach it with rootScope
        FetchDataService.getShop().then(function(d) {
            if (!d) {
                $rootScope.shops = [];
            } else {
                $rootScope.shops = d;
                console.log(d);
            }

        });
    })
    .config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl',
                controllerAs: 'main',

            })
            .otherwise({
                redirectTo: '/'
            });
    });
