var currday=1,noofdays=1;
var mapstart=true;
var loaderpresent=false,panelpresent=false;
var markersArray = [];
var infoArray = [];
var tmpmarker1;
var map,currcity;
function notify(text,type,obj,tout,close,afterclose){
	if(type==undefined)type='info';
	if(tout==undefined)tout=false;
	if(close==undefined)close=['button','hover'];
	else if(close==1)close=['button'];else if(close==2)close=['hover'];else if(close==3)close=['click'];
	if(obj==undefined)
	n = new noty({text: text,dismissQueue: true,type: type,timeout: false,closeWith: close,
		template: '<div class="noty_message"><span class="noty_text"></span><div class="noty_close"></div></div>',
		callback:{afterClose:afterclose}
	});
	else $(obj).noty({text: text,dismissQueue: true,type: type,timeout: false,closeWith: close,
		template: '<div class="noty_message"><span class="noty_text"></span><div class="noty_close"></div></div>',
		callback:{afterClose:afterclose}
	});
}
function addday(){
	noofdays++;
	initialise_days_menu();
	theList[noofdays]={};
	notify("A Day was Added Successfully!!","success","#left_noty");
}
function goday(dayno){
	notify('Moving to Day #'+dayno,"success");
	currday=dayno;
	initialise_days_menu();
	$("#day-select").prop('selectedIndex', currday-1);
	$("#left_col_dayno").fadeOut();
	setTimeout(function(){
	$("#left_col_dayno").html(dayno);
	$("#left_col_dayno").fadeIn();
	},500);
	if(panelpresent)showpanel();
}
function initialise_days_menu(){
	$("#day-select").empty();
	for(var i=1;i<=noofdays;i++)
	$("#day-select").append("<option value='"+i+"'>Day "+i+"</option>");
	if(currday==1)$(".previousday").attr("disabled",true);else $(".previousday").attr("disabled",false);
	if(currday==noofdays)$(".nextday").attr("disabled",true);else $(".nextday").attr("disabled",false);
	//if(noofdays>1)$(".nextday").removeClass("hidden");else $(".nextday").addClass("hidden");
}	
var mapzoom=9;	
var lat,long;
$(function(){
	if(lat==undefined || long == undefined){lat = 13.0839; long = 80.2700 ;mapzoom = 5;}
	geocoder = new google.maps.Geocoder();
if(mapstart){
	map = new google.maps.Map(document.getElementById('map_canvas'), {
	  center: new google.maps.LatLng(lat , long),
	  zoom: mapzoom,
	  mapTypeId: google.maps.MapTypeId.MAP,
	  mapTypeControlOptions: {
	   style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
	 }
	});
	google.maps.Map.prototype.clearOverlays = function() {
	  for (var i = 0; i < markersArray.length; i++ ) {
	    markersArray[i].setMap(null);
	  }
	    markersArray.length = 0;
	}
}
	initialise_days_menu();
	$("#activity_select").change(function(){
		getactivities(this.value);
	});
});
	function openInfoWindow(id){
        google.maps.event.trigger(markersArray[id], 'click');
    }
	function getactivities(activity){
		var placeobj=undefined;
		// Change placeobj to current city's google lat long
		placeobj=new google.maps.LatLng(lat,long);
		if(loaderpresent)$("#loader").fadeIn("slow");

		map.clearOverlays();
		//showonmap(activity,placeobj,true);
		//alert("HEllos");
		showdbdata(activity,placeobj);
		setTimeout(function(){
		//map.setZoom(12);	
		//if(loaderpresent)$("#loader").fadeOut("slow");
		},1800);
		
	}
	function showonmap(placetypes,placeobject,dontclear){
	if(dontclear==undefined)dontclear=false;
	//var chennai = new google.maps.LatLng(13.0839,80.2700);
	//console.log(placetypes);
	placeobject=new google.maps.LatLng(lat,long);
	if(placeobject===undefined){
		notify("Please Choose a place, Searching for Chennai","error"); 
		placeobject= new google.maps.LatLng(13.0839,80.2700);
	}
	placetypes+=" "+currcity;
	var request = {
		location: placeobject,
		radius: 50000,
		query: placetypes
	//	types: placetypes
	};
	infowindow = new google.maps.InfoWindow();
	var service = new google.maps.places.PlacesService(map);
	//service.nearbySearch(request, callback);
	//alert("HELLO");
	service.textSearch(request, callback);
/*	request = {
    bounds: map.getBounds(),
    keyword: 'hotel'
  	};
  	service.radarSearch(request, callback);
*/
	function callback(results, status, pagination) {
	  if (status != google.maps.places.PlacesServiceStatus.OK) {
	  			if(status=="ZERO_RESULTS"){
	  				alert("No Google Data found for it");
	  				//createMarkers([]);
	  				//	  map.fitBounds(bounds);
	  			if(loaderpresent)$("#loader").fadeOut("slow");
	  			}
	  } else {

	  	//Clear Before calling the whole set of functions as from db we clear previous data from google.
	  	//map.clearOverlays();

	    createMarkers(results);
	  }
	}
	}
	function createMarkers(places,placedata,dontclear,zoom) {
		if(places==[])return;
		if(dontclear==undefined)dontclear=false;
		if(zoom==undefined)zoom=false;
		//if(loaderpresent)$("#loader").fadeIn("slow");
		// Place data for sending introtext for each of those data;
	  var bounds = new google.maps.LatLngBounds();
	var infowindow;
	  for (var i = 0, place; place = places[i]; i++) (function(i){
	  	var tmpmarker=null;
	    var image = {
	      url: place.icon,
	      size: new google.maps.Size(71, 71),
	      origin: new google.maps.Point(0, 0),
	      anchor: new google.maps.Point(17, 34),
	      scaledSize: new google.maps.Size(25, 25)
	    };
			tmpmarker1=place;
			console.log(tmpmarker1);
	    tmpmarker = new google.maps.Marker({
	      map: map,
	      icon: image,
	      title: place.name,
	      position: place.geometry.location,
	      linkid: place.linkid
	    });
	    markersArray.push(tmpmarker);
	  	//console.log(marker.title);
	  	var tempmarker=tmpmarker;
	    google.maps.event.addListener(tmpmarker,"mouseover",function(){
			var linkid=tmpmarker.linkid;
			if(linkid)$("#"+linkid).css("border","1px solid rgb(156,9,9)");
		});
	    google.maps.event.addListener(tmpmarker,"mouseout",function(){
			var linkid=tmpmarker.linkid;
			if(linkid)$("#"+linkid).css("border","none");
		});
	    google.maps.event.addListener(tmpmarker,"click",function(){
	    	//var tempmarker=this; //or use function for each iteration so its not overwritten like 
	    	//	for(var i = 0; i <length; i++){
	    	//	(function(i) {
        	//	...
    		//	})(i);
			//	}
			var introtext='Hello World , Welcome to '+tempmarker.title;
			var placeimage='';
			//console.log(placedata);
			if(placedata!=undefined && placedata[i]!=undefined){
				introtext=placedata[i]['text'];
				if(placedata[i]['image'])
				placeimage="<img src='"+placedata[i]['image']+"' />";
			}
			//console.log(introtext);
			//console.log(placeimage);
			
			var item={
				title:tempmarker.title,
				lat  :tempmarker.position.lat(),
				long :tempmarker.position.lng(),
				type :currentcateg,
				subtype :currentsubtype
			}
			//console.log("Hello");
			var onclickfn="additemtoday("+JSON.stringify(item)+")";
			var addthisbutton;
			addthisbutton='Add to <select class="changeday" onchange="curr_addday=parseInt(this.value);">';
			curr_addday=currday;
			for(var i=1;i<=noofdays;i++)
				if(checkitem(item,i)==false)
				addthisbutton+="<option value='"+i+"' "+(i==currday?"selected='true'":"")+">Day "+i+"</option>";
			addthisbutton+='</select>';
			addthisbutton+='<button class="btn btn-success" onclick=\''+onclickfn+'\'>Add</button>';
	    	var contentString = '<div id="contents">'+
		      '<div id="siteNotice">'+
		      '</div>'+
		      '<h2 id="firstHeading" class="firstHeading">'+tempmarker.title+'</h2>'+
		      '<div id="bodyContent">'+'<div>'+placeimage+'</div>'+
		      '<p>'+introtext+' <a href="#">Read More</a></p>'+addthisbutton+
		      '</div>'+
		      '</div>';
		      
		      for( iw in infoArray){
		      //if(infoArray[iw]!=undefined)
		      	infoArray[iw].close();
		      }

			  infowindow = new google.maps.InfoWindow({
			      content: contentString
			  });
			  infoArray.push(infowindow);
			  //console.log(tempmarker);		
			  infowindow.open(map,tempmarker);
			  //console.log(tempmarker);
	    	//console.log("Clicked "+this.title);// For further click processing adding etc
	    });		     
	   // placesList.innerHTML += '<li>' + place.name + '</li>';
	    bounds.extend(place.geometry.location);
	  })(i)

	  google.maps.event.addListener(map,"click",function(){
	  	// To Close open info window if user clicks outside it
	  	for( iw in infoArray) 	infoArray[iw].set("map",null);
	  })
		     setTimeout(function(){
		     	for( iw in infoArray)
		      	infoArray[iw].set("map",null);
		 	},100);	  
	  //tmpmarker=null;
	  
	  if(zoom)map.fitBounds(bounds),zoomToMarkers(places);
	  if(loaderpresent)$("#loader").fadeOut("slow");
/*	  for( iw in infoArray){
		      	infoArray[iw].set("map",null);
		      }
*/		      
	 // map.setZoom(10);		    
	}
	function maptab(no){
		if(no==1){
			getactivities($("#activity_select").val());
		}else if(no==2){
			getactivities("hotel");
		}else if(no==3){
			map.clearOverlays();
		}
	}