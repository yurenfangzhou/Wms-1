﻿angular.module('ngTygaSoft.services.Pandian', [])

.factory('$tygasoftPandian', function ($http, $timeout, $ionicModal, $ionicPopup, $ionicLoading, $ionicActionSheet, $cordovaToast, $tygasoftDbHelper, $tygasoftCommon, $tygasoftMC, $tygasoftLogin) {

    var ts = {};

    ts.Bind = function ($scope) {
        $scope.$on('$ionicView.enter', function (e) {
            ts.GetPandianList($scope, $tygasoftCommon.PageIndex, $tygasoftCommon.PageSize);
        });
    };

    ts.GetPandianList = function ($scope, pageIndex, pageSize) {
        try {
            var url = "" + $tygasoftCommon.ServerUrl() + "/Services/PdaService.svc/GetPandianList";
            var sData = '{"model":{"PageIndex":"' + pageIndex + '","PageSize":"' + pageSize + '"}}';

            $ionicLoading.show();
            $http.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
            $http({
                method: 'POST',
                url: url,
                data: sData
            }).then(function (res) {
                $ionicLoading.hide();
                var result = res.data;
                //console.log('GetPandianList--result--' + JSON.stringify(result));
                if (result.ResCode != 1000) {
                    $ionicPopup.alert({ title: $tygasoftMC.MC.Alert_Title, template: result.Msg, okText: $tygasoftMC.MC.Btn_OkText });
                    return false;
                }
                $scope.ListData = JSON.parse(result.Data);

            }, function (err) {
                $ionicLoading.hide();
                alert($tygasoftMC.MC.Http_Err);
            });
        }
        catch (e) {
            $ionicLoading.hide();
            alert($tygasoftMC.MC.Http_Err);
        }
    };

    ts.GetPandianProductList = function ($scope, pageIndex, pageSize, Id) {
        $ionicLoading.show();
        var url = "" + $tygasoftCommon.ServerUrl() + "/Services/PdaService.svc/GetPandianProductList";
        var sData = '{"model":{"PageIndex":"' + pageIndex + '","PageSize":"' + pageSize + '","ParentId":"' + Id + '"}}';
        $http.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
        $http({
            method: 'POST',
            url: url,
            data: sData
        }).then(function (res) {
            $ionicLoading.hide();
            var result = res.data;
            //console.log('GetPandianProductList--result--' + JSON.stringify(result));
            if (result.ResCode != 1000) {
                $ionicPopup.alert({title: $tygasoftMC.MC.Alert_Title,template: result.Msg,okText: $tygasoftMC.MC.Btn_OkText});
                return false;
            }
            $scope.PandianProductData = JSON.parse(result.Data);

        }, function (err) {
            $ionicLoading.hide();
            alert($tygasoftMC.MC.Http_Err);
        });
    };

    ts.GetBarcode = function ($scope) {
        var barcode = $scope.ModelData.Barcode;
        if (!barcode || barcode == '') {
            return false;
        }
        $scope.ModelData.Barcode = '';
        var itemInfo = null;
        for (var i = 0; i < $scope.PandianProductData.rows.length; i++) {
            var item = $scope.PandianProductData.rows[i];
            if (item.ProductCode == barcode) {
                itemInfo = item;
                break;
            }
        }
        if (!itemInfo) {
            $ionicPopup.alert({ title: $tygasoftMC.MC.Alert_Title, template: $tygasoftMC.GetString('Params_NotExist', barcode), okText: $tygasoftMC.MC.Btn_OkText });
            return false;
        }

        $scope.toHref(itemInfo);
    };

    return ts;
});