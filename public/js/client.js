(function() {

	angular.module('myApp',[])
	.config(["$httpProvider",function($httpProvider){
		$httpProvider.defaults.headers.get = { "Access-Control-Allow-Origin" : '*' }
	}])
	.factory('DataSource', ['$http',function($http){
		var resource;
		var url2 =  window.location.href + "feeds";
	  return {
	    get: function(url,type,callback){
	    	resource = url2 + '?url=' + url  ;
	      $http.get(
	          resource,
	          {transformResponse:function(data) {
	            // convert the data to JSON and provide
	            // it to the success function below            	
              var x2js = new X2JS();              
              var json = x2js.xml_str2json(data);
              return json;
            },
            headers: {"Content-Type":undefined}
	        }
	      )
	      .then(successCallback,errorCallback)
	      

	      function errorCallback(err) {
	      	console.log(err)
	      }

	      function successCallback(data) {
	      	//console.log(data)
	      	callback(type,data)
	      }
	    }
	  }

	   function genHash() {
	    var text = "";
	    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234567899966600555777222";

	      for( var i=0; i < 12; i++ )
	          text += possible.charAt(Math.floor(Math.random() * possible.length));
	      return text;
	  }
	}])
	.factory('feedsFactory',[function(){
		var feeds = {}
		feeds.sahara = [
			{
			 url : "http://saharareporters.com/feeds/news/feed",
			 type: "news"
			},			
			{
			 url : "http://saharareporters.com/feeds/politics/feed",
			 type: "politics"
			},
			{
			 url : "http://saharareporters.com/feeds/business/feed",
			 type: "business"
			},
			{
			 url : "http://saharareporters.com/feeds/sports/feed",
			 type: "sports"
			},
			{
			 url : "http://saharareporters.com/feeds/entertainment/feed",
			 type: "entertainment"
			},
			{
			 url : "http://saharareporters.com/feeds/lifestyle/feed",
			 type: "lifestyle"
			},
			{
			 url : "http://saharareporters.com/feeds/technology/feed",
			 type: "technology"
			}
			/*
			{
			 url : "http://saharareporters.com/feeds/reports/feed",
			 type: "reports"
			},		
			{
			 url : "http://saharareporters.com/feeds/opinion/feed",
			 type: "opinion"
			}*/
			/*"http://saharareporters.com/feeds/news/feed",
			"http://saharareporters.com/feeds/opinion/feed",
			"http://saharareporters.com/feeds/politics/feed",
			"http://saharareporters.com/feeds/business/feed",
			"http://saharareporters.com/feeds/sports/feed",
			"http://saharareporters.com/feeds/entertainment/feed",
			"http://saharareporters.com/feeds/lifestyle/feed",
			"http://saharareporters.com/feeds/technology/feed"*/
		]

		return feeds;
	}])
	.controller("feedsCtlr",["$scope","DataSource","feedsFactory",function($scope,DataSource,feedsFactory){	     
    //This is the callback function
    $scope.dataSet = {};
    $scope.saharaFeeds = feedsFactory.sahara;
    setData = function(type,data) {
    	console.log(data)      
      $scope.dataSet[type] = data;
    }
   
    $scope.saharaFeeds.forEach(function(item){
    	DataSource.get(item.url,item.type,setData);
    })
	
	}])



})()