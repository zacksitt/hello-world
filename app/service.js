app.service('sidebarSvc', function($location){

	this.sidebarList = [];

	this.getSidebarList = function(){
		var self = this;
		var url = $location.url();
		var splitURL = url.split("/");
		var respond = [];
		switch(splitURL[1]){
			case "home":
				respond.push(['Home', 'header']);
				respond.push(['home', 'home']);
				self.sidebarList = respond;
				return respond;
			break;

			case "user-list":
			case "user-group-list":
				respond.push(['User Managment', 'header']);
				respond.push(['User List', 'user-list']);	
				respond.push(['User Group List', 'user-group-list']);
				self.sidebarList = respond;
				return respond;
			break;

			case "city-list":
			case "township-list":
				respond.push(['App Settings', 'header']);
				respond.push(['City List', 'city-list']);
				respond.push(['Township List', 'township-list']);	
				self.sidebarList = respond;
				return respond;
			break;

			case "report":
			case "vehicle-report":
				respond.push(['Report', 'header']);
				respond.push(['Report', 'report']);
				respond.push(['Vehicle Report', 'vehicle-report']);
				self.sidebarList = respond;
				return respond;
			break;

			default:
			break;
		}
	}
});