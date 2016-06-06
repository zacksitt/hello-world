app.factory('loadData',function($http){
	return function(apiurl,action,data){
		return $http({
			method:'POST',
			url:BASE_URL+apiurl+"/"+action,
			data:data,
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		})
	}
});