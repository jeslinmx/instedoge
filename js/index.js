var doge = angular.module('doge', []);
doge.controller('dogeCtrl', function ($scope) {
	$scope.processedBase64 = {};
	$scope.authURL = "https://instagram.com/oauth/authorize/?client_id=094f2d8619bf430b97b396844c9fe5c4&redirect_uri=http://rawgithub.com/jeslinmx/instedoge/master/index.html&response_type=token";
	$scope.getAuth = function() {
		var urlArray = window.location.href.split("#");
		if (urlArray.length > 1) {
			$scope.accessToken = urlArray[urlArray.length - 1];
			localStorage["accessToken"] = $scope.accessToken;
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
		$.ajax({
			url: "https://api.instagram.com/v1/users/self/feed",
			data: {access_token: $scope.access_token},
			type: "GET",
			dataType: "jsonp"
		}).done(function(d, s, j) {
			$scope.data = d.data;
		}).fail(function(s, j, e) {
			if (j.statusCode() == 400) window.location.href = $scope.authURL;
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
			}).fail(function(s, j, e) {
				$scope.processedBase64[x] = "error.png";
				$scope.$apply();
				console.log("very " + e);
			});
		}).fail(function(s, j, e) {
			$scope.processedBase64[x] = "error.png";
			$scope.$apply();
			console.log("very " + e);
		});;
	}

	// for (var x in $scope.data) {
	// 	if ($scope.data[x].type == "image") {
	// 		if ($scope.data[x].caption === null) $scope.data[x].caption = {text:""};
	// 		$scope.getBase64($scope.data[x].images.standard_resolution.url, $scope.data[x].caption.text, x).done(function(d,s,j){
	// 			generateMeme(d.base64, $scope.data[d.x].caption.text).done(function(meme) {
	// 				$scope.processedBase64[d.x] = meme;
	// 				$scope.$apply();
	// 			});
	// 		});
	// 	}
	// }
})