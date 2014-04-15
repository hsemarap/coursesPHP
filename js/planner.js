/*
//To do
shift events based on distance
Save Trip.
Share Trip.
Services Listing
Service Confirmation
If possible ( After everything, add php page to ajax new places for a given time slot)
*/
Events={};
Date.prototype.addHours= function(h){
    this.setHours(this.getHours()+h);
    return this;
}
Date.prototype.addMinutes= function(m){
    this.setMinutes(this.getMinutes()+m);
    return this;
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
  hours+=5;
  minutes+=30;
  hours+=minutes/60;
  minutes%=60;
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
var mapresult={};
if(theEvents==null)theEvents={};
else	theEvents=JSON.parse(theEvents);
$.each(theEvents,function(idx1,dayevents){
	if(dayevents)
	$.each(dayevents,function(idx2,dayevent){
		theEvents[idx1][idx2]['start_']=theEvents[idx1][idx2]['start']=new Date(dayevent['startstr']);
		theEvents[idx1][idx2]['end_']=theEvents[idx1][idx2]['end']=new Date(dayevent['endstr']);
	})
});
if(theEventsData==null)theEventsData={};
else	theEventsData=JSON.parse(theEventsData);

function checkevents(){
	var no=1;
	//console.log(theEvents);
	$(theEvents).each(function(id1,events){
		//console.log(theEvents[id1]);
		if(events)
		$(events).each(function(id2,evt){
			if(evt){
				//console.log(evt);
			//evt=theEvents[id1][id2];
			var sm=evt.start.getMinutes();
			var em=evt.end.getMinutes();
			if(sm>0 && sm<15)evt.start.setMinutes(15);if(sm>15 && sm<30)evt.start.setMinutes(30);if(sm>30 && sm<45)evt.start.setMinutes(45);if(sm>45 && sm<60)evt.start.setMinutes(60);
			if(em>0 && em<15)evt.end.setMinutes(15);if(em>15 && em<30)evt.end.setMinutes(30);if(em>30 && em<45)evt.end.setMinutes(45);if(em>45 && em<60)evt.end.setMinutes(60);
			setcookies_events(no);
			}
		});
		no++;
	});
}
var noofdays=5,currday=1;
$(function(){
mapstart=false;

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
    computeTotalDistance(directionsDisplay.directions,directionsDisplay.customcallback,directionsDisplay.endidx);
  });
}
function calcRoute(origin,destination,waypoints,endidx,callback) {
  if(waypoints==undefined)waypoints=[];
  var request = {
    origin: origin,//"Sydney, NSW",
    destination: destination,//"Sydney, NSW",
    waypoints:waypoints,
    //[{location: "Bourke, NSW"}, {location: "Broken Hill, NSW"}],
    travelMode: google.maps.TravelMode.DRIVING
  };
  directionsService.customcallback=callback;
  directionsService.endidx=endidx;
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.customcallback=directionsService.customcallback;
      directionsDisplay.endidx=directionsService.endidx
      directionsDisplay.setDirections(response);
    }
  });
}

function computeTotalDistance(result,callback,endidx) {
  var total = 0,time=0;
  var myroute = result.routes[0];
  //console.log(myroute);
  for (i = 0; i < myroute.legs.length; i++) {
    total += myroute.legs[i].distance.value;
    time  += myroute.legs[i].duration.value;
  }
  total = total / 1000.
  mapresult.distance=total;
  mapresult.seconds=time;
  mapresult.timetext=myroute.legs[0].duration.text;
  if(callback!=undefined)callback(endidx);
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
	        for(i in theList[day][type]){
	        	var placetitle=theList[day][type][i].title;
	        	var placetext=theList[day][type][i].text;
	        	var placesubtype=theList[day][type][i].subtype;
	        	if(placetext==undefined)placetext=placetitle+" is a good Place for "+placesubtype;
	        	show+='<li class="modaltypelist placetoadd" data-lat="'+theList[day][type][i].lat+'" data-lng="'+theList[day][type][i].long+'">\
	        			<span class="modaltitle">'+placetitle+'</span><br>\
	        			<span class="type">'+placesubtype+'</span>\
	        			<span class="title hidden">\
	        			<h5 style="display:inline;float:right">'+placetitle+'</h5>\
	        			<h6>'+placesubtype+'</h6>\
	        			<p>'+placetext+'</p>\
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
function setcookies_events(day){
	var i=1;
	if(day==undefined)
	$(".calendar").each(function(){
		var dayevents=$(this).fullCalendar('clientEvents');
		var dayevent=[],dd;
		//console.log(dayevents);
		var j=0;
		$(dayevents).each(function(){
			dd={};
		dd._id=dayevents[j]._id;			
		dd.lat=dayevents[j].lat;
		dd.lng=dayevents[j].lng;
		dd.title=dayevents[j].title;
		dd.allDay=dayevents[j].allDay;
		dd.start=dd.startstr=dayevents[j].start.toUTCString()+"+0530";
		dd.end=dd.endstr=dayevents[j].end.toUTCString()+"+0530";
		dayevent.push(dd);
		j++;
		});
		theEvents[i-1]=dayevent;
		i++;
	});
	else{
		var dayevents=$($(".calendar")[day-1]).fullCalendar('clientEvents');
		var j=0;
		var dayevent=[],dd={};
		$(dayevents).each(function(){
			dd={};
		dd._id=dayevents[j]._id;				
		dd.lat=dayevents[j].lat;
		dd.lng=dayevents[j].lng;
		dd.title=dayevents[j].title;
		dd.allDay=dayevents[j].allDay;
		dd.start=dd.startstr=dayevents[j].start.toISOString();
		dd.end=dd.endstr=dayevents[j].end.toISOString();
		//dayevents[j].startstr=dayevents[j].start.toISOString();
		//dayevents[j].endstr=dayevents[j].end.toISOString();
		dayevent.push(dd);
		j++;
		});
		theEvents[day-1]=dayevent;
	}
	$.cookie("theEvents",JSON.stringify(theEvents));
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
	$(theEvents).each(function(id,evtarr){
	if(dayno==undefined || dayno-1==id){
		sortarraybykey(theEvents[id],"start",true,1);
		for(var i=1;i<theEvents[id].length;i++){
			var origin=new google.maps.LatLng(theEvents[id][i-1].lat,theEvents[id][i-1].lng);
			var destination=new google.maps.LatLng(theEvents[id][i].lat,theEvents[id][i].lng);
			//mapresult.Events=Events;
			mapresult.starttitle=$(theEvents[id][i-1].title).html();
			mapresult.start=theEvents[id][i-1];
			mapresult.endtitle=$(theEvents[id][i].title).html();
			mapresult.end=theEvents[id][i];
			mapresult.endno=i;
			calcRoute(origin,destination,[],i,function(idx){
				//alert("Time From "+mapresult.starttitle+" to "+mapresult.endtitle+" is "+mapresult.timetext);
				var time=(mapresult.seconds)/60;
				var start=mapresult.start,end=mapresult.end;
				//console.log(start);
				//console.log(end);
				time=rounduptime(time);
				var mintime=new Date(start.end);
				mintime.addMinutes(time);
				//console.log(mintime>end.start);
				//alert(mintime+end.start+(mintime>end.start));
				var top=parseInt(1.4*(mintime.getHours()*60+mintime.getMinutes()));
				var thistop=parseInt($($($(".calendar")[dayno-1]).find(".fc-event-container .fc-event-start")[idx]).css("top"));
				var thisht=parseInt($($($(".calendar")[dayno-1]).find(".fc-event-container .fc-event-start")[idx]).css("height"));
		var thisevt=$($($(".calendar")[dayno-1]).find(".fc-event-container .fc-event-start")[idx]).detach();
				var maxtop=(top>thistop?top:thistop);
				
				var newstart=getTimeFromHeight(maxtop);
				var newend=getTimeFromHeight(maxtop+thisht);
				var timetext=newstart+"-"+newend;
				//alert(timetext);
				//alert(thistop+" "+top);
				
				//timetext=formatAMPM(start.start.addMinutes((maxtop-thistop)/1.4))+" - "+formatAMPM(start.start.addMinutes((maxtop-thistop-thisht)/1.4));
				top=(top>thistop?top:thistop);
				$($(".calendar")[dayno-1]).find(".fc-event-container").append(thisevt);
				//if(mintime>end.start || top>thistop){
					//alert("Hey! You cant be there at this small time "+end._id);
					$($($(".calendar")[dayno-1]).find(".fc-event-container .fc-event-start")[idx]).css("top",top+'px');
					$($($(".calendar")[dayno-1]).find(".fc-event-container .fc-event-start .fc-event-time")[idx]).html(timetext);
					//removeEvent(id+1,end._id,false);
					//end.end=new Date(mintime);
					//end.overlapok=true;
					//theEvents[dayno-1][mapresult.endno].start=new Date(mintime);
					//$($(".calendar")[dayno-1]).fullCalendar('renderEvent',end);
					//setTimeout(function(){initcalendar();},100);
				//}	else $($(".calendar")[dayno-1]).find(".fc-event-container .fc-event-start").css("top",thistop+'px');
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
	var dayno=1;	
	$('.calendar').each(function(){
    	$(this).fullCalendar({
        defaultView:"agendaDay",
        editable: true,
        firstHour:8,
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

        eventAfterRender:function(evt,element,view){
        	var dayno=$(element).closest(".calendar").data("dayno");
        	insertAddaPlace(dayno);
			element.find('.fc-event-title').html(element.find('.fc-event-title').text());
			var duration=((evt.end-evt.start)/60000);
			if(duration<30){
			//alert('yo');
			$(element).find('.fc-event-time').html($(evt.title,'h5').html());
			$(element).find('.fc-event-time').append("<span onclick=\"removeEvent("+dayno+",'"+evt._id+"',true)\" class='pull-right  close'>&times;</span>");
			}else{
			$(element).find('.fc-event-title *').show();
			$(element).find('.fc-event-title h5').append("<span onclick=\"removeEvent("+dayno+",'"+evt._id+"',true)\" class='pull-right  close'>&times;</span>");
			}       		
//			element.find('.fc-event-title').html(element.find('.fc-event-title').text());       		
        },
        dayClick: function(d) { 
        	/*
        		var hh=d.getHours();
        		var mm=d.getMinutes();
        		var dayno=$(this).closest(".calendar").data("dayno");
        		currentday=dayno;
				currentslot=hh+"."+mm;
				$("#backdrop").modal("hide");	
				showtrip(false,dayno);
				$("#backdrop").modal("show");
				$("#backdroptitle").html("Add a Place");
			*/				// Temply dont use this else, user might click time while travelling
        		///////////////////// Can Use this to add New places :)))))
		},
		eventDrop: function(event, dayDelta, minuteDelta, allDay, revertFunc) {
			var dayno=$(this).closest(".calendar").data("dayno");
			if (isOverlapping(event,dayno)) {revertFunc();}
			else setcookies_events(dayno);
			insertAddaPlace(dayno);
		},
		eventResize: function(event, dayDelta, minuteDelta, revertFunc) {
			var dayno=$(this).closest(".calendar").data("dayno");
			if (isOverlapping(event,dayno)) {revertFunc();}			
			else setcookies_events(dayno);
			insertAddaPlace(dayno);
		},
        events:theEvents[dayno-1]
    	});

		//     To Do
		//     Check if Cookies are Enabled, if not ask them to 
		//	   Check if JS is enabled, else ask em to

		insertAddaPlace(dayno);
    	dayno++;
    });
}
function itin_addplace(element){
		var hh=parseInt(currentslot);
		var mm=(currentslot-hh)*100;		
		var events={
			lat    : $(element).data("lat"),
			lng    : $(element).data("lng"),
            title  : $(element).find('.title').html(),
            start  : new Date(yr,mnt,d,hh,mm,0),
            end  : new Date(yr,mnt,d,hh,mm+30,0),
            allDay : false // will make the time show
        };
        if(isOverlapping(events,currentday,true)){
        	$("#backdrop").modal('hide');
        	notify("You cant visit this place at this time as it is overlapping, Please Click on another time to visit this place","error");
        	return false;
        }
        var text=$(element).data('text');
        currenttype=$(element).find('.type').html();
        currentevent="<div class='eventdiv'>\
        <h6>"+(text!=undefined?text:"")+"</h6>\
        </div>";
        if(currentaddid!="")$("#"+currentaddid).hide();
        tmp=events;
        //$(".calendar:nth-child("+currentday+")").fullCalendar('renderEvent',events);
        $($(".calendar")[currentday-1]).fullCalendar('renderEvent',events,true);
        $("#backdrop").modal("hide");
        setcookies_events(currentday);
        insertAddaPlace(currentday);
}