
angular.module('appModule.controller',[])
    .controller('homeCtrl',function ($scope) {
        $scope.hello = '豆瓣是我在北京最喜欢的书店。这是我毕业返校最后一次去豆瓣时拍的，在豆瓣没有拍过几张照片，拍照技术也有待加强。照片看起来比较暗，不过店内光线看书是肯定足够的。豆瓣很小很温馨，新书旧书混在一起卖，旧书低至六折。豆瓣的书也都基本是人文社科类，在豆瓣我能一个一个书架一本一本书扫过去，不用漏掉任何一本书。豆瓣的店员就坐那儿看书、轻轻地聊天，友好亲切。总之是一个没什么别的花样、安安静静卖好书、像家一样的书店。另：豆瓣自家的书签是我去过书店当中最好看的:-D去豆瓣在北大东门地铁站下或公交车蓝旗营站，蓝旗营，这名字多好听'
    })
    .controller('addCtrl',function ($scope,Book,$location) {
        $scope.add = function () {

            Book.save($scope.book).$promise.then(function () {
                $location.path('/list');
            });
        }
    })
    .controller('listCtrl',function ($scope,Book) {
        $scope.books = Book.query();
    })
    .controller('detailCtrl',function ($scope,$routeParams,Book,$location) {

        var id = $routeParams.bid;

        $scope.book = Book.get({bid:id});


        $scope.remove = function () {
            Book.delete({bid:id}).$promise.then(function () {
                $location.path('/list');
            });
        };


        $scope.flag = true;
        $scope.changeFlag = function () {

            $scope.temp = JSON.parse(JSON.stringify($scope.book));
            $scope.flag = false;
        }


        $scope.sure = function () {
            Book.update({bid:id},$scope.temp).$promise.then(function () {

                $scope.flag = true;
                $scope.book = $scope.temp;
            });
        }
    });