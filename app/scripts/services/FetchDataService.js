angular.module('falconCodeChallengeApp')
    .factory('FetchDataService', function($http, $rootScope, lodash, $timeout) {
        // return $resource('http://localhost:8000/v1/shops');

        var func = {};
        func.getShop = function() {
            var promise = $http({
                method: 'GET',
                url: 'http://localhost:9000/v1/shops'
            }).then(function successCallback(response) {
                return response.data;
            }, function errorCallback(err) {
                console.log(err);
            });

            return promise;
        };

        // UNTESTED
        // PATCH
        func.editShop = function(shop) {
            var promise = $http({
                method: 'PATCH',
                url: 'http://localhost:9000/v1/shop/' + shop._id,
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
                url: 'http://localhost:9000/v1/shop/' + shopId
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
                url: 'http://localhost:9000/v1/shop',
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


        func.sync = function(shops) {
        	// Send each data to the server and pass callback to update the rootScope

        	shops.forEach(function(element) {
        		console.log(element);
        		$http({
        			method: 'POST',
        			url: 'http://localhost:9000/v1/shop/sync',
        			data: element
        		}).then(function successCallback(response) {
        			// Update rootScope with response.data
        			//console.log(response.data);
        		})
        	})


        };

        return func;
    });
