var doge = angular.module('doge', []);
doge.controller('dogeCtrl', function ($scope) {
	$scope.processedBase64 = {};
	// $scope.data = [];
	$scope.authURL = "https://instagram.com/oauth/authorize/?client_id=094f2d8619bf430b97b396844c9fe5c4&redirect_uri=http://rawgithub.com/jeslinmx/instedoge/master/index.html&response_type=token";
	$scope.feedURL = "https://api.instagram.com/v1/users/self/feed"
	$scope.getAuth = function() {
		var urlArray = window.location.href.split("#access_token=");
		if (urlArray.length > 1) {
			$scope.accessToken = urlArray[urlArray.length - 1];
			localStorage["accessToken"] = $scope.accessToken;
			window.location = urlArray[0];
		}
		$scope.accessToken = localStorage["accessToken"];
		if (typeof($scope.accessToken) == "undefined") {
			window.location.href = $scope.authURL;
		}
		else {
			$scope.getMoar();
		}
	}
	$scope.getMoar = function() {
		return $.ajax({
			url: $scope.feedURL,
			data: {access_token: $scope.accessToken},
			type: "GET",
			dataType: "jsonp"
		}).done(function(d, s, j) {
			$scope.data = d.data;
			$scope.$apply();
		}).fail(function(j, s, e) {
			if (j.statusCode() == 400) {
				localStorage.removeItem("accessToken");
				window.location.href = $scope.authURL;
			}
		});
	}
    $scope.convertTimestamp = function(timestamp) {
		return moment.unix(timestamp).calendar();
	}
	$scope.getBase64 = function (src, caption) {
		return $.ajax({
			url: "http://urltobase64.codecla.ws/?",
			data: {url: src},
			dataType: "jsonp"
		});
	};
	$scope.processImage = function (x) {
		if ($scope.processedBase64[x]) return;
		$scope.processedBase64[x] = "loading.gif"
		if ($scope.data[x].caption === null) $scope.data[x].caption = {text:""};
		$scope.getBase64($scope.data[x].images.standard_resolution.url, $scope.data[x].caption.text).done(function(d,s,j){
			generateMeme(d.base64, $scope.data[x].caption.text).done(function(meme) {
				$scope.processedBase64[x] = meme;
				$scope.$apply();
			}).fail(function(j, s, e) {
				$scope.processedBase64[x] = "error.png";
				$scope.$apply();
				console.log("very " + e);
			});
		}).fail(function(j, s, e) {
			$scope.processedBase64[x] = "error.png";
			$scope.$apply();
			console.log("very " + e);
		});;
	}
	$scope.changeFeed = function (url) {
		$scope.data = {};
		$scope.processedBase64 = {};
		$scope.feedURL = url;
		$scope.getMoar();
	}
	$scope.logout = function () {
		localStorage.removeItem("accessToken");
		window.location = window.location.href;
	}

	// $(document.body).scroll(function() {
	// 	if ($(document.body).height() - $(document.body).scrollTop() <= 2000) {
	// 		$scope.getMoar();
	// 	}
	// })
})

// $(function () {
// 	$("nav .btn").tooltip();
// })