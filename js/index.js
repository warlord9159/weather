function Timey() {

	this.now = new Date();
	this.days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	this.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
}

/* get the current day of the month as a numeric value
/
/	@return: 	a number between 1-31 representing the day of the month
*/
Timey.prototype.getDate = function() {

	return this.now.getDate();

}

/*
/	increments the day by one
/
*/
Timey.prototype.forwardDay = function() {

	if ( this.getDate() + 1 > this.daysInCurrentMonth() )
		return this.setMonth(this.getMonth() + 1, this.getDate() + 1);
	else
		this.setDate(this.getDate() + 1);
}

Timey.prototype.backDay = function() {
	if ( this.getDate() - 1 === 0 )
		this.setMonth(this.getMonth() + 1, -1);
	else
		this.setDate(this.getDate() - 1);
}

/*
/	sets a new date e.g. 31
/
/	@param		a number representing the new date
*/
Timey.prototype.setDate = function(date) {

	this.now.setDate(date)
}


/*
/	gets the the number of days in the current month
/
/	@return		the number of days in the current month
*/
Timey.prototype.daysInCurrentMonth = function() {

	return new Date(this.now.getFullYear(), this.now.getMonth() + 1, 0).getDate();

}

/* get the current day of the week as a numeric value
/
/	@return: 	a number between 0-6 representing the day of the week
*/
Timey.prototype.getDay = function() {

	return this.now.getDay();
}

/* add a leading zero to a number if it's a single digit
/
/	@param: 	number to add leading zeros to
/
/   @return: 	on success: the number with a leading zero (string)
/				on failure: the number (number)
*/
Timey.prototype.leadingZero = function(num) {

	var numStr = num.toString();

	if ( numStr.match(/^[0-9]$/g) )
		return "0" + numStr;
	else
		return num;
}

/* get the textual representation of the current day e.g. Friday
/
/	@return 	on success: the textual version of the numeric version of the current day
				on failure: false
*/
Timey.prototype.getTextualDay = function() {

	// the day as an integer value
	var day_number = this.now.getDay();

	if ( day_number < this.days.length )
		return this.days[day_number];
	else
		return false;
}


/* get current month as a numeric value
/
/	@return: 	a number between 0-11 representing the month of the year
*/
Timey.prototype.getMonth = function() {

	return this.now.getMonth();

}

/* sets the current month 
/
/	@param		a number representing the month 0-11 and a number representing the day to start on e.g. 1-31
*/
Timey.prototype.setMonth = function(month, day) {

	if ( day )
		this.now.setMonth(month, day);
	else
		this.now.setMonth(month, 1);
}

/* get the textual representation of the current month e.g. January
/
/	@return 	on success: the textual version of the numeric version of the current month
				on failure: false
*/
Timey.prototype.getTextualMonth = function() {

	// the month as an integer value
	var month_number = this.now.getMonth();

	if ( month_number < this.months.length )
		return this.months[month_number];
	else
		return false;
}

/*
/	@param 	a full textual version of the month e.g. January
/	@return 	on success: a shortened versio of the passed month e.g. Jan
/				on failure: false 
/	
*/
Timey.prototype.getTextualShortMonth = function(textualMonth) {

	if ( this.months.indexOf(textualMonth) !== -1 )
		return textualMonth.substr(0,3);
	else 
		return false;

}

/* get the current year as a 4 digit number
/
/	@return: 	a 4 digit number representing the year e.g. 2015
*/
Timey.prototype.getFullYear = function() {

	return this.now.getFullYear();

}


/* generates a date in the requested format
/	
/	@param	a date format to parse
/   @return	the formatted date
*/
Timey.prototype.formatDate = function(dateFormat) {

	// the end result of parsing the passed date string
	var formatted_date =  "";

	/*
		formats --
	
		DAYS
		d = day with leading zeros e.g. 01 - 31
		D = textual representation of day e.g. Monday, Tuesday
		j = day without leading zeros e.g. 1 - 31

		MONTHS
		m = month with leading zeros e.g. 01 - 12
		F = full text represenation e.g. January
		M = month short name e.g. Jan
		n = number month without leading zeros

		YEAR
		Y = 4 digit representation of year e.g. 2015
	*/

	// the date format object holding all possible format characters
	date_formats = {
		d: this.leadingZero(this.now.getDate()),
		D: this.getTextualDay(),
		j: this.now.getDate().toString(),
		m: this.leadingZero(this.now.getMonth() + 1),
		F: this.getTextualMonth(),
		M: this.getTextualShortMonth(this.getTextualMonth()),
		n: this.getMonth() + 1,
		Y: this.getFullYear()
	}


	for ( var i = 0; i < dateFormat.length; i++ )
		if ( date_formats.hasOwnProperty(dateFormat[i]) )
			formatted_date += date_formats[dateFormat[i]];
		else
			formatted_date += dateFormat[i];	

	return formatted_date;

}




window.initialize = function() {

  //setUpInterface();

  // create a geocoder object
  var geocoder = new google.maps.Geocoder();

  // a reference to the form element on the page
  var address_form = document.getElementById("address_form");

  // get the address query
  var address = "";

  // the latlng object
  var latlng = "";

  // the found lat value
  var lat = "";

  // the found lng value
  var lng = "";

  // base url
  var endpoint = "https://api.forecast.io/forecast/0d1600b94e8755ddc5060393e2374d89/";

  // the options for the forecast io api request
  var options = {
    dataType: "jsonp"
  }

  // an array holding weekly information
  var weeklyForecast = [];


  // relevant weather borders to display
  var weatherBorders = {
    "clear-day": "border-yellow",
    "clear-night": "border-darkgray",
    "cloudy": "border-white",
    "default": "border-yellow",
    "fog": "border-white",
    "partly-cloudy-day": "border-yellow",
    "partly-cloudy-night": "border-darkgray",
    "rain": "border-blue",
    "sleet": "border-blue",
    "snow": "border-white",
	"thunderstorm": "border-darkgray",
    "wind": "border-white"
  }
  
  // an object consisting of weather icon urls
  var weatherIcons = {
    "clear-day": "http://static1.squarespace.com/static/552af7d8e4b010138bacbea9/555ac5cbe4b09b331f389793/555f68ffe4b0777b1da9a825/1432316202381/clear_day.gif",
	"clear-night": "http://static1.squarespace.com/static/552af7d8e4b010138bacbea9/555ac5cbe4b09b331f389793/555f68ffe4b0777b1da9a825/1432316202381/clear_day.gif",
    "cloudy": "http://static1.squarespace.com/static/552af7d8e4b010138bacbea9/555ac5cbe4b09b331f389793/555ad2b9e4b0b0d6f4bcb14a/1432316192402/cloudy.gif",
    "default": "https://lh3.googleusercontent.com/nRiCouECHPBPc_9cBut6KDuFSxl516nm6Y6jovE7aZ1uZQFTbYxnK7PDS1_jxVkszKn4358r2zWigGhjPOYFY3HcobgfWnwG6IXzoIYeNEG7Dy1yqjByZXIgcDROAQIqGPA5hY1pNrQ6Ms7FPGabU1LpdFsqE-ruECPPYPjTu1CNV-SsgWpBlXD2x40Kc4NwegGrdsgEL_yxShYh3UiJMy-KX0IHLaiGiIk0-fjZTfOhFpu8l0pccDCh3PmsihJXTue2YgthKwqBi09nuBULD3Zp0bqM8HuqlRWNHrGBjmQV9J_MWI9RDl9sAenjkw4JtoHnLggdXyYTkeayjyK7TMZPIRjOdxzVZdh_hK6GC3Skz5Rc8XVTXf07Yrtcrt9rwIT0xZKHKxQwPKuYR5Dx2hP6hW-Xe0HNDj6jrcXxJjAI49fZs16R8z7PrATThI4GQYzx5sjWZ3MXoLeoOqKjhFmkaRc8W-keJ2wkOx0zQkWebddY5U_VV1T2ml2MTEPHTqbPB-dUOtvUHO0e7SKQyMr9PbFiS9_gn_MpT4TXPQ=s128-no",
    "fog": "http://static1.squarespace.com/static/552af7d8e4b010138bacbea9/555ac5cbe4b09b331f389793/555acd85e4b0060faccb0643/1432316192631/fog.gif",
    "partly-cloudy-day": "http://static1.squarespace.com/static/552af7d8e4b010138bacbea9/555ac5cbe4b09b331f389793/555ad65be4b0e1ca79e7adb6/1432016477661/partly%29cloudy.gif",
    "partly-cloudy-night": "http://static1.squarespace.com/static/552af7d8e4b010138bacbea9/555ac5cbe4b09b331f389793/555ad65be4b0e1ca79e7adb6/1432016477661/partly%29cloudy.gif",
    "rain": "http://static1.squarespace.com/static/552af7d8e4b010138bacbea9/555ac5cbe4b09b331f389793/555ad101e4b061c3e461b63a/1432015106914/thunderstorm.gif",
    "sleet": "http://static1.squarespace.com/static/552af7d8e4b010138bacbea9/555ac5cbe4b09b331f389793/555ad189e4b06a37baf4f20c/1432015251082/snow_rain.gif",
    "snow": "http://static1.squarespace.com/static/552af7d8e4b010138bacbea9/555ac5cbe4b09b331f389793/555ad017e4b02ed6b99a084d/1432014872808/snow-heavy.gif",
    "thunderstorm": "http://static1.squarespace.com/static/552af7d8e4b010138bacbea9/555ac5cbe4b09b331f389793/555ac84fe4b0163880f885a9/1432012882169/thundershowers_day_night.gif",	
    "wind": "http://static1.squarespace.com/static/552af7d8e4b010138bacbea9/555ac5cbe4b09b331f389793/555acda8e4b0f52467699462/1432014268933/wind_day_night.gif"
  }

  // index of the currently visible forecast
  //current_weather_forecast_show = 0;


  // convert the address typed in by the user and convert it to geographical coordinates
  function geocoding(callback) {

    geocoder.geocode( { 'address': address}, function(results, status) {

      if (status == google.maps.GeocoderStatus.OK) {
        latlng = results[0].geometry.location;
        lat = latlng.lat();
        lng = latlng.lng();

        callback();
      } else {
        alert("That address can't be found.");
      }
    });
  }

  // takes latitude and longitude values and turns them into an address
  function reverse_geocoding(callback) {
    geocoder.geocode( { 'location': latlng }, function(results, status) {
      if ( status === google.maps.GeocoderStatus.OK ) {
        address = results[1].formatted_address;

        callback(address);
      } else {
        alert("Can't find your current address");
      }
    });
  }

  // make the api request
  function makeApiRequest(options) {   

    // construct the url using the endpoint and geographical coordinates
    var requested_url = construct_request_url(endpoint, lat, lng);

    $.ajax({
      url: requested_url,
      dataType: options.dataType,
      success: function(results) { display(results) } // display the results
    });
  }

  // display the address as the heading
  function displayHeading() {
    if ( address )
      document.getElementsByTagName("h1")[0].innerText = address;
    else
      document.getElementsByTagName("h1")[0].innerText = "Unknown Address";
  } 

  // validates an array of nested properties against a root object
  function traceProperties(obj, propArr) {

    var found = true;

    for ( var i = 0; i < propArr.length; i++ )
    {
      if ( obj.hasOwnProperty(propArr[i]) )
          obj = obj[propArr[i]];
      else
          found = false;
    }

    return found;

  }

  // get weekly forecast
  function getWeeklyForecast(results) {

    // create time object
    timey = new Timey();


    // for the seven expected days
    for ( var i = 0; i < 7; i++ )
    { 
          weeklyForecast.push({
            icon: traceProperties(results, ["daily", "data", i, "icon"]) ? results["daily"]["data"][i]["icon"] : "default",
            summary: traceProperties(results, ["daily", "data", i, "summary"]) ? results["daily"]["data"][i]["summary"] : "Summary Unavailable",
            temperatureMax: traceProperties(results, ["daily", "data", i, "apparentTemperatureMax"]) ? results["daily"]["data"][i]["apparentTemperatureMax"] : "0",			
            temperatureMin: traceProperties(results, ["daily", "data", i, "apparentTemperatureMin"]) ? results["daily"]["data"][i]["apparentTemperatureMin"] : "0",
            weatherBorder: traceProperties(results, ["daily", "data", i, "icon"]) ? weatherBorders[results["daily"]["data"][i]["icon"]] : "white",
            date: timey.formatDate("D d M Y"),
          });

          timey.forwardDay();
    }
  }

  // get tomorrows data
  function getTomorow(results, index) {

    if ( results["daily"] && results["daily"]["data"] && results["daily"]["data"][index] && results["daily"]["data"][index]["icon"] )
    {

      tomorrowIcon = results["daily"]["data"][index]["icon"];
	  current_temp = results["daily"]["data"][index]["temperatureMax"];
      current_temp = results["daily"]["data"][index]["temperatureMin"];

      checkIcon(tomorrowIcon, function(){
        setImage("#tomorrow img", iconUrl);
        $("#tomorrow .temperatureHigh").html(current_temp + "&deg;");
		 $("#tomorrow .temperatureLow").html(current_temp + "&deg;");
      });
    }
  }

  // read the current data
  function readCurrently(results) {

    currentIcon = results["currently"]["icon"];
    current_temp = results["currently"]["temperatureHigh"];
	 current_temp = results["currently"]["temperatureLow"];

    checkIcon(currentIcon, function(){
      setImage("#today img", iconUrl);
      $("#today .temperatureHigh").html(current_temp + "&deg;");
	   $("#today .temperatureLow").html(current_temp + "&deg;");
    });
  }

  function setUpInterface() {

    // cache a reference to the daily forecast element
    $daily_forecast_days = $("#daily_forecast .day");

    var iconUrl = "";

    var days_on_show = $daily_forecast_days.length;

    for ( var i = 0; i < days_on_show; i++ )
    {
      iconUrl = "Weather App/../images/" + weeklyForecast[i].icon + ".png";

      $daily_forecast_days.eq(i).find(".time").text(weeklyForecast[i].date);
      $daily_forecast_days.eq(i).find("img").attr("src", weatherIcons[weeklyForecast[i].icon]);
      $daily_forecast_days.eq(i).find(".temperatureHigh").html(weeklyForecast[i].temperatureMax + "<span class='temp_unit'>&#8457;</span>");
      $daily_forecast_days.eq(i).find(".temperatureLow").html(weeklyForecast[i].temperatureMin + "<span class='temp_unit'>&#8457;</span>");	  
      $daily_forecast_days.eq(i)[0].className =  $daily_forecast_days.eq(i)[0].className.replace(/border.+/g, "");
      console.log(weeklyForecast[i].weatherBorder);
      $daily_forecast_days.eq(i).addClass(weeklyForecast[i].weatherBorder);
    }

    loadReport(0);
  }

  function loadReport(index) {
    console.log($(this));
    $(".summary-date").text(weeklyForecast[index].date);
    $("#summary").text(weeklyForecast[index].summary);

  }


  // the main display method that will showcase the data
  function display(results) {

    console.log(results);

    if ( results != null )
    {

      if ( ! address )
      {
        reverse_geocoding(function(){
          displayHeading();
          getWeeklyForecast(results);
          setUpInterface();

          //readCurrently(results);
          //getTomorow(results, 1);
        });
      } else {
        displayHeading();
        getWeeklyForecast(results);
        setUpInterface();
        //readCurrently(results);
      }

    } else {
      throw new error("Didnt work");
    }

    $("body").addClass("loaded");
    $(".quick_info_wrapper").addClass("unselected");
    $("#today").removeClass("unselected");
  }

  // set the default coordinates
  function setDefaultLatlng(makeApiRequest) {

    // Altrincham
    latlng = { lat: 53.39023659999999, lng: -2.3126412999999957 }
    lat = latlng.lat;
    lng = latlng.lng;

    makeApiRequest();

  }

  // construct the url  
  function construct_request_url(endpoint, lat, lng) {

    return endpoint + lat + "," + lng;

  }

  // grab the coordinates of our address and execute the callback
    function getLatLng(getLatLng, callback) {

        getLatLng(function(){
          callback();
        });     
    }

  // retrieve the users geolocation based on the navigator object
  function getUserLatlngWeather(makeApiRequest) {

    if ( navigator.geolocation )
    {
      navigator.geolocation.getCurrentPosition(function(pos){

        latlng = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        lat = latlng.lat;
        lng = latlng.lng;

      }, setDefaultLatlng(makeApiRequest));

     } else {
        setDefaultLatlng(makeApiRequest);
     }
  }

  window.onload = function() {

    /*
    /   CLICK EVENTS
    /
    */

    // check to see if a daily forecast has been clicked
    $(".quick_info_wrapper").on("click", function(){

      $(".quick_info_wrapper").addClass("unselected");
      $(this).removeClass("unselected");

      loadReport($(this).index());
    });

    // forward a day to be used with the forward and back buttons - *no longer being used*
    /*
    $("#forwardBTN").on("click", function(){

      $(".quick_info_wrapper").eq(current_weather_forecast_show).css("display", "none");
      current_weather_forecast_show++;

    });
    
    // back a day to be used with the forward and back buttons - *no longer being used*
    $("#previousBTN").on("click", function(){

      current_weather_forecast_show--;
      $(".quick_info_wrapper").eq(current_weather_forecast_show).css("display", "inherit");

    });
    */

    // convert celsius to fahrenheit and vice versa
    $("#convertBTN").on("click", function(){

      // get the current data conversion value
      conversion_type = document.getElementById("convertBTN").getAttribute("data-conversion");

      if ( conversion_type === "celsius" )
      {
        if ( ! weeklyForecast.hasOwnProperty("celsius") )
        {
          // loop through all the days in the weekly forecast array
          for ( var i = 0; i < weeklyForecast.length; i++ )
            // create a new property and give it the value of the current temperatureHigh in fahrenheit but in celsius
		weeklyForecast[i].celsius = Math.round((weeklyForecast[i].temperatureMax - 32) * 0.55 * 100) / 100;
            weeklyForecast[i].celsius = Math.round((weeklyForecast[i].temperatureMin - 32) * 0.55 * 100) / 100;
        }
        
        // for each daily forecast wrapper change the value to celsius
        $(".quick_info_wrapper").each(function(element){
          $(this).find(".temperatureHigh").html(weeklyForecast[$(this).index()].celsius + "&deg;");
		  $(this).find(".temperatureLow").html(weeklyForecast[$(this).index()].celsius + "&deg;");
        });
        
        // change the attribute of the convert button to fahrenheit
        document.getElementById("convertBTN").setAttribute("data-conversion", "fahrenheit");
        // change the value of the convert button to fahrenheit
        document.getElementById("convertBTN").innerHTML = "Fahrenheit &#8457;";

      } else {

        // change the value of each daily forecast to the temperatureHigh in fahrenheit
        $(".quick_info_wrapper").each(function(element){
          $(this).find(".temperatureHigh").html(weeklyForecast[$(this).index()].temperatureMin + "&#8457;");
		  $(this).find(".temperatureLow").html(weeklyForecast[$(this).index()].temperatureMin + "&#8457;");
        });

        // change the attribute of the convert button to celsius
        document.getElementById("convertBTN").setAttribute("data-conversion", "celsius");
        // change the value of the convert button to fahrenheit
        document.getElementById("convertBTN").innerHTML = "Celsius &deg;";
      }
      
      
    });
  
    // whenever a link from a daily forecast is clicked take the user to the summary section
    $(".summary-link").on("click", function(){

      id = ($(this).attr("href"));
      scrollVertical = $(id).offset().top - $(id).height();
      $("body, html").animate({scrollTop: scrollVertical}, 300);

    });
$('body').prepend('<a href="#" class="back-to-top">Back to Top</a>');

var amountScrolled = 400;

$(window).scroll(function() {
	if ( $(window).scrollTop() > amountScrolled ) {
		$('a.back-to-top').fadeIn('slow');
	} else {
		$('a.back-to-top').fadeOut('slow');
	}
});

$('a.back-to-top, a.simple-back-to-top').click(function() {
	$('html, body').animate({
		scrollTop: 0
	}, 200);
	return false;
});
    weeklyForecast = [];

    // try to retrieve the users current location
    getLatLng(getUserLatlngWeather, function(){

      makeApiRequest(options);

    });
  }

  // on form submission
  address_form.onsubmit = function(event) {

    $("body").removeClass("loaded");

    // prevent the default behaviour of submitting the form
    event.preventDefault();

    // set the address variable to what the user typed
    address = document.getElementById("address_query").value;

    weeklyForecast = [];

    // get the geographical coordinates of what the user entered using geocoding
    getLatLng(geocoding, function(){
      makeApiRequest(options);
    });
  }
}