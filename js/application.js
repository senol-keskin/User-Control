
	var 
		xhr = new XMLHttpRequest(),
		userApi,
		whiteSpaceReg = /\s/g
	;

	xhr.open("GET", "/user-api/user.json", true);
	xhr.onreadystatechange = function () {
		if (this.readyState === 4) {
			if (this.status >= 200 && this.status < 400) {
				userApi = JSON.parse(this.responseText);
			} else{
				alert("Something went wrong! Check your internet connection...");
			};
		};
	};

	xhr.send();
	xhr = null;


	var mainApp = angular.module("admin", ["ngRoute", "user-controller"]);

	mainApp.config(["$routeProvider", function ($routeProvider) {
	
			$routeProvider
				.when("/UsersPanel",
					{
						controller: "PanelController",
						templateUrl: "Views/main.html"
					}
				)
				.otherwise({
					redirectTo: "/UsersPanel"
				})
			;
		
	}]);

	var admin = angular.module("user-controller", []);

	admin.controller("PanelController", function(){
		this.tab = 1;
		this.setTab = function (val){
			this.tab = val;
		};
		this.isTab = function (val) {
			return this.tab === val;
		};
	});


	/* Creat a New User */
	admin.directive("createUser", function(){
		return {
			restrict: "E",
			templateUrl: "Views/create-user.html",
			controller: function () {
				this.newUser = {};

				this.groupsName = userApi.groups;

				this.createUser = function () {
					this.newUser["id"] = this.newUser.name.replace(whiteSpaceReg, "");
					userApi.users.push(this.newUser);
					this.newUser = {};
				};
			},
			controllerAs: "registerUser"
		};
	});

	/* Creat a New Group */
	admin.directive("createGroup", function(){
		return {
			restrict: "E",
			templateUrl: "Views/create-group.html",
			controller: function () {
				this.newGroup = {};
				this.createGroup = function () {
					userApi.groups.push(this.newGroup);
					this.newGroup = {};
				};
			},
			controllerAs: "registerGroup"
		};
	});

	/* List and Edit created users */
	admin.directive("createdUsers", function () {
		return {
			restrict: "E",
			templateUrl: "Views/created-users.html",
			controller: function () {

				this.getUsers = userApi.users;
				this.getGroups = userApi.groups;

				this.hasGroup = function (group) {
					return group === undefined;
				};

				this.deleteUser = function (user, userName) {
					var confirm = window.confirm(userName + " is going to be deleted. Are you sure?");
					if(confirm)
						userApi.users.splice(user, 1);
				};
			},
			controllerAs: "users"
		};
	});

	/* List and edit created groups */
	admin.directive("createdGroups", function () {
		return {
			restrict: "E",
			templateUrl: "Views/created-groups.html",
			controller: function () {
				this.getGroups = userApi.groups;
				this.deleteGroup = function (index, groupName) {

					var isUsing;

					
					for (var i = 0; i < userApi.users.length; i++) {

						if ( typeof userApi.users[i].group !== "undefined" && userApi.users[i].group !== null ) {	
							if(userApi.users[i].group.name === groupName){
								alert("This group can not be deleted. Because some users need it.");
								isUsing = true;
								break;
							}
						}
					};


					var confirm = !isUsing && window.confirm(groupName + " is going to be deleted. Are you sure?");
					if(confirm)
						userApi.groups.splice(index, 1);
				}
			},
			controllerAs: "groups"
		};
	});












