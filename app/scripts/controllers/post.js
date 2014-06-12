'use strict';

angular.module('tgallantgithubioApp')
.controller('PostCtrl', function ($scope, $routeParams) {
	$scope.getMarkDown = function () {
		var post = "md/"+$routeParams.post+".md";
		return post;
	};
});
