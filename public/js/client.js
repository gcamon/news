(function() {

	angular.module('myApp',["ngResource","ngRoute",'angular-clipboard'])
	.config(['$routeProvider',function($routeProvider){
 		$routeProvider
 		.when("/post/:id",{
 			templateUrl: "/assets/pages/preview-post.html",
 			controller: "previewPostCtrl"
 		})
 	}])
 	.directive("fileModel",["$parse","$rootScope",function($parse,$rootScope){
	  return {
	    restrict: "A",
	    link: function(scope,element,attrs){
	      var model = $parse(attrs.fileModel);
	      var modelSetter = model.assign;
	      var isMultiple = attrs.multiple;

	      element.bind('change', function () {
	          var values = [];
	            
	          angular.forEach(element[0].files, function (item) {              
	            values.push(item);
	          });
	          scope.$apply(function () {
	            if (isMultiple) {
	             
	              modelSetter(scope.$parent, values);
	              $rootScope.sendFile()
	            }
	            
	          });
	      });
	    }
	  }
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
	.factory("localManager",["$window",function($window){
	  return {
	    setValue: function(key, value) {
	      $window.localStorage.setItem(key, JSON.stringify(value));
	    },
	    getValue: function(key) {       
	      return JSON.parse($window.localStorage.getItem(key)); 
	    },
	    removeItem: function(key) {
	      $window.localStorage.removeItem(key);
	    }
	  };
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
	.service("footerNewsService",["$resource",function($resource){
		return $resource("/content/footer-news")
	}])
	.controller("singleNewsCtlr",["$scope","$sce","singleNewsService","categoryNewsService",function($scope,$sce,singleNewsService,categoryNewsService){	     
    //This is the callback function
    $scope.user = {};
    var news = singleNewsService;
    var path = window.location.pathname;
    var spt = path.split('/');
    var id = spt[spt.length - 2];
    var title = spt[spt.length - 1];
    news.get({id: id,title:title},function(data){
    	console.log(data);
    	$scope.news = data;
    	$scope.whatsappShareLink = "https://web.whatsapp.com/send?text=" + data.link;
    	var cat = categoryNewsService;
			cat.get({category:$scope.news.category},function(data){
				$scope.catList = data.category;
			});
    });

    $scope.trustAsHtml = function(string) {
		  return $sce.trustAsHtml(string);
		};

		$scope.postComment = function(_id){
			var sendObj = {
				id: _id,
				name: $scope.user.name,
				message: $scope.user.message,
				date: + new Date()
			}

			news.comment(sendObj,function(res){				
				$scope.news.comments.push(res);			
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
	.controller("getTypeCtrl",["$scope",function($scope){
		$scope.getType = function(type){
			$scope.pageType = type;
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
	.service("reviewPostService",["$resource",function($resource){
		return $resource("/content/unverified",null,{updatePost:{method:"PUT"}})
	}])
	.controller("reviewPostCtrl",["$scope","$rootScope","$location","reviewPostService","localManager",
		function($scope,$rootScope,$location,reviewPostService,localManager){
			var post = reviewPostService;
			$scope.loading = true;
			post.query({type:"unverified"},function(result){
				$scope.loading = false;
				$rootScope.posts = result;
			})

			$scope.viewPost = function(id){
				$rootScope.postId = id;
				var path = "/post/" + id;
				var elemPos = $rootScope.posts.map(function(x){return x.id}).indexOf($rootScope.postId);
				if($rootScope.posts[elemPos]){
					$rootScope.preview = $rootScope.posts[elemPos];
					localManager.setValue("newsItem",$rootScope.posts[elemPos]);
				} else {
					$rootScope.preview = {};
				}
				$location.path(path);
			}
	}])
	.controller("previewPostCtrl",["$scope","$sce","$rootScope","reviewPostService","localManager",
		function($scope,$sce,$rootScope,reviewPostService,localManager){
			var post = reviewPostService;		
			
			$scope.preview = $rootScope.preview || localManager.getValue("newsItem");


			$scope.getBody = function(body){
				return $sce.trustAsHtml(body);
			}

			$scope.publish = function(id,item){
				var decide = confirm("Do you want to publish this article for public view?");
				if(decide) {
					var reqObj = {};
					reqObj.status = "complete";
					reqObj.pubDate = new Date();
					reqObj.id = id;
					item.loading = true;
					post.updatePost(reqObj,function(res){
						alert(res.message);
						item.loading = false;
						if(res.status){
							var el = $rootScope.posts.map(function(x){return x.id}).indexOf(id);
							if(el !== -1){
								$rootScope.posts.splice(el,1);
								localManager.setValue("newsItem",$rootScope.posts)
							}

							$scope.preview = null;
						}
					})
				} 
			}

			$scope.delete = function(id,item){
				var decide = confirm("Do you want to delete this article?");
				if(decide){
					var reqObj = {}
					reqObj.id = id;
					item.loading2 = true;
					post.delete(reqObj,function(res){
						alert(res.message);
						item.loading2 = false;
						if(res.status){
							var el = $rootScope.posts.map(function(x){return x.id}).indexOf(id);
							if(el !== -1){
								$rootScope.posts.splice(el,1);
								localManager.setValue("newsItem",$rootScope.posts);
							}

							$scope.preview = null;
						}
					})
				}
			}

			$scope.edit = function(post){
				localManager.setValue("post",post);
				window.location.href = "/auth/summernote/edit";
			}
			
	}])
	.service("adminManageService",["$resource",function($resource){
		return $resource("/content/verified")
	}])
	.controller("adminManageCtrl",["$scope","adminManageService","localManager",function($scope,adminManageService,localManager){
		var news = adminManageService;
		localManager.removeItem("newsItem");
		localManager.removeItem("post");
		$scope.loading = true
		news.query(function(data){
			$scope.loading = false;
			$scope.list = data;
		});

		$scope.delPost = function(postId) {
			var check = confirm("Post will be deleted completely and no one will ever view the post again. Are you sure you want to delete this post?")
			if(check) {
				news.delete({id: postId},function(response){
					if(response.status){
						var elemPos = $scope.list.map(function(x){return x._id}).indexOf(postId);
						if($scope.list[elemPos]){
							$scope.list.splice(elemPos,1);
						}
					}
					alert(response.message)
				});
			} 
		}

		$scope.edit = function(post){
			localManager.setValue("post",post);
			window.location.href = "/auth/summernote/edit";
		}

	}])
	.service("mediaService",["$resource",function($resource){
		return $resource("/content/all-media");
	}])
	.controller("multiMediaCtrl",["$scope","$location","$rootScope","mediaService",function($scope,$location,$rootScope,mediaService){
		mediaService.query({type:"images"},function(data){
			$scope.images = data || [];
		})

		$scope.supported = false;

	  $scope.copy = "";

	  $scope.success = function (item) {
	    item.copy =  "Image link copied!";
	    $timeout(function(){
	      item.copy = "";
	    },2000)
	  };


		$rootScope.sendFile = function(){
			console.log($scope.files)
			var fd = new FormData();
	  
		    /*for(var key in data){
		      if(key !== "symptoms" && data.hasOwnProperty(key))
		        fd.append(key,data[key]);
		    };*/

		    /*for(var i = 0; i < data.symptoms.length; i++){
		      if(data.symptoms[i].name)
		        fd.append("symptoms", data.symptoms[i].name);
		    }*/

		    
		    /*if($scope.blobs && $scope.files) {
		     var files = $scope.files.concat($scope.blobs);
		    } else if($scope.blobs) {
		     var files = $scope.blobs;
		    } else if($scope.files) {
		     var files = $scope.files;
		    }*/

		  var files = $scope.files;

	    if(files){
	      if(files.length < 10){
	        for(var key in files){
	        	console.log(files[key].name)
	          if(files[key].size <= 8388608 && files.hasOwnProperty(key)) {    
	            fd.append(files[key].name,files[key]);          
	          } else {
	            alert("Error: Complain NOT sent! Reason: One of the file size is greater than 8mb");
	            return;
	          }
	        };
	        sizeOk();
	      } else {
	        alert("Error: Complain NOT sent! Reason: You can't upload more than 10 files at once.");
	      }

	    }

	    function sizeOk(){    
	      var xhr = new XMLHttpRequest()
	      xhr.upload.addEventListener("progress", uploadProgress, false);
	      xhr.addEventListener("load", uploadComplete, false);
	      xhr.addEventListener("error", uploadFailed, false);
	      xhr.addEventListener("abort", uploadCanceled, false);
	     
	      xhr.open("POST", "/auth/media-files");
	      xhr.send(fd);
	      $scope.progressVisible = false;
	      //player.srcObject.getVideoTracks().forEach(function(track) { track.stop()});
	    }
		  


		  function uploadProgress(evt) {
	      $scope.progressVisible = true;
	      $scope.$apply(function(){
	          if (evt.lengthComputable) {
	             console.log(evt.loaded + " : " + evt.total)
	              $scope.progress = Math.round(evt.loaded * 100 / evt.total)
	              if($scope.progress === 100) {
	                $scope.statusMsg = "Your complaint has been queued in PWR successfully! Doctors will respond soon.";
	              }
	              
	          } else {
	              $scope.progress = 'unable to compute';
	          }
	      })
		  }


		  function uploadComplete(evt) {       
		     $scope.$apply(function(){
		      var newImgList = JSON.parse(evt.target.responseText);
		      $scope.progress = null;
		      $scope.uploadMsg = "Upload completed!";
		      $scope.images = $scope.images.concat(newImgList);
		      console.log(newImgList)
		    })
		       
		  }

		  function uploadFailed(evt) {
		    alert("There was an error attempting to upload the file.");
		  }

		  function uploadCanceled(evt) {
		    $scope.$apply(function(){
		      $scope.progressVisible = false
		    })
		    alert("The upload has been canceled by the user or the browser dropped the connection.")
		  }
		}

	}])
	.controller("footerNewsCtrl",["$scope","footerNewsService",function($scope,footerNewsService){
		footerNewsService.query({type:"few"},function(data){
			console.log(data)
			$scope.footNews = data;
		})
	}])
	.controller("feedsCtlr",["$scope","DataSource","feedsFactory",function($scope,DataSource,feedsFactory){	     
    $scope.dataSet = {};
    $scope.saharaFeeds = feedsFactory.sahara;
    var setData = function(type,data) {
    	console.log(data)      
      $scope.dataSet[type] = data;
    }

    $scope.saharaFeeds.forEach(function(item){
    	DataSource.get(item.url,item.type,setData);
    })	
	}])

})()