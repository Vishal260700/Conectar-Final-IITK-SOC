var app=angular.module('myApp',[]);
app.config(function ($interpolateProvider) {
  $interpolateProvider.startSymbol('[[');
  $interpolateProvider.endSymbol(']]');
});

app.controller('mainController',['$scope','$http',function($scope,$http){
	// var myElement = angular.element( document.querySelector( '#title' ) );
	var username;
	$http.get('/user.json').then(function(res) {
    username=res.data.username;
    run();
});
$scope.friendrequestpanel=false;
$scope.logout=false;
	function run(){
	var socket=io.connect();
	// console.log(#{username});
	socket.emit('get tags',username);	
	socket.on('the tags',function(tags){
		$scope.tags=tags;
		$scope.$apply();
	});
	$scope.friends=[];
	socket.emit('getfriends',username);
	socket.on('the friends',function(friends){
		$scope.friends=friends;
		$scope.$apply();
	});
	$scope.requests=[];
	socket.emit('available friend request',username);
	socket.on('got new friend requests',function(friend,tag){
		console.log("YO");
		$scope.requests.push({username:friend,tag:tag});
		$scope.$apply();
	});
	socket.on('my friend request',function(friend,tag){
		$scope.requests.push([{friend,tag}]);
		$scope.$apply();
	});
	socket.on('searched people',function(people){
		$scope.people.push(people);
		$scope.$apply();
	});
	$scope.addtag=function(tag){
		socket.emit('tag',username,tag,0);
	};
	$scope.search=function(){
		tag=$scope.searchtext;
		console.log(tag);
		$scope.people=[];
		socket.emit('search for people',tag,username);
		
	};
	$scope.sendfriendrequest=function(friend,tag){
	 // var tag = angular.element( document.querySelector( '#Searchfor' ) ).value;
		
		console.log("Sent request to "+friend);
		console.log(tag);
		socket.emit('friend request',username,friend,tag);
	};
	$scope.addfriend=function(friend){
		socket.emit('add to friends',username,friend);
		$scope.friends.push(friend);
		console.log($scope.friends);
		$scope.$apply();

	};
}
}]);