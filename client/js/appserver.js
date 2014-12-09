var appserver = angular.module('appserver', ['lbServices']);

appserver.controller(
    'CanteenListCtrl',
    [
        '$scope',
        'Canteen',
        'NewsCategory',
        function ($scope, Canteen, NewsCategory) {
            $scope.canteens = Canteen.find();
            $scope.newsCategories = NewsCategory.find();
        }
    ]
);
