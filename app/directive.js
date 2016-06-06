app.directive('onlyNumbers', function() {
	return function(scope, element, attrs){
		var keyCode = [8,9,13,37,39,46,48,49,50,51,52,53,54,55,56,57,96,97,98,99,100,101,102,103,104,105,110,190,116];
		element.css('text-align', 'right');
		element.bind("keydown", function(event){
			if($.inArray(event.which,keyCode) == -1) {
				scope.$apply(function(){
					scope.$eval(attrs.onlyNum);
					event.preventDefault();
				});
				event.preventDefault();
			}

		});
	};
});

app.directive('numbersOnly',function(){
  return {
     require: 'ngModel',
     link: function(scope, element, attrs, modelCtrl) {
       modelCtrl.$parsers.push(function (inputValue) {
           // this next if is necessary for when using ng-required on your input. 
           // In such cases, when a letter is typed first, this parser will be called
           // again, and the 2nd time, the value will be undefined
           if (inputValue == undefined) return '' 
           var transformedInput = inputValue.replace(/[^0-9-.]/g, ''); 
           if (transformedInput!=inputValue) {
              modelCtrl.$setViewValue(transformedInput);
              modelCtrl.$render();
           }         
           return transformedInput;         
       });
     }
   };
});

app.directive('ngReallyClick', [function() {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			element.bind('click', function() {
				var message = attrs.ngReallyMessage;
				if (message && confirm(message)) {
					scope.$apply(attrs.ngReallyClick);
				}
			});
		}
	}
}]);

app.directive('ngFocus', function($timeout) {
    return {
        link: function ( scope, element, attrs ) {
            scope.$watch( attrs.ngFocus, function ( val ) {
                if ( angular.isDefined( val ) && val ) {
                    $timeout( function () {
                     element[0].focus(); 
                     if(element[0].type=='text'){
                         element[0].select();
                     }
                   } );
                }
            }, true);
            
            element.bind('blur', function () {
                if ( angular.isDefined( attrs.ngFocusLost ) ) {
                    scope.$apply( attrs.ngFocusLost );
                }
            });
        }
    };
});

app.filter('datetime',function(){
  return function(input){
    var result=moment(input,"YYYY-MM-DD HH:mm:ss").format("DD/MM/YYYY - hh:mm a");
    return result;
  }
});

app.filter('timeformat',function(){
  return function(input){
    var result=moment(input,"YYYY-MM-DD HH:mm:ss").format("hh:mm a");
    return result;
  }
});


app.filter('datetimeformat',function(){
  return function(input){
    var result=moment(input,"YYYY-MM-DD").format("DD/MM/YYYY");
    return result;
  }
});

app.filter('datesearchformat',function(){
  return function(input){
    var result=moment(input,"DD/MM/YYYY").format("MMM DD YYYY");
    return result;
  }
});

// app.directive("starRating", function() {
//   return {
//     restrict : "EA",
//     template : "<ul class='rating' ng-class='{readonly: readonly}'>" +
//                "  <li ng-repeat='star in stars' ng-class='star' ng-click='toggle($index)'>" +
//                "    <i class='fa fa-star'></i>" + //&#9733
//                "  </li>" +
//                "</ul>",
//     scope : {
//       ratingValue : "=ngModel",
//       max : "=?", //optional: default is 5
//       onRatingSelected : "&?",
//       readonly: "=?"
//     },
//     link : function(scope, elem, attrs) {
//       if (scope.max == undefined) { scope.max = 5; }
//       function updateStars() {
//         scope.stars = [];
//         for (var i = 0; i < scope.max; i++) {
//           scope.stars.push({
//             filled : (i < scope.ratingValue.rating)
//           });
//         }
//       };
//       scope.toggle = function(index) {
//         if (scope.readonly == undefined || scope.readonly == false){
//           scope.ratingValue.rating = index + 1;
//           scope.onRatingSelected({
//             rating: index + 1
//           });
//         }
//       };
//       scope.$watch("ratingValue.rating", function(oldVal, newVal) {
//         if (newVal) { updateStars(); }
//       });
//     }
//   };  
// })
app.directive("averageStarRating", function() {
  return {
    restrict : "EA",
    template : "<div class='average-rating-container'>" +
               "  <ul class='rating background' class='readonly'>" +
               "    <li ng-repeat='star in stars' class='star'>" +
               "      <i class='fa fa-star'></i>" + //&#9733
               "    </li>" +
               "  </ul>" +
               "  <ul class='rating foreground' class='readonly' style='width:{{filledInStarsContainerWidth}}%'>" +
               "    <li ng-repeat='star in stars' class='star filled'>" +
               "      <i class='fa fa-star'></i>" + //&#9733
               "    </li>" +
               "  </ul>" +
               "</div>",
    scope : {
      averageRatingValue : "=ngModel",
      max : "=?", //optional: default is 5
    },
    link : function(scope, elem, attrs) {
      if (scope.max == undefined) { scope.max = 5; }
      function updateStars() {
        scope.stars = [];
        for (var i = 0; i < scope.max; i++) {
          scope.stars.push({});
        }
        var starContainerMaxWidth = 100; //%
        scope.filledInStarsContainerWidth = scope.averageRatingValue / scope.max * starContainerMaxWidth;
      };
      scope.$watch("averageRatingValue", function(oldVal, newVal) {
        if (newVal) { updateStars(); }
      });
    }
  };
});


app.filter('dobformat',function(){
  return function(dateString) {
    var now = new Date();
    var today = new Date(now.getYear(),now.getMonth(),now.getDate());

    var yearNow = now.getYear();
    var monthNow = now.getMonth();
    var dateNow = now.getDate();

    var dob = new Date(dateString);

    var yearDob = dob.getYear();
    var monthDob = dob.getMonth();
    var dateDob = dob.getDate();
    var age = {};
    var ageString = "";
    var yearString = "";
    var monthString = "";
    var dayString = "";


    yearAge = yearNow - yearDob;

    if (monthNow >= monthDob)
      var monthAge = monthNow - monthDob;
    else {
      yearAge--;
      var monthAge = 12 + monthNow -monthDob;
    }

    if (dateNow >= dateDob)
      var dateAge = dateNow - dateDob;
    else {
      monthAge--;
      var dateAge = 31 + dateNow - dateDob;

      if (monthAge < 0) {
        monthAge = 11;
        yearAge--;
      }
    }

    age = {
        years: yearAge,
        months: monthAge,
        days: dateAge
        };

    if ( age.years > 1 ) yearString = " years";
    else yearString = " year";
    if ( age.months> 1 ) monthString = " months";
    else monthString = " month";
    if ( age.days > 1 ) dayString = " days";
    else dayString = " day";


    if ( (age.years > 0) && (age.months > 0) && (age.days > 0) )
      ageString = age.years + yearString + ", " + age.months + monthString + ", and " + age.days + dayString + " old.";
    else if ( (age.years == 0) && (age.months == 0) && (age.days > 0) )
      ageString = "Only " + age.days + dayString + " old!";
    else if ( (age.years > 0) && (age.months == 0) && (age.days == 0) )
      ageString = age.years + yearString + " old. Happy Birthday!!";
    else if ( (age.years > 0) && (age.months > 0) && (age.days == 0) )
      ageString = age.years + yearString + " and " + age.months + monthString + " old.";
    else if ( (age.years == 0) && (age.months > 0) && (age.days > 0) )
      ageString = age.months + monthString + " and " + age.days + dayString + " old.";
    else if ( (age.years > 0) && (age.months == 0) && (age.days > 0) )
      ageString = age.years + yearString + " and " + age.days + dayString + " old.";
    else if ( (age.years == 0) && (age.months > 0) && (age.days == 0) )
      ageString = age.months + monthString + " old.";
    else ageString = "Oops! Could not calculate age!";

    return ageString;
  }
});