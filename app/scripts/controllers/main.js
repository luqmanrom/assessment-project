'use strict';

/**
 * @ngdoc function
 * @name falconCodeChallengeApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the falconCodeChallengeApp
 */
angular.module('falconCodeChallengeApp')
    .controller('MainCtrl', function($scope, FetchDataService, $uibModal, $log, $rootScope) {
        var vm = this;

        vm.shops = $rootScope.shops;

        $scope.csv = {
            content: null,
            header: true,
            headerVisible: false,
            separator: ',',
            separatorVisible: true,
            result: null,

        };


        vm.trim = function(arr) {
        	arr.forEach(function(el) {
        		delete el['__v'];
        		delete el['_id']
        	})

        	return arr;
        };

        vm.import = function(shops) {
            delete shops['filename'];
            console.log($scope.csv.flush);
            console.log(shops);
            FetchDataService.sync(shops,$scope.csv.flush);
        }

        vm.getshops = function() {
            FetchDataService.getShop().then(function(d) {
                vm.shops = d;
                // console.log(d);
            })
        };

        vm.editShop = function(shop) {
            // FetchDataService.editShop();
        }

        vm.removeShop = function(id) {
            FetchDataService.deleteShop(id).then(function(d) {
                console.log(d);
            })
        };

        // vm.addShop({
        //     name: 'Jusco',
        //     floor: 'LG',
        //     lot: '28-C'
        // })

        vm.modalAddShop = function() {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'addNewShopModal.html',
                controller: 'addNewShopModalCtrl'

            });

            modalInstance.result.then(function(selectedItem) {}, function() {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }

        vm.modalEditShop = function(index) {
            var modalInstance = $uibModal.open({
                templateUrl: 'editShopModal.html',
                controller: 'editShopModalCtrl',
                resolve: {
                    shop: function() {
                        return $rootScope.shops[index];
                    }
                }
            });

            modalInstance.result.then(function(selectedItem) {}, function() {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };


        vm.submit = function(element) {
            console.log(element.files)

        }

    });



angular.module('falconCodeChallengeApp')
    .controller('editShopModalCtrl', function($scope, $modalInstance, shop, FetchDataService) {
        $scope.editShop = shop; // For some reason, this sync with the parent scope

        var ok = function() {
            $modalInstance.dismiss('cancel');
        };

        $scope.edit = function() {
            console.log($scope.editShop);
            FetchDataService.editShop($scope.editShop).then(function() {
                ok();
            })
        }
    });


angular.module('falconCodeChallengeApp')
    .controller('addNewShopModalCtrl', function($scope, $modalInstance, FetchDataService) {
        $scope.newShop = {};

        var ok = function() {
            $modalInstance.dismiss('cancel');
        };

        $scope.addShop = function(shop) {
            FetchDataService.addShop($scope.newShop).then(function() {
                ok();
            })
        };



    });
