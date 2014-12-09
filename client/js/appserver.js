var appserver = angular.module('appserver', ['lbServices']);

appserver.controller('CanteenListCtrl', function ($scope, Canteen) {
    $scope.canteens = Canteen.find();
});
