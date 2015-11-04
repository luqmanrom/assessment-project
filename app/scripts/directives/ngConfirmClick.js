'use strict';


angular.module('falconCodeChallengeApp')
    .directive('ngConfirmClick', [
        function() {
            return {
                link: function(scope, element, attr) {
                    var msg = "Are you sure?";
                    var clickAction = attr.ngConfirmClick;
                    element.bind('click', function() {
                        if (window.confirm(msg)) {
                            scope.$eval(clickAction);
                        }
                    });
                }
            };
        }
    ]);
