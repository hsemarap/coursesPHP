/*
//To do
shift events based on distance
Save Trip.
Share Trip.
Services Listing
Service Confirmation
If possible ( After everything, add php page to ajax new places for a given time slot)
*/
var expDate = new Date(); // Exp time of cookies stored
expDate.setTime(expDate.getTime() + (24 * 60 * 60 * 1000)); 
tmp1="";tmp2="";	// used temporarily for storing calcroute's input args ie the lat long of origin & destn
Distances={};
eventSeq={};
debug=true;ctr=1;
var uniqeventid="aa00";
Date.prototype.addHours= function(h){
    this.setHours(this.getHours()+h);
    return this;
}
Date.prototype.addMinutes= function(m){
    this.setMinutes(this.getMinutes()+m);
    return this;
}
function scrollLeft(no){
	if($(".calendar:nth-of-type("+no+")").length>0){
	$("#itinwrapper").animate({scrollLeft:$(".calendar:nth-of-type("+no+")").position().left},1000);
	return true;
	}
	else return false;
}
$(function(){
	var viewdayno=1;
	$("#nextdays").click(function(){
		if(scrollLeft(viewdayno+2))
		viewdayno+=2;
	});
	$("#previousdays").click(function(){
		if(scrollLeft(viewdayno-2))
		viewdayno-=2;
	});
});
function getEventId(){
	var ans=uniqeventid;
	var num=parseInt(uniqeventid.substr(2,2));
	var n1=uniqeventid.charCodeAt(0);
	var n2=uniqeventid.charCodeAt(1);
	num++;
	if(num<10)num="0"+num;
	else if(num>99){
		num="00";
		n2++;
	}
	if(n2>'z'.charCodeAt(0)){
		n2='a'.charCodeAt(0);
		n1++;
	}
	n1=String.fromCharCode(n1);
	n2=String.fromCharCode(n2);
	uniqeventid=n1+n2+num;
	return ans;
}
function getTimeFromHeight(maxtop){
  var hours = parseInt(maxtop/84);
  var minutes = parseInt(maxtop/1.4)%60;
  var ampm = hours >= 12 ? 'pm' : 'am';
  minutes = minutes < 10 ? '0'+minutes : minutes;
  minutes=rounduptime(minutes);
  if(minutes==0)hours++;
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  var strTime = hours + ':' + minutes;// + ' ' + ampm;
  return strTime;
}
function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes;// + ' ' + ampm;
  return strTime;
}
// Each Hour 84px from Top;
// 60 min - 84          1 min = 84/60 -- 8.4/6  -- 1.4;
theList=JSON.parse($.cookie("theList"));
theEvents=$.cookie("theEvents");
theEventsData=$.cookie("theEventsData");
setInterval(function(){
	setdb();
},5*60*1000)
var mapresult={};
if(theEvents==null)theEvents={};
else	theEvents=JSON.parse(theEvents);

if(theEventsData==null)theEventsData={};
else	theEventsData=JSON.parse(theEventsData);

function checkevents(){
	var no=1;
	////console.log(theEvents);
	$.each(theEvents,function(id1,events){
		////console.log(theEvents[id1]);
		if(events)
		$.each(events,function(id2,evt){
			if(evt){
				////console.log(evt);
			//evt=theEvents[id1][id2];
			var sm=evt.start.getMinutes();
			var em=evt.end.getMinutes();
			if(sm>0 && sm<15)evt.start.setMinutes(15);if(sm>15 && sm<30)evt.start.setMinutes(30);if(sm>30 && sm<45)evt.start.setMinutes(45);if(sm>45 && sm<60)evt.start.setMinutes(60);
			if(em>0 && em<15)evt.end.setMinutes(15);if(em>15 && em<30)evt.end.setMinutes(30);if(em>30 && em<45)evt.end.setMinutes(45);if(em>45 && em<60)evt.end.setMinutes(60);
			setcookies(no);
			}
		});
		no++;
	});
}
var noofdays=5,currday=1;
$(function(){
mapstart=false;
getCookies();
initialize();
});
var rendererOptions = {
  draggable: true
};
var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);;
var directionsService = new google.maps.DirectionsService();
var map;

var india = new google.maps.LatLng(21, 78);

function initialize() {
  var mapOptions = {
    zoom: 4,
    center: india
  };
  if(mapstart){
  $("#map-canvas").removeClass('hidden');
  map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
  directionsDisplay.setMap(map);
  //directionsDisplay.setPanel(document.getElementById("directionsPanel"));
  }
  else $("#map-canvas").addClass('hidden');
  google.maps.event.addListener(directionsDisplay, 'directions_changed', function() {
    computeTotalDistance(directionsDisplay.directions,directionsDisplay.customcallback,directionsDisplay.callbackdata);
  });
}
function calcRoute(origin,destination,waypoints,callbackdata,callback,recheck) {
	// Recheck is sent as obj to check if distance already known, 
	// if so just call given callback else proceed normally after finding it.
  if(recheck==undefined)recheck=false;
  if(waypoints==undefined)waypoints=[];
//  //console.log(Distances,'SDFsdf');
//  //console.log(Distances[recheck.id1]);
  if(recheck && !(Distances[recheck.id1]==undefined  || Distances[recheck.id1][recheck.id2]==undefined))
  	{
  		mapresult.seconds=(Distances[recheck.id1][recheck.id2]*60)/1.4;
  		var hr=parseInt(mapresult.seconds/3600);
  		var min=parseInt(mapresult.seconds/60);
  		var text="";
  		if(hr>0)text+=hr+" hour"+(hr>1?"s":"");
  		text+=min+" min"+(min>1?"s":"");
  		mapresult.timetext=text;
  		if(callback){
  		callback(callbackdata);
  		}
  		return;
  	}
  	if(recheck)callbackdata.recheck=recheck;
  tmp1=origin;tmp2=destination;
  var request = {
    origin: origin,//"Sydney, NSW",
    destination: destination,//"Sydney, NSW",
    waypoints:waypoints,
    //[{location: "Bourke, NSW"}, {location: "Broken Hill, NSW"}],
    travelMode: google.maps.TravelMode.DRIVING
  };
  directionsService.customcallback=callback;
  directionsService.callbackdata=callbackdata;
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.customcallback=directionsService.customcallback;
      directionsDisplay.callbackdata=directionsService.callbackdata
      directionsDisplay.setDirections(response);
    }
  });
}

function computeTotalDistance(result,callback,callbackdata) {
  var total = 0,time=0;
  var myroute = result.routes[0];
  ////console.log(myroute);
  for (i = 0; i < myroute.legs.length; i++) {
    total += myroute.legs[i].distance.value;
    time  += myroute.legs[i].duration.value;
  }
  total = total / 1000.
  mapresult.distance=total;
  mapresult.seconds=time;
  mapresult.timetext=myroute.legs[0].duration.text;
  if(callbackdata.recheck){
  	alert("Setting for "+callbackdata.recheck.id1+" to "+callbackdata.recheck.id2);
  	if(Distances[callbackdata.recheck.id1]==undefined)Distances[callbackdata.recheck.id1]={};
  	Distances[callbackdata.recheck.id1][callbackdata.recheck.id2]=Math.ceil((time/60)*1.4);
  }
  if(callbackdata!=undefined)callback(callbackdata);
}	
function showtrip(showit,dayno){
	if(showit==undefined)showit=false;
	if(dayno==undefined)dayno=-1;
	var show="";
	if(theList)
	show+='<div id="showtrip" class=" panel-group">';
	for(var day=1;day<=noofdays;day++)
	if(dayno==-1 || dayno==day)
	{
		var collapseclass="";
		if(day==currday)collapseclass=" in ";
		show+='<div class="panel panel-default">\
          <div class="panel-heading">\
            <h4 class="panel-title">\
              <a data-toggle="collapse" data-parent="#accordion" href="#collapse'+day+'">';
        show+='Vacation Day '+day;
        show+='</a>\
        	</h4>\
        </div>\
          <div id="collapse'+day+' class="panel-collapse collapse '+collapseclass+'">\
            <div class="panel-body">';
        if(theList==undefined || theList[day]==undefined)show+='<h4>No Plans are added for this day </h4>';
		else 
		for(type in theList[day]){
			show+='<div class="modal-header">\
	        <h4 class="modal-title">'+type+'</h4>\
	      </div>';
	      	show+='<div class="modal-body">\
	      		   <ul>';
	        for(i in theList[day][type])
	        	if(theList[day][type][i])
	        {
	        	var placetitle=theList[day][type][i].title;
	        	var placetext=theList[day][type][i].text;
	        	var placeimageurl=theList[day][type][i].imageurl;
	        	var placesubtype=theList[day][type][i].subtype;
	        	if(placetext==undefined)placetext=placetitle+" is a good Place for "+placesubtype;
	        	if(placeimageurl==undefined)placeimageurl="img/staticmap.png";
	        	show+='<li class="modaltypelist placetoadd" data-lat="'+theList[day][type][i].lat+'" data-lng="'+theList[day][type][i].long+'">\
	        			<span class="modaltitle">'+placetitle+'</span><br>\
	        			<span class="type">'+placesubtype+'</span>\
	        			<span class="placedata hidden">\
	        			<span class="title">'+placetitle+'</span>\
	        			<span class="type">'+placesubtype+'</span>\
	        			<span class="subtype">'+placesubtype+'</span>\
	        			<span class="text">'+placetext+'</span>\
	        			<span class="imgurl">'+placeimageurl+'</span>\
	        			</span>\
	        			</li>';
	        }
	      	show+='</ul>\
	      		   </div>';
		}
		show+='</div>\
            </div>\
        </div>';
	}
	if(theList)
	show+='</div>';
	if(show=="")show='<div class="modal-header">\
        <h4 class="modal-title">Currently, You have no plans Scheduled for this day. Please Add plans to your trip</h4>\
      </div>';

	$("#backdrop .contents").html(show);
	$(".collapse").collapse()
	if(showit)
	$("#backdrop").modal("show");
}
function setcookies_events(){
	var i=1;
	$.cookie("uniqeventid",uniqeventid,{ expires: expDate });
	var days=Object.keys(theEvents).length;
	$.cookie("days",days,{ expires: expDate });
	for(var i=1;i<=days;i++)
		setcookie_day(i);
	$.each(theEvents,function(id,daylist){
		$.cookie("daycount-"+id,Object.keys(daylist).length,{ expires: expDate });
	});
	//$.cookie("theEvents",JSON.stringify(theEvents),{ expires: expDate });
}
function setcookie_event(evt){
	$.cookie("evtid-"+evt.id,JSON.stringify(evt),{ expires: expDate });
}
function setcookies(){
	$.cookie("timestamp_planner",(new Date()).toJSON());
	$.cookie("days",Object.keys(theEvents).length,{ expires: expDate });
	$.cookie("eventSeq",JSON.stringify(eventSeq),{ expires: expDate });
	$.cookie("Distances",JSON.stringify(Distances),{ expires: expDate });
	$.cookie("uniqeventid",uniqeventid,{ expires: expDate });
	$.each(theEvents,function(id,events){
		$.cookie("day-"+id,Object.keys(theEvents[id]).length,{ expires: expDate });
		var dayarr=[];
		$.each(events,function(id2,evt){
			$.cookie("event-"+id2,JSON.stringify(theEvents[id][id2]),{ expires: expDate });
			dayarr.push(id2);
		});
		$.cookie("dayarr-"+id,JSON.stringify(dayarr),{ expires: expDate });
	});
	//$.cookie("theEvents",JSON.stringify(theEvents),{ expires: expDate });
/*	$.each(theEvents[day-1],function(id,dayevent){
		$.cookie("dayevent-"+(day-1)+"-"+id,dayevent.id,{ expires: expDate });
	});
*/}
function get_db(key,page){
	if(page==undefined)page="planner";
	if(page==false)page="";
	// Not working check on it.
	$.ajax({
		url :"../save.php",
		type:"post",
		data:{
			page:page,
			key:key,
		},
		success:function(data){
		//	console.log(data);
			eval(key+" = JSON.parse('"+data+"');");
		}
	});
}
function getdb(callback){
	var data=["days","eventSeq","Distances","uniqeventid","theEvents","timestamp","pickup","pickupstart","pickuplen"];
	get_db("theList",false);
	$.ajax({
		url:"../save.php",
		type:"post",
		dataType:"json",
		data:{
			page:"planner",
			data:data,
			multi:true
		},
		success:function(data){
			if(data.present){
				//console.log(data);
				//tmp=data;
				Distances=JSON.parse(data.Distances);
				eventSeq=JSON.parse(data.eventSeq);
				theEvents=JSON.parse(data.theEvents);
				noofdays=data.days;
				uniqeventid=data.uniqeventid;
				if(callback)callback(data);
			}
		},
		error:function(xhr,status,error){
			alert(status+error);
			alert(xhr.responseText);
		}
	});	
}
function set_db(key,page){
	if(page==undefined)page="planner";
	if(page==false)page="";
	$.ajax({
		url :"../save.php",
		type:"post",
		data:{
			page:page,
			key:key,
			save:true
		},
		success:function(data){
			alert(data);
		}
	});
}
function setdb(data,page){
	if(page==undefined)page="planner";
	if(page==false)page="";	
	if(data==undefined){
	data={};
	data["timestamp"]=(new Date()).toJSON();
	data["days"]=Object.keys(theEvents).length;
	data["eventSeq"]=JSON.stringify(eventSeq);
	data["Distances"]=JSON.stringify(Distances);
	data["uniqeventid"]=uniqeventid;
	data["theEvents"]=JSON.stringify(theEvents);
	data2={};
	data2["pickup"]=JSON.stringify(pickup);
	data2["pickuptime"]=pickuptime;
	data2["pickuplen"]=pickuplen;
	data2["theList"]=JSON.stringify(theList);
	setdb(data2,false);
	}
	$.ajax({
		url:"../save.php",
		type:"post",
		data:{
			page:page,
			data:data,
			save:true,
			multi:true
		},
		success:function(data){
			if(data.length > 5)alert(data);
		}
	});
	//$.ajax({url:"../save.php",type:"post",data:{key:"theEvents",value:JSON.stringify(theEvents),save:true}});
}
function getCookies(){
	var laststamp=new Date($.cookie('timestamp_planner'));
	//alert((new Date() - laststamp)/(60*1000));
	if($.cookie('timestamp_planner') && (new Date() - laststamp)/(60*1000)<2)
		 {
		 	getCookiesAux();
		 	if($(".calendar").length==0)initcalendar();
		 }
	else getdb(function(data){
		var ctimestamp=$.cookie('timestamp_planner');
		if(ctimestamp && ctimestamp>data["timestamp"]){
			getCookiesAux();
		}else setcookies();
		if(theList)
			noofdays=Object.keys(theList).length;
		else {
			noofdays=0;
			notify("You have not planned your Vacation Yet, Lets Go back and Add a Few Places","information");
			setTimeout(function(){window.location='../start.php';},3500);
			}
		if(pickup==undefined){
		getpickup();    
		}
		else if(pickuptime==undefined||pickuplen==undefined){
			var text="";
			text+="<h3>At what Time do you arrive at "+pickup.name+" ? And How Long ??</h3>";
			text+="<form onsubmit='javascript:event.returnValue=false;return false;'>";
			text+="Arrive at <input id='pickuptime' type='text' style='margin-left:17px' required placeholder='click here' class='btn btn-primary timepick' value='"+(pickuptime!=undefined?pickuptime:"")+"'/>(Time You Reach)<br><br>";
			text+="Buffer Time <input id='pickuplen' type='text' placeholder='click here' required class='btn btn-primary timepick' value='"+(pickuplen!=undefined?pickuplen:"")+"'/>(hours:minutes you might be delayed)<br><br>";
			text+="<input id='pickupsubmit' onclick='pickupinit()' type='submit' value='Proceed' class='btn btn-success' /></form>";
			$("#backdrop .contents").html(text);
			$(".timepick").timepicker();
			$("#backdrop").modal({show:true,backdrop:'static',keyboard:false});
			$("#backdrop .close").addClass("hidden");
		}	
		else {
			initcalendar();	
		}
	});
		
}
function getCookiesAux(){
	theList=JSON.parse($.cookie("theList"));
	if(theList)
	noofdays=Object.keys(theList).length;
else {
	noofdays=0;
	notify("You have not planned your Vacation Yet, Lets Go back and Add a Few Places","information");
	setTimeout(function(){window.location='../start.php';},3500);
	}
	var days=$.cookie("days");
	//alert(days+" days");
	if(days==undefined)days=0;
	eventSeq=JSON.parse($.cookie("eventSeq"));
	//console.log(eventSeq);
	if(eventSeq==undefined)eventSeq={};
	Distances=JSON.parse($.cookie("Distances"));
	if(Distances==undefined)Distances={};
	uniqeventid=$.cookie("uniqeventid");
	if(uniqeventid==undefined)uniqeventid="aa00";
	theEvents={};
	var dayct=0,dayarr=[];
	for(var i=0;i<days;i++){
		theEvents[i]={};
		dayct=$.cookie("day-"+i);
		if(dayct==undefined)dayct=0;
		dayarr=JSON.parse($.cookie("dayarr-"+i));
		if(dayarr==undefined)dayarr=[];
		for(var j=0;j<dayct;j++){
			theEvents[i][dayarr[j]]=JSON.parse($.cookie("event-"+dayarr[j]));
		}	
	}
	if(theEvents==undefined)theEvents={};
	for(var i=0;i<Object.keys(theList).length;i++){
		if(theEvents[i]==undefined)theEvents[i]={};
	}
	pickup=JSON.parse($.cookie("pickup"));
	pickuptime=$.cookie("pickuptime");
	pickuplen=$.cookie("pickuplen");
	if(!pickuplen){
		pickuplen="02:00";
		$.cookie("pickuplen",pickuplen);
	}
}
function getCookies_old(){
	uniqeventid=$.cookie("uniqeventid");
	if(uniqeventid==undefined)uniqeventid="aa00";
	var days=$.cookie("days");
	theEvents={};
	var daycount;
	var evtid;
	if(days==undefined)days=0;
	for(var i=0;i<days;i++){
		theEvents[i]={};
		daycount=$.cookie("daycount-"+i);
		for(var j=0;j<daycount;j++){
			evtid=$.cookie("dayevent-"+i+"-"+j);
			theEvents[i][evtid]=JSON.parse($.cookie("evtid-"+evtid));
		}
	}
}
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

function traveltimer(dayno){
	// Try to make it also work for specific event alone ( before and after it)
	// So that no of ajax requests reduce and speed increases.
	//var Events=$.extend(true, {}, theEvents);
	//Events=theEvents;
	$.each(theEvents,function(id,evtarr){
	if(dayno==undefined || dayno-1==id){
		sortarraybykey(theEvents[id],"start",true,1);
		for(var i=1;i<Object.keys(theEvents[id]).length;i++){
			var origin=new google.maps.LatLng(theEvents[id][i-1].lat,theEvents[id][i-1].lng);
			var destination=new google.maps.LatLng(theEvents[id][i].lat,theEvents[id][i].lng);
			calcRoute(origin,destination,[],i,function(idx){
				var time=(mapresult.seconds)/60;
				var start=mapresult.start,end=mapresult.end;
				time=rounduptime(time);
				var mintime=new Date(start.end);
				mintime.addMinutes(time);
				var top=parseInt(1.4*(mintime.getHours()*60+mintime.getMinutes()));
				var thistop=parseInt($($($(".calendar")[dayno-1]).find(".fc-event-container .fc-event-start")[idx]).css("top"));
				var thisht=parseInt($($($(".calendar")[dayno-1]).find(".fc-event-container .fc-event-start")[idx]).css("height"));
//var thisevt=$($($(".calendar")[dayno-1]).find(".fc-event-container .fc-event-start")[idx]).detach();
				var maxtop=(top>thistop?top:thistop);
				
				var newstart=getTimeFromHeight(maxtop);
				var newend=getTimeFromHeight(maxtop+thisht);
				var timetext=newstart+"-"+newend;
				top=(top>thistop?top:thistop);
				//$($(".calendar")[dayno-1]).find(".fc-event-container").append(thisevt);
				//$($($(".calendar")[dayno-1]).find(".fc-event-container .fc-event-start")[idx]).css("top",top+'px');
				//$($($(".calendar")[dayno-1]).find(".fc-event-container .fc-event-start .fc-event-time")[idx]).html(timetext);
			});
		}
	}
	});

}
function rounduptime(time){
	if(time<=15 && time>0)if(time<10)time=0;else time=15;else if(time<30)if(time<20)time=15;else time=30;else if(time<45)if(time<37)time=30;else time=45;else if(time<52)time=45;else time=60;
	return time;
}
function initcalendar(){
	$("#itincontainer").html("");
	$("#itincontainer").css("width",wt*0.2*(noofdays+1)+'px');
	for(var i=0;i<noofdays;i++){
		$("#itincontainer").append("<div class='calendar' data-dayno="+(i+1)+"></div>");
	}
	var dayno=1;	
	if(theEvents==undefined)theEvents={};
	$('.calendar').each(function(){
    	$(this).fullCalendar({
        defaultView:"agendaDay",
        editable: true,
        firstHour:pickupstart,
        contentHeight: ht*0.85,
        defaultEventMinutes: 120,
        header:{
				    left:   '',
				    center: 'title',
				    right:  ''
				},
        slotMinutes: 15,
        allDaySlot:false,
        titleFormat:'Day '+dayno,
        dayClick: function(d) { 
        		///////////////////// Can Use this to add New places :)))))
		},
		eventDrop: function(event, dayDelta, minuteDelta, allDay, revertFunc) {
		},
        events:[]
    	});
		//     To Do
		//     Check if Cookies are Enabled, if not ask them to 
		//	   Check if JS is enabled, else ask em to
		if(theEvents[dayno-1]==undefined)theEvents[dayno-1]={};
    	dayno++;
    });
    $(".fc-event-container").after("<div class='event-container' style='z-index:22'></div>");
    var pickupstart=new Date(),pickupend=new Date();
    if(!pickuplen)pickuplen="02:00";
    pickupstart.setHours(parseInt(pickuptime.substr(0,2)));pickupend.setHours(parseInt(pickuptime.substr(0,2)));
    pickupstart.setMinutes(parseInt(pickuptime.substr(3,2)));pickupend.setMinutes(parseInt(pickuptime.substr(3,2)));
    pickupend.addHours(parseInt(pickuplen.substr(0,2)));
    pickupend.addMinutes(parseInt(pickuplen.substr(3,2)));
    if(!pickup.city)pickup.city=pickup.name;
	var pickupevt={
	_img: "img/staticmap.png",
	_text:"Your Vacation starts Here.",
	_title:pickup.city,
	ispickup:true,
	title:pickup.city,	dontdel:true,	id:"pickupevt",	lat:pickup.lat,	lng:pickup.long,
	latlng:new google.maps.LatLng(pickup.lat,pickup.long),
	start:pickupstart,	end:pickupend
	}
	currentday=1;
	var firstevt="none";
	theEvents[0]['pickupevt']=pickupevt;
	//if(theEvents[0] && theEvents[0][Object.keys(theEvents[0])[0]])firstevt=theEvents[0][Object.keys(theEvents[0])[0]];
	//itin_addplace(pickupevt,"none",firstevt,true);
	for(var i=0;i<dayno;i++){
		var tmpevents=[],ct=0;
		if(theEvents[i])
		$.each(theEvents[i],function(id,evt){
		tmpevents.push(theEvents[i][id]);
		ct++;
		});
		sortarraybykey(tmpevents,"start",true);
		var previd="none";
		currentday=i+1;
		for(var j=0;j<ct;j++){
			if(j>0)previd=tmpevents[j-1].id;
			itin_addplace(tmpevents[j],previd,"none",true);
		}
		
	}
	currentday=1;
	setTimeout(function(){
    for(var i=1;i<=dayno;i++)
    insertAddaPlace(i);
	},1000);
	for(var i=1;i<=24;i++)
    //$(".calendar .fc-minor:nth-of-type("+4*i+") td").css("border-bottom","1px dotted gray");
	$(".calendar .fc-minor:nth-of-type("+4*i+") td").css("border-bottom","0px solid rgb(221, 221, 221)");

    $(".fc-agenda-days~div > div").scroll(function(){
        $(".fc-agenda-days~div > div").scrollTop($(this).scrollTop());    
    });
    $(".calendar thead th").html("&nbsp");
    $(".fc-header").css({"position":"relative","top":ht*4/100+'px'});
	// Try to Include this
	//$(".calendar .fc-minor td").css("border","none");
	$(".calendar").css("width",wt*0.26+'px');
	//$(".calendar ~ .calendar").css("width",wt*0.215+'px');
	$(".calendar:nth-child(even)").css("width",wt*0.215+'px');
	
    //$(".fc-event-container").after("<div class='event-container' style='z-index:22'><div class=\"eventdiv\" style=\"top: 756px;\"><img class=\"img\" src=\"img/staticmap.png\"><div class=\"Pin\">Pin</div><span class=\"time\">9:00-9:30</span><h5 class=\"title\">The Spring Hotel</h5><div class=\"close\">&times;</div><div class=\"text\">undefined</div></div></div>");
}
function itin_addplace(element,prevevent,nextevent,init){
		if(init==undefined)init=false;
		if(prevevent==undefined)prevevent='none';if(nextevent==undefined)nextevent='none';
		var hh=parseInt(currentslot);
		var mm=(currentslot-hh)*100;		
		var events;
		if(init){
			events=element;
			events.start=new Date(element.start);
			events.end=new Date(element.end);
			events.latlng=new google.maps.LatLng(events.lat,events.lng);
			events.title=element.title;
			events.ispickup=element.ispickup;
			if(!element.title)events.title=element.name;
			//console.log(element,'ssssssss');
		}
		else
		events={
			lat    : $(element).data("lat"),
			lng    : $(element).data("lng"),
			latlng : new google.maps.LatLng($(element).data("lat"),$(element).data("lng")),
            title  : $(element).find('.title').html(),
            start  : new Date(yr,mnt,d,hh,mm,0),
            end    : new Date(yr,mnt,d,hh,mm+30,0),
            id     : "......"// to be replaced later by var evtid=getEventId();events.id=evtid;
        };
        if(isOverlapping(events,currentday,true)){
        	$("#backdrop").modal('hide');
        	notify("You cant visit this place at this time as it is overlapping, Please Click on another time to visit this place","error");
        	return false;
        }
        var evtid;
        if(init)evtid=element.id;
        else evtid=getEventId();
        events.id=evtid;

        $("#loader").fadeIn();
        var text,title,imgurl,img;
        if(init){
       	text=element._text;
        title=element.title;
        currenttype=element._type;
        imgurl=element._img;
        img="<img class='img' src='"+element._img+"' />";
        ////console.log(element);
        }else {
         text=$(element).find('.placedata .text').html();
         title=$(element).find('.placedata .title').html();
        currenttype=$(element).find('.placedata .type').html();
         imgurl=$(element).find('.placedata .imgurl').html();
         img="<img class='img' src='"+imgurl+"' />";
        }
        if(currentaddid!="" && currentaddid!=undefined)$("#"+currentaddid).hide();
        
        //$($(".calendar")[currentday-1]).fullCalendar('renderEvent',events,true);

        if(init) var time=formatAMPM(new Date(element.start))+"-"+formatAMPM(new Date(element.end));
    else 		 var time=formatAMPM(events.start)+"-"+formatAMPM(events.end);
        if(init) var starttime=new Date(element.start),endtime=new Date(element.end);
        else	 var starttime=events.start,endtime=events.end;
        var evtheight=parseInt(84*(endtime.getHours()-starttime.getHours()))+Math.ceil(1.4*(endtime.getMinutes()-starttime.getMinutes()));
        var changebutton="";
        if(events.id=='pickupevt')changebutton="<button onclick='getpickup()'>Change</button>";
        var ispickup="";
        if(events.ispickup)ispickup=" data-ispickup='true' ";
        var eventdiv=""+
        "<div class='eventdiv' id='"+evtid+"' data-id='"+evtid+"' "+ispickup+">"+
        "<div class='travel'></div>"+
        "<div class='eventdata' style='min-height:"+evtheight+"' data-id='"+evtid+"' "+ispickup+">"+
        img+
        "<div class='Pin'>Pin</div>"+
        "<span class='time'>"+time+"</span>"+
        "<h5 class='title'>"+title+"</h5>"+
        "<div class='close' onclick='removeEvent("+currentday+",\""+evtid+"\",true)'>&times</div>"+
        "<div class='text'>"+text+changebutton+"</div>"+
        "<div class='handle'></div>"+
        "</div>"+
        "</div>";
        events._img=imgurl;
        events._time=time;
        events._title=title;
        events._text=text;    
        events._type=currenttype;        
        topdist=parseInt(84*starttime.getHours()+Math.ceil(1.4*starttime.getMinutes()));        
        if(eventSeq[evtid]==undefined)eventSeq[evtid]={};
        eventSeq[evtid]["prev"]=(prevevent=="none"?undefined:prevevent);
        eventSeq[evtid]["next"]=(nextevent=="none"?undefined:nextevent);
        /*if(prevevent!="none")
        if(Distances[prevevent]==undefined||Distances[prevevent][evtid]==undefined)
        calcRoute(theEvents[currentday-1][prevevent].latlng,events.latlng,[],{id1:prevevent,id2:evtid},function(data){
        	Distances[data.id1][data.id2]=Math.ceil((mapresult.seconds/60)*1.4);
        });
    	if(nextevent!="none")
    	if(Distances[evtid]==undefined||Distances[evtid][nextevent]==undefined)
        calcRoute(events.latlng,theEvents[currentday-1][nextevent].latlng,[],{id1:evtid,id2:nextevent},function(data){
        	Distances[data.id1][data.id2]=Math.ceil((mapresult.seconds/60)*1.4);
        });*/
        var container=$(".calendar:nth-of-type("+currentday+")").find(".event-container");
        $(container).append(eventdiv);
        var evtbox=$(container).find(".eventdiv:last");
        $(evtbox).css("top",topdist+'px');
        $(evtbox).draggable({
        	appendTo:".calendar:nth-of-type("+currentday+") .event-container",
        	axis:"y",
        	drag:function(event,ui){
        		var dayno=$(this).closest(".calendar").data("dayno");
        		var duration=parseInt($(this).height()/1.4);
        		var evtid=$(this).attr('id');
        		var starttime=new Date();
        		starttime.setHours(0);starttime.setMinutes(0);
        		starttime.addMinutes(parseInt(ui.position.top/1.4));
        		var endtime=new Date(starttime);
        		endtime.addMinutes(duration);
        		var time=formatAMPM(starttime)+"-"+formatAMPM(endtime);
        		$(this).find(".time").html(time);
        		theEvents[dayno-1][evtid].start=starttime;
        		theEvents[dayno-1][evtid].end=endtime;
        	},
        	stop:function( event, ui ){
        		if($(this).data('ispickup')){
        		var starttime=new Date();
        		starttime.setHours(0);starttime.setMinutes(0);
        		starttime.addMinutes(parseInt(ui.position.top/1.4));
        		pickuptime=starttime.toTimeString().substr(0,5);
        		$.cookie("pickuptime",pickuptime);
        		}
        		var dayno=$(this).closest(".calendar").data("dayno");
        		insertAddaPlace(dayno);
        		var evtid=$(this).data('id');
        		var nextid=undefined,previd=undefined;
        		setSequence();
        		if(eventSeq[evtid])nextid=eventSeq[evtid]['next'];
        		if(eventSeq[evtid])previd=eventSeq[evtid]['prev'];
        		//alert(evtid+nextid);
        		if(nextid!=undefined){
        			var nexttop=parseInt($("#"+nextid).css("top"));
        			var currbottom=parseInt($("#"+evtid).css("top"))+parseInt($("#"+evtid).height());
        			var push=currbottom+Distances[evtid][nextid]-nexttop;
        			//alert(push);
        		if(push>0)
        			if(!checkDistance(nextid,false,push)){
        			$(ui.element).animate(ui.originalPosition);
					$(ui.element).animate(ui.originalSize);
					changeTime(evtid);
        			}
        		}
        		if(previd!=undefined){
        			var prevbottom=parseInt($("#"+previd).css("top"))+parseInt($("#"+previd).height());
        			var currtop=parseInt($("#"+evtid).css("top"));
        			var push=prevbottom+Distances[previd][evtid]-currtop;
//        			alert(push);
        		if(push>0)
        			//if(!checkDistance(previd,true,push))	
        			// Not used as Shyam wanted previous events not to be shifted
        			{
        			//console.log(ui);
        			notify("Sorry You cant Visit it at that time as it clashes with previous place/Travel time.Try Again with some other position","error");
         			$(this).animate({'top':ui.originalPosition.top+'px'});
					changeTime(evtid);
        			}
        		}
        	}
        });
        $(evtbox).find(".eventdata").resizable({
        	handles:"s",
        	resize: function( event, ui ) {
        		var dayno=$(this).closest(".calendar").data("dayno");
        		var duration=parseInt(ui.size.height/1.4);
        		var evtid=$(this).data('id');
        		changeTime(evtid);
        		insertAddaPlace(dayno);
        		$(this).closest(".eventdiv").css("min-height",$(this).height());
        	},
        	stop: function( event, ui ) {
        		// Write Code to shift the events after this
        		var dayno=$(this).closest(".calendar").data("dayno");
        		var duration=parseInt(ui.size.height/1.4);
        		if($(this).data('ispickup')){
        			var hrs=(duration/60);
        			var min=(duration%60);
        			pickuplen=(hrs>9?"":"0")+hrs+":"+(min>9?"":"0")+min;
        			$.cookie("pickuplen",pickuplen);
        		}
        		var deltaduration=parseInt(ui.size.height-ui.originalSize.height)/1.4;
        		var deltaht=parseInt(ui.size.height-ui.originalSize.height);
        		var evtid=$(this).data('id');
        		var nextid=undefined;
        		setSequence();
        		if(eventSeq[evtid])nextid=eventSeq[evtid]['next'];
        		//alert(evtid+nextid);
        		if(nextid!=undefined){
        			var nexttop=parseInt($("#"+nextid).css("top"));
        			var currbottom=parseInt($("#"+evtid).css("top"))+parseInt($("#"+evtid).height());
        			var push=currbottom+Distances[evtid][nextid]-nexttop;
        			alert(push);
        		if(push>0)
        			if(!checkDistance(nextid,false,push)){
					$(ui.element).animate({"height":ui.originalSize.height+'px'});
					changeTime(evtid);
        			}
        		}
        		console.log(ui);
        		//Write code to shift events by deltaht
        		insertAddaPlace(dayno);
        	}
        });
	    $("#backdrop").modal("hide");
	    //if(debug)//console.log(ctr++,!theEvents[currentday-1],Object.keys(theEvents[currentday-1]).length==0);
	    if(!theEvents[currentday-1] || Object.keys(theEvents[currentday-1]).length==0){
	    	//if(debug)//console.log(ctr++);
	    	theEvents[currentday-1]={};
	    	theEvents[currentday-1][events.id]=events;
	    	$("#loader").fadeOut();
	    }
	    else{
	    	//if(debug)//console.log(ctr++,prevevent,nextevent);
	    	theEvents[currentday-1][events.id]=events;
	    	var callbackdata={text:"Hello"};
	    	//alert("prevevent is "+prevevent);
	    	////console.log(theEvents[currentday-1][prevevent]);
	    	//alert(prevevent+" "+nextevent);
	    	//alert(events.title+prevevent+nextevent);
	    	if(prevevent!="none")
	    	{
	    		//console.log("Hello from prevevent start");
	    		/*if(nextevent=="none" && 0)
	    		{
	    			if(!init || eventSeq[events.id]==undefined || eventSeq[events.id]['next']==undefined){
	    			var prevtop=parseInt($("#"+prevevent).css("top"));

	    			var prevht=parseInt($("#"+prevevent).height());
	    			var cht=parseInt($("#"+events.id).height());
	    			var ctop=(prevtop+prevht);
	    			$("#"+events.id).css("top",ctop+"px");
	    			var cstart=new Date();
	    			cstart.setHours(0);cstart.setMinutes(0);
	    			cstart.addMinutes(parseInt(ctop/1.4));
	    			events.start=cstart;
	    			cstart.addMinutes(parseInt(cht/1.4));
	    			events.end=cstart;
	    			console.log(events);
	    			}
	    		}*/
        	callbackdata.previd=prevevent;
        	callbackdata.currid=events.id;
        	callbackdata.prevevent=prevevent;
        	callbackdata.nextevent=nextevent;
        	calcRoute(theEvents[currentday-1][prevevent].latlng,events.latlng,[],callbackdata,function(data){
      //alert("YO the distance is "+mapresult.distance+" it takes "+mapresult.timetext+" : "+data.text);
	      		var mindist=Math.ceil((mapresult.seconds/60)*1.4);
        		var mintop=parseInt($("#"+data.previd).css("top"))+mindist+$("#"+data.previd).height();
        		var currtop=parseInt($("#"+data.currid).css("top"));
        		var top=(currtop>mintop?currtop:mintop);
        		if(Distances[data.previd]==undefined)Distances[data.previd]={};
        		Distances[data.previd][data.currid]=mindist;
        		if(eventSeq[data.currid]==undefined)eventSeq[data.currid]={};
        		eventSeq[data.currid]["prev"]=data.previd;
        		if(eventSeq[data.previd]==undefined)eventSeq[data.previd]={};
				eventSeq[data.previd]["next"]=data.currid;
				if(eventSeq[data.currid]['prev']==undefined)
				eventSeq[data.currid]['prev']=eventSeq[eventSeq[data.currid]['next']]['prev2'];
				//console.log("Connecting "+data.previd+" & "+data.currid);
				//alert(top-currtop);
				if(data.nextevent=="none" && (eventSeq[data.currid]==undefined || eventSeq[data.currid]["next"]==undefined) && (top+parseInt($("#"+data.currid).height()))<2016)        		
        		$("#"+data.currid).animate({"top":top+'px'},function(){
        		// alert("This has Previous, and top is "+top+" time is "+parseInt(top/84)+":"+parseInt((top%84)/1.4));
        			changeTime(data.currid);
        			if(top!=currtop)
        			$("#"+data.currid).find(".travel").html(mapresult.timetext);
        		});
				else {
					tempflag=0;
					// Write Code here to call calcroute with callback doing the checkDistance
					// This is to ensure that the Distances is known
					var nextid=eventSeq[evtid]["next"],previd=eventSeq[evtid]["prev"];
					var currlatlng=theEvents[currentday-1][events.id].latlng;
					var nextlatlng=theEvents[currentday-1][nextid].latlng,prevlatlng=theEvents[currentday-1][previd].latlng;
					var calldata={
						currid:events.id,prev:false,push:top-currtop,
						currll:currlatlng,prevll:prevlatlng,
						previd:previd,nextid:nextid,
						nextcheck:true
					};
					calcRoute(currlatlng,nextlatlng,[],calldata,function(data){
						//alert("OK for "+data.currid+" "+data.prev+" "+data.push);
						//console.log(data);
						if(checkDistance(data.nextid,false,data.push)){
							tempflag=1;
						
						}
						if(tempflag && data.nextcheck){
							data.nextcheck=false;data.prev=true;
						calcRoute(data.prevll,data.currll,[],data,function(data){
						if(checkDistance(data.previd,true,data.push))tempflag=1;
						else{
							notify("Sorry It is not possible to visit within this slot, please move events and try again","error");
							removeEvent(currentday,data.currid,false);
							}
					},{id1:events.previd,id2:data.currid});
							}
						else
						{
					notify("Sorry It is not possible to visit within this slot, please move events and try again","error");
					removeEvent(currentday,data.currid,false);
					}
					},{id1:events.id,id2:nextid});
					//if(checkDistance(data.currid,false,top-currtop))tempflag=1;

					//if(checkDistance(data.currid,true,top-currtop))tempflag=1;
				}

        		$("#loader").fadeOut();
        		insertAddaPlace(currentday);
        		//console.log("Hello from prevevent end");
        	});
        	}
        	else if(nextevent!="none"){
        		//console.log("Hello from nextevent start");
        		if(prevevent=="none")
	    		{
	    			if(!init || eventSeq[events.id]==undefined || eventSeq[events.id]['prev']==undefined){
	    			var nextstart=new Date(theEvents[currentday-1][nextevent].start);
	    			var nexttop=Math.ceil(nextstart.getHours()*84+nextstart.getMinutes()*1.4);
	    			var cht=parseInt($("#"+events.id).height());
	    			var ctop=(nexttop+cht);
	    			//alert(nextstart,nexttop,cht,ctop);
	    			$("#"+events.id).css("top",ctop+"px");
	    			var cstart=new Date();
	    			cstart.setHours(0);cstart.setMinutes(0);
	    			cstart.addMinutes(parseInt(ctop/1.4));
	    			events.start=cstart;
	    			cstart.addMinutes(parseInt(cht/1.4));
	    			events.end=cstart;
	    			}
	    		}
        	callbackdata.nextid=nextevent;
        	callbackdata.currid=events.id;
        	callbackdata.prevevent=prevevent;
        	callbackdata.nextevent=nextevent;
        	calcRoute(events.latlng,theEvents[currentday-1][nextevent].latlng,[],callbackdata,function(data){
      //alert("YO the distance is "+mapresult.distance+" it takes "+mapresult.timetext+" : "+data.text);
      			var mindist=Math.ceil((mapresult.seconds/60)*1.4);
        var mintop=parseInt($("#"+data.nextid).css("top"))-mindist-$("#"+data.currid).height();
        		var currtop=parseInt($("#"+data.currid).css("top"));
        		var top=(currtop<mintop?currtop:mintop);
        		//console.log(mintop+" "+currtop+" "+mindist);
        		if(Distances[data.currid]==undefined)Distances[data.currid]={};
        		Distances[data.currid][data.nextid]=mindist;
        		if(eventSeq[data.currid]==undefined)eventSeq[data.currid]={};
        		eventSeq[data.currid]["next"]=data.nextid;
        		if(eventSeq[data.nextid]==undefined)eventSeq[data.nextid]={};
				eventSeq[data.nextid]["prev"]=data.currid;
				if(eventSeq[data.currid]['next']==undefined)
				eventSeq[data.currid]['next']=eventSeq[eventSeq[data.currid]['prev']]['next2'];
				//console.log("Connecting "+data.currid+" & "+data.nextid);
				//alert(top-currtop);
        		if(data.prevevent=="none" && (eventSeq[data.currid]==undefined || eventSeq[data.currid]["prev"]==undefined) && top>0)
        		$("#"+data.currid).animate({"top":top+'px'},function(){
        			//alert("ssssssssssssssssss");
        			//alert("This has Next, and top is "+top+" time is "+parseInt(top/84)+":"+":"+parseInt((top%84)/1.4));
        			changeTime(data.currid);
        			if(top!=currtop)
        			$("#"+data.nextid).find(".travel").html(mapresult.timetext);
        		});
				else //if(!checkDistance(data.currid,true,top-currtop) && !checkDistance(data.currid,false,top-currtop))
				{
					tempflag=0;
					var nextid=eventSeq[evtid]["next"],previd=eventSeq[evtid]["prev"];
					var currlatlng=theEvents[currentday-1][events.id].latlng;
					var nextlatlng=theEvents[currentday-1][nextid].latlng,prevlatlng=theEvents[currentday-1][previd].latlng;
					var calldata={
						currid:events.id,prev:false,push:top-currtop,
						currll:currlatlng,prevll:prevlatlng,nextll:nextlatlng,
						previd:previd,nextid:nextid,
						nextcheck:true
					};
					calcRoute(prevlatlng,currlatlng,[],calldata,function(data){
						//alert("OK for "+data.currid+" "+data.prev+" "+data.push);
						//console.log(data);
						if(checkDistance(data.previd,true,data.push)){
							tempflag=1;
						}
						if(tempflag && data.nextcheck){
							data.nextcheck=false;data.prev=true;
						calcRoute(data.currll,data.nextll,[],data,function(data){
						if(checkDistance(data.nextid,false,data.push))tempflag=1;
						else{
							notify("Sorry It is not possible to visit within this slot, please move events and try again","error");
							removeEvent(currentday,data.currid,false);
							}
					},{id1:events.currid,id2:data.nextid});
							}
						else
						{
					notify("Sorry It is not possible to visit within this slot, please move events and try again","error");
					removeEvent(currentday,data.currid,false);
					}
					},{id1:previd,id2:events.id});
					//if(checkDistance(data.currid,false,top-currtop))tempflag=1;

					//if(checkDistance(data.currid,true,top-currtop))tempflag=1;
				}
        		$("#loader").fadeOut();
        		insertAddaPlace(currentday);
        	});

        	}else{
        		$("#loader").fadeOut();
        		insertAddaPlace(currentday);        		
        	}
        }
        setcookies();
        //setcookie_event(events);
        insertAddaPlace(currentday);
        setSequence(currentday);
}
function setSequence(dayno){
	if(dayno==undefined)dayno=currentday;
	tempevents=[];
	console.log(theEvents[dayno-1]);
	if(theEvents[dayno-1])
	$.each(theEvents[dayno-1],function(id,evt){
		tempevents.push(theEvents[dayno-1][id]);	
	});
	sortarraybykey(tempevents,"start",true);
	console.log(tempevents);
	for(var i=0;i<tempevents.length-1;i++){
		eventSeq[tempevents[i].id]['next']=tempevents[i+1].id;
		eventSeq[tempevents[i+1].id]['prev']=tempevents[i].id;
		var data={id1:tempevents[i].id,id2:tempevents[i+1].id};
		var ll1=new google.maps.LatLng(tempevents[i].lat,tempevents[i].lng);
		var ll2=new google.maps.LatLng(tempevents[i+1].lat,tempevents[i].lng);
		calcRoute(ll1,ll2,[],data,
		function(data){
			$("#"+data.id2).find(".travel").html(mapresult.timetext);
		},{id1:tempevents[i].id,id2:tempevents[i+1].id})
	}
}
function checkDistance(evtid,prev,push){	// Returns true on adjusting it and if possible to shift
	if(prev==undefined)prev=false;			// Recursively checks its previous or next events
	if(push==undefined)push=0;
	//if(eventSeq[evtid]==undefined)return true;
	//console.log("Hello from checkDistance");
	if(prev){	// Check if event collides with travel from previous event
		var previd=eventSeq[evtid]["prev"];
		
		// Temporarily Not used as Shyam Wanted the code not to shift previous events.
		

		//alert("in prev for "+theEvents[currentday-1][evtid].title);
		//console.log(6);
		//if(previd==undefined)previd=eventSeq[evtid]["prev2"];
		if(previd==undefined){
			var newtop=parseInt($("#"+evtid).css("top"))-push;
			if(newtop<0)return false;			
			notify("Moving "+theEvents[currentday-1][evtid].title+" up in undefined case "+push);
			$("#"+evtid).animate({"top":newtop+'px'},function(){
	        			changeTime(evtid);
	        });
			return true;
		}
		//console.log(7);
		var currid=evtid;
		var prevtop=parseInt($("#"+previd).css("top")),prevbottom=prevtop+parseInt($("#"+previd).height());
		var currtop=parseInt($("#"+currid).css("top")),currbottom=currtop+parseInt($("#"+currid).height());
		//console.log(8);
		var newtop=parseInt($("#"+evtid).css("top"))-push;
		theEvents[currentday-1][evtid].newtop=newtop;
				if(newtop<0)return false;
		if(prevbottom+Distances[previd][currid]<=currtop-push){
			//console.log(9);
				//eventSeq[previd]['next']=currid;
				//eventSeq[currid]['prev']=previd;
				//if(eventSeq[currid]['next']==undefined)
				//eventSeq[currid]['next']=eventSeq[eventSeq[currid]['prev']]['next2'];
				//alert("Connecting "+previd+" & "+currid);
				var newtop=theEvents[currentday-1][evtid].newtop;
				notify("Moving "+theEvents[currentday-1][evtid].title+" up ");
				$("#"+evtid).animate({"top":newtop+'px'},function(){
		        			changeTime(evtid);
		        });
				return true;
			}
		else if( checkDistance(previd,true,prevbottom+Distances[previd][currid]-newtop)){
			//console.log(10);
			notify("Moving "+theEvents[currentday-1][evtid].title+" up ");
			$("#"+evtid).animate({"top":newtop+'px'},function(){
	        			changeTime(evtid);
	        });
	        //eventSeq[previd]['next']=currid;
			//eventSeq[currid]['prev']=previd;
			//if(eventSeq[currid]['next']==undefined)
			//eventSeq[currid]['next']=eventSeq[eventSeq[currid]['prev']]['next2'];
			//alert("Connecting "+previd+" & "+currid);
	        return true;
		}else return false;
	}
	else{	// Check if event collides with travel to next event
		//alert("Checking next");
		alert("in next for "+theEvents[currentday-1][evtid].title);
		var nextid=undefined;
		if(eventSeq[evtid])
		nextid=eventSeq[evtid]["next"];
		//if(nextid==undefined)nextid=eventSeq[evtid]["next2"];
		//console.log(1);
		if(nextid==undefined){
			alert("I wont alert now :P");
			var newtop=parseInt($("#"+evtid).css("top"))+push;
			if(newtop+parseInt($("#"+evtid).height())>=2016)return false;
			notify("Moving "+theEvents[currentday-1][evtid].title+" down ");
			$("#"+evtid).animate({"top":newtop+'px'},function(){
	        			changeTime(evtid);
	        });
			return true;
		}
		//console.log(2);
		var currid=evtid;
		var nexttop=parseInt($("#"+nextid).css("top")),nextbottom=nexttop+parseInt($("#"+nextid).height());
		var currtop=parseInt($("#"+currid).css("top")),currbottom=currtop+parseInt($("#"+currid).height());
		//console.log(Distances,currid,nextid);
		//console.log(3);
		var newtop=parseInt($("#"+evtid).css("top"))+push;
				if(newtop+parseInt($("#"+evtid).height())>=2016)return false;
		if( currbottom+Distances[currid][nextid]+push<nexttop ){
			//console.log(4);
				//eventSeq[currid]['next']=nextid;
				//eventSeq[nextid]['prev']=currid;
				//if(eventSeq[currid]['prev']==undefined)
				//eventSeq[currid]['prev']=eventSeq[eventSeq[currid]['next']]['prev2'];
				//alert("Connecting "+currid+" & "+nextid);
				notify("Moving "+theEvents[currentday-1][evtid].title+" down ");
				$("#"+evtid).animate({"top":newtop+'px'},function(){
		        			changeTime(evtid);
		        });
				return true;
			}
		else if( checkDistance(nextid,false,currbottom+Distances[currid][nextid]+push-nexttop)){
			//console.log(5);
			
			notify("Moving "+theEvents[currentday-1][nextid].title+" down ");
			$("#"+evtid).animate({"top":newtop+'px'},function(){
	        			changeTime(evtid);
	        });
			//eventSeq[currid]['next']=nextid;
			//eventSeq[nextid]['prev']=currid;
			//if(eventSeq[currid]['prev']==undefined)
			//eventSeq[currid]['prev']=eventSeq[eventSeq[currid]['next']]['prev2'];
			//alert("Connecting "+currid+" & "+nextid);
	        return true;
		}else return false;
	}
}
function changeTime(evtid){
				var dayno=$("#"+evtid).closest(".calendar").data("dayno");
        		var starttime=new Date();
        		starttime.setHours(0);starttime.setMinutes(0);
        		starttime.addMinutes(parseInt(parseInt($("#"+evtid).css("top"))/1.4));
        		var endtime=new Date(starttime);
        		var duration=parseInt($("#"+evtid).height()/1.4);
        		endtime.addMinutes(duration);
        		//alert("for "+theEvents[dayno-1][evtid].title+" "+starttime+" "+endtime+" "+duration);
        		var time=formatAMPM(starttime)+"-"+formatAMPM(endtime);
        		$("#"+evtid).find(".time").html(time);
        		theEvents[dayno-1][evtid].start=starttime;
        		theEvents[dayno-1][evtid].end=endtime;

}
$( window ).unload(function() {
  setdb();
  setcookies();
});
function itin_initialize(){
	if(theEvents)
	$.each(theEvents,function(dayno,daylist){
	 if(daylist)
	 $.each(daylist,function(idx,events){
        if(!isOverlapping(events,currentday,true))
        	if(events){
        var text=events._text;
        var title=events._title;
        currenttype=events._type;
        var img="<img class='img' src='"+events._img+"' />";
        var time=events._time;
        var starttime=events.start;
        var eventdiv=""+
        "<div class='eventdiv'>"+
        "<div class='eventdata'>"+
        img+
        "<div class='Pin'>Pin</div>"+
        "<span class='time'>"+time+"</span>"+
        "<h5 class='title'>"+title+"</h5>"+
        "<div class='close'>&times</div>"+
        "<div class='text'>"+text+"</div>"+
        "<div class='handle'></div>"+
        "</div>"+
        "</div>";
        topdist=parseInt(84*starttime.getHours()+Math.ceil(1.4*starttime.getMinutes()));
        var container=$(".calendar:nth-of-type("+currentday+")").find(".event-container");
        $(container).append(eventdiv);
        var evtbox=$(container).find(".eventdiv:last");
        $(evtbox).css("top",topdist+'px');
        alert("Get code from above function");
        /*
        //        GET FROM ABOVE FUNCTION
        $(evtbox).draggable({appendTo:".calendar:nth-of-type("+currentday+") .event-container"}).resizable({
        	handles:"s",
        	resize: function( event, ui ) {
        		// Write Code to shift the events after this
        		var dayno=$(this).closest(".calendar").data("dayno");
        		insertAddaPlace(dayno);
        	}
        });*/
        insertAddaPlace(currentday);
    	}
    });
 });
}
function getpickup(){
	$("#itincontainer").html("<br><br><br>");
$("#itincontainer").append("<input id='pac-input' placeholder='Enter Pick Up Point for Vacation' style='position:fixed;top:60%;right:25%;z-index:3;height:6%;border-radius:5px;width:18%' />");
$("#itincontainer").append("<input id='pac-select' type='button' class='hidden btn btn-primary' value='Select' style='position:fixed;top:60%;right:20%;z-index:3;height:6%;border-radius:5px;width:5%' />");
		$("#map-canvas").hide();
		$("#map-canvas").removeClass('hidden');//append("<div id='map_canvas' style='height:50%;width:100%;'></div>");
		$("#map-canvas").fadeIn("slow");
	var lat = 13.0839, long = 80.2700 ,mapzoom = 5;
	markersArray=[];
	map = new google.maps.Map(document.getElementById('map-canvas'), {
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
				lat = -33.8688;
        		lng = 151.2195;
        		latlng = new google.maps.LatLng(lat, lng),
        	    image = 'http://www.google.com/intl/en_us/mapfiles/ms/micons/blue-dot.png';
	marker = new google.maps.Marker({
            position: latlng,
            map: map,
            icon: image
     	    });
	var input = document.getElementById("pac-input");
			var onlycities=false;
			var autocompletetypes=["geocode"];
			if(onlycities==true)autocompletetypes=["(cities)"];
     	    autocomplete = new google.maps.places.Autocomplete(input, {
		        types: autocompletetypes,
		        componentRestrictions: {country: "in"}
		    });          
		    
		    autocomplete.bindTo('bounds', map); 
		    var infowindow = new google.maps.InfoWindow(); 
		 
		    google.maps.event.addListener(autocomplete, 'place_changed', function() {
		        infowindow.close();
		        var place = autocomplete.getPlace();
		        console.log(place);
		        if (place.geometry.viewport) {
		            map.fitBounds(place.geometry.viewport);
		        } else {
		            map.setCenter(place.geometry.location);
		            map.setZoom(17);  
		        }
		        moveMarker(place.name, place.geometry.location,place);
		    });  
		    
		    $(input).focusin(function () {
		        $("#pac-input").keypress(function (e) {
		            if (e.which == 13) {
		            	//$(this).val($(".pac-container .pac-item:first").text());
		            	//google.maps.event.trigger(autocomplete, 'place_changed');
		            	autocompleteAux(input,infowindow);
		            }
		        });
		        $("#pac-select").click(function(){
		        	//google.maps.event.trigger(autocomplete, 'place_changed');
		       	$(".pac-container").show();
		       	$(".pac-container .pac-item:first").trigger('click');		        
			    var e = $.Event('keypress', { keyCode: 13,which: 13 } );
			    $("#pac-input").trigger( e );
		        });
		    });
}
function autocompleteAux(input,infowindow){
	//togglesearch(true);
		                infowindow.close();
		                var firstResult = $(".pac-container .pac-item:first").text();     
		                var geocoder = new google.maps.Geocoder();
		                geocoder.geocode({"address":firstResult }, function(results, status) {
		                    if (status == google.maps.GeocoderStatus.OK) {
		                        var lat = results[0].geometry.location.lat(),
		                            lng = results[0].geometry.location.lng(),
		                            placeName = results[0].address_components[0].long_name,
		                            latlng = new google.maps.LatLng(lat, lng);
		         				map.setZoom(10);               	
		                        moveMarker(placeName, latlng,results[0]);
		                        $(input).val(firstResult);
		                    }
		                });
}
function moveMarker(placeName, latlng,place){
//		     	console.log(place);
		        marker.setIcon(image);
		        marker.setPosition(latlng);
		        var citystring="Start Here";		        
var attribs='{"name":"'+place.name+'","city":"'+placeName+'","reference":"'+place.reference+'","lat":"'+place.geometry.location.lat()+'","long":"'+place.geometry.location.lng()+'"}';
var selectbutton="<button class='btn btn-info' onclick=\'choose_pickup("+attribs+")\' class='choosecity'>"+citystring+"</button></a>";
			    var address = '';
			    if (place.address_components) {
			      address = [
			        (place.address_components[0] && place.address_components[0].short_name || ''),
			        (place.address_components[1] && place.address_components[1].short_name || ''),
			        (place.address_components[2] && place.address_components[2].short_name || '')
			      ].join(' ');
			    }
			    console.log(place);
			    var text="";
			    if(place.icon)text+="<br><img style='float:left' src='"+place.icon+"' />";
			    if(place.photos)text+="<br><img style='float:right;height:100px;width:100px' src='"+place.photos[1].getUrl({'maxWidth': 120, 'maxHeight': 100})+"' />";
			    if(place.formatted_phone_number)text+="<br>Phone:"+place.formatted_phone_number;
			    if(place.website)text+="<br>Website:<a target='__blank' href='"+place.website+"'>"+place.name+"</a>";
			    var infowindow=new google.maps.InfoWindow();
			    infowindow.setContent('<div><strong>' + placeName + '</strong><br>' + address+text+'<br>'+selectbutton);
			    infowindow.open(map, marker);
			    markersArray.push(marker);
		     }
function choose_pickup(city){
				$.cookie("pickup", JSON.stringify(city),{ expires: expDate });
				$("#map-canvas").addClass("hidden");
				var text="";
				text+="<h3>At what Time do you arrive at "+pickup.name+" ? And How Long ??</h3>";
				text+="<form onsubmit='javascript:event.returnValue=false;return false;'>";
				text+="Arrive at <input id='pickuptime' type='text' style='margin-left:17px' required placeholder='click here' class='btn btn-primary timepick' value='"+(pickuptime!=undefined?pickuptime:"")+"'/>(Time You Reach)<br><br>";
				text+="Buffer Time <input id='pickuplen' type='text' placeholder='click here' required class='btn btn-primary timepick' value='"+(pickuplen!=undefined?pickuplen:"")+"'/>(hours:minutes you might be delayed)<br><br>";
				text+="<input id='pickupsubmit' onclick='pickupinit()' type='submit' value='Proceed' class='btn btn-success' /></form>";
				$("#backdrop .contents").html(text);
				$(".timepick").timepicker();
				$("#backdrop .close").addClass("hidden");
				$("#backdrop").modal({show:true,backdrop:'static',keyboard:false});
				//initcalendar();
			}		     