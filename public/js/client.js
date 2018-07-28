(function() {

	angular.module('myApp',["ngResource"])
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
	.filter('cut',[function(){
		return function (value, wordwise, max, tail) {
      if (!value) return '';

      max = parseInt(max, 10);
      if (!max) return value;
      if (value.length <= max) return value;

      value = value.substr(0, max);
      if (wordwise) {
          var lastspace = value.lastIndexOf(' ');
          if (lastspace !== -1) {
            //Also remove . and , so its gives a cleaner result.
            if (value.charAt(lastspace-1) === '.' || value.charAt(lastspace-1) === ',') {
              lastspace = lastspace - 1;
            }
            value = value.substr(0, lastspace);
          }
      }

      return value + (tail || ' …');
    };
	}])
	.service('singleNewsService',["$resource",function($resource){
		return $resource("/content/single",null,{comment:{method:"PUT"}})
	}])
	.service('categoryNewsService',["$resource",function($resource){
		return $resource("/content/category")
	}])
	.service('homeNewsService',["$resource",function($resource){
		return $resource("/content/all")
	}])
	.controller("singleNewsCtlr",["$scope","$sce","singleNewsService","categoryNewsService",function($scope,$sce,singleNewsService,categoryNewsService){	     
    //This is the callback function
    $scope.user = {};
    var news = singleNewsService;
    var path = window.location.pathname;
    var spt = path.split('/');
    var id = spt[spt.length - 2];
    var title = spt[spt.length - 1]
    news.get({id: id,title:title},function(data){
    	console.log(data);
    	$scope.news = data;
    });

    $scope.trustAsHtml = function(string) {
		  return $sce.trustAsHtml(string);
		};

		var cat = categoryNewsService
		cat.get({category:"Politics"},function(data){
			$scope.catList = data.category;
		})

		$scope.postComment = function(){
			var sendObj = {
				id: $scope.news._id,
				name: $scope.user.name,
				message: $scope.user.message,
				date: + new Date()
			}

			news.comment(sendObj,function(res){				
				$scope.news.comments.push(res)				
			})
		}
	
	}])
	.controller("categoryCtlr",["$scope","$sce","categoryNewsService",function($scope,$sce,categoryNewsService){
		var cat = categoryNewsService;
		var path = window.location.pathname;
		var spt = path.split('/');
		if(spt.length >= 1) {
			var item = spt[spt.length-1];
			var categoryName = item.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()}); //splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);

			cat.get({category: categoryName},function(data){
				$scope.catList = data.category;
				$scope.stories = data.other;				
				$scope.pageType = categoryName;
			});

			$scope.trustAsHtml = function(string) {
			  return $sce.trustAsHtml(string);
			};
		}

	}])
	.controller("homeCtlr",["$scope","$sce","$filter","homeNewsService",function($scope,$sce,$filter,homeNewsService){	
		homeNewsService.query(function(newsList){	

			var first4 = newsList.slice(0,4) || [{}];
			var second4 = newsList.slice(4,8) || [{}];
			var others = newsList.slice(4);

			$scope.all = newsList || [];			
			$scope.part1 = insertionSort (first4) || [];
			//$scope.part2 = insertionSort (second4) || [];
			$scope.others = others || [];
			console.log($scope.part1)
		})

		$scope.trustAsHtml = function(string) {
		  return $sce.trustAsHtml(string);
		};

		function insertionSort (items) {
		  for (var i = 0; i < items.length; i++) {
		    var value = items[i];
		    // store the current item value so it can be placed right
		    for (var j = i - 1; j > -1 && items[j].views > items[i].views; j--) {
		      // loop through the items in the sorted array (the items from the current to the beginning)
		      // copy each item to the next one
		      items[j + 1] = items[j];
		    }
		    // the last item we've reached should now hold the value of the currently sorted item
		    items[j + 1] = value;
		  }

		  return items || [];
		}

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