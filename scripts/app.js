// define globals

$(document).on("ready", function() {
  var weekly_quakes_endpoint = "http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";
  var arr = [];

  // CODE IN HERE!
  $.ajax({
      method: "GET",
      url: weekly_quakes_endpoint,
      dataType: 'JSON',
      success: onSuccess,
      error: onError
    });

    function onSuccess(json){
        var feature = json.features;
        var source = $('#earthquake-li-template').html();
        var template = Handlebars.compile(source);
        getTimePlaceMag(feature);
        var earthquakeHtml = template({ earthquakes: arr });
        $("#earthquakes-list").append(earthquakeHtml);

        initMap(json);

    }

    function initMap(json) {
        var locationSF = { lat: 37.78, lng: -122.44};
        var map = new google.maps.Map(document.getElementById('map'),
        {
            center: locationSF,
            zoom: 2
        });

        var marker = new google.maps.Marker({
            position: locationSF,
            map: map
        });

        json.features.forEach(function(obj){
            var lat = obj.geometry.coordinates[1];
            var lng = obj.geometry.coordinates[0];
            var marker = new google.maps.Marker({
                    position: { lat: lat, lng: lng},
                    map: map,
                    title: obj.properties.place
                });
        });
    }

    function trackTime(date){
        var duration = (Date.now()-date);
        if(duration/60000<60){
            return Math.floor(duration/60000)+" minutes ago";
        }else if(duration/3600000<24){
            return Math.floor(duration/3600000)+" hours ago";
        }else{
            return Math.floor(duration/86400000)+" days ago";
        }
    }

    function placeExtract(title){
        return title.replace(/.*of/, '' ).trim();
    }

    function getTimePlaceMag(feature){
        feature.forEach(function(element){
            arr.push({Margnitude: Math.floor(element.properties.mag), Time: trackTime(element.properties.time), Location: placeExtract(element.properties.title)});
        });
        return arr;
    }

    function onError(){
      alert("Error!");
    }
});
