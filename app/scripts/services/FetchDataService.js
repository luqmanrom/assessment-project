'use strict';

angular.module('falconCodeChallengeApp')
    .factory('FetchDataService', function($http, $rootScope, lodash, $timeout) {
        var url = 'http://localhost:9000/v1/'
        var func = {};

        var flushServer = function() {
            var promise = $http({
                method: 'GET',
                url: url + 'flush',
            }).then(function successCallback(response) {
                return response.data;
            });

            return promise;
        };


        var updateLocalData = function(newShop) {
        	var index = lodash.findIndex($rootScope.shops, function(oldShop) {
        		return oldShop.name == newShop.name;
        	})

        	if (index > 0) {
        		$rootScope.shops[index] = newShop;
        	} else {
        		$rootScope.shops.push(newShop);
        	}
        }

        func.getShop = function() {
            var promise = $http({
                method: 'GET',
                url: url + 'shops'
            }).then(function successCallback(response) {
                return response.data;
            }, function errorCallback(err) {
                console.log(err);
            });

            return promise;
        };

        // PATCH
        func.editShop = function(shop) {
            var promise = $http({
                method: 'PATCH',
                url: url + 'shop/' + shop._id,
                data: shop
            }).then(function successCallback(response) {
                // Sync with the rootscope
                //
                var index = lodash.findIndex($rootScope.shop, function(obj) {
                    return obj._id == shop._id;
                });

                if (index > 0) {
                    $rootScope[index] = shop;
                }

                console.log(response.data);
                return response.data;

            })
            return promise;
        };

        // DELETE
        func.deleteShop = function(shopId) {
            console.log(shopId);
            var promise = $http({
                method: 'DELETE',
                url: url + 'shop/' + shopId
            }).then(function successCallback(response) {
                $timeout(function() {
                    lodash.remove($rootScope.shops, function(obj) {
                        return obj._id == shopId;
                    })
                    return response.data;
                })

            });

            return promise;

        };

        // POST
        func.addShop = function(shop) {
            console.log(shop);
            var promise = $http({
                method: 'POST',
                url: url + 'shop',
                data: shop
            }).then(function successCallback(response) {
                //console.log(response.data)
                $timeout(function() {
                    $rootScope.shops.push(response.data);
                });
                return response.data;

            });

            return promise;
        }


        func.sync = function(shops, flush) {
            // Send each data to the server and pass callback to update the rootScope
            if (flush == true) {
                // Ask server to flush
                console.log('Flush == true');
                flushServer().then(function(d) {
                	$rootScope.shops = [];
                    shops.forEach(function(element) {
                        $http({
                            method: 'POST',
                            url: url + 'shop/sync',
                            data: element
                        }).then(function successCallback(response) {
                        	console.log(response.data);
                        	updateLocalData(response.data);
                        })
                    })
                })
            } else {
                shops.forEach(function(element) {
                    console.log(element);
                    $http({
                        method: 'POST',
                        url: url + 'shop/sync',
                        data: element
                    }).then(function successCallback(response) {
                    	updateLocalData(response.data)
                    })
                })

            }

        };

        return func;
    });
