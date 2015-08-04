//Using the Gracenote OnConnect API. This application will return listings for showtimes for a given ZIP code.

//for sample data, use document ready
// $(document).ready(function() {

  //submit on form event
$('form').submit(function(evt) {
//
//  // prevent default activity
    evt.preventDefault();
//   
  

//data samples
var showings2 = '../data_samples/showings.json';
//cache value of zip search
var search = $('#submit');
var zipCode = $('#search').val();

//misc. variable declarations
var displayShowTimes;
var listing;
var ratings;
var tList = [];

//api key
var showingsApiKey = "YOUR API KEY GOES HERE";

  
//code for retrieving the current date
var currentDate = new Date();
var today = currentDate.getFullYear() + '-' + (currentDate.getMonth()+1) + '-' + currentDate.getDate();

//url to retrieve data
var showtimesUrl = "http://data.tmsapi.com/v1.1/movies/showings?startDate=" + today + "&zip=" + zipCode + "&jsonp&api_key=" + showingsApiKey;



//Function to convert timestamps to US 24hr format
    function timeConvert(time) {
   // Check correct time format and split into components
   time = time.toString().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) { // If time format correct
      time = time.slice (1);  // Remove full string match value
      time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join (''); // return adjusted time or original string
  }
  

  
  
  //Function to iterate through movies in JSON and return showtimes
 var displayShowtimes = function(data) {
   $('#showtimes').html("");
   //Debug test function
    console.log("Yes, the function worked");
   
   // Grammatically correct search return messages for number of movies returned
   if (data.length>1) {
        $('#showtimes').prepend('<p class="how-many">There are ' + data.length + ' movies playing near '  + zipCode         + '</p>');
    } else if (data.length=1) {
        $('#showtimes').prepend('<p class="how-many">There is one movie playing near '  + zipCode + '</p>');
    }  else {
      $('#showtimes').prepend('<p class="how-many">Sorry, no movies are playing near '  + zipCode + '</p>');
  
    }
    
    }; 
   //create listings class  
    listing = '<ul class="listings">';

   //each function to iterate through each movie in the JSON table
      $.each(data, function(i, movie) {
     ratings = movie.ratings[0].code;     //declare ratings cache. Disable if working on sample data. buggy.
   console.log(ratings);
        
        listing += '<li class="listed-movie"><div class="movie-title">' + movie.title + '</div>';
        
            //Print out movie title and rating
            //NOTE: Printing of ratings does not work on sample data. Disable if working on sample data.

        
        //append times and theaters
        listing += '<div class="times-and-places">';
        
       /* reduce function to allow for printing combined showtimes for each theatre instead of the how it appears in JSON data, which is a theatre for each showtime
            //function checks whether id attached to theatre for showtime object matches previous theatre object; if so, appends new showtime to existing theatre id. Otherwise, creates new theatre listing. */
        var shows = movie.showtimes.reduce(function (p, c) {
    if (!p[c.theatre.id]) {
        p[c.theatre.id] = {
            theatreName: c.theatre.name,
            showtimes: [c.dateTime]
        };
    } else {
        p[c.theatre.id].showtimes.push(c.dateTime);
    }
    return p;
}, {});
        
        //Debug code to make sure function works
//        console.log(shows);

     
        
        //for-in loop to actually put listings on the stage. Append divs containing showtime information to div
        for (var t in shows) {
    if (shows.hasOwnProperty(t)) {         
        listing += '<div class="theater-listing"><div class="movie-theater">'
               + shows[t].theatreName
               + '</div>'; 
        for (var j=0; j < shows[t].showtimes.length; j++) {
            listing += '<div class="movie-time">' + timeConvert(shows[t].showtimes[j].slice(11,16)) + '</div>';
        }

        listing += '</div>';
          
    }
           //End loop of array to iterate through showtimes
}


          // End each loop for individual movie theater listings
                listing += '</div></div></div>';     
      
      });
            //Close out list of listings
   
                listing += '</ul>';
   //Append movie name and listing to #showtimes div on page
          $('#showtimes').append(listing);
   }; 



  

  
   //getJSON function to parse JSON file and run function to display showtimes
        $.getJSON(showtimesUrl, displayShowtimes);

});



