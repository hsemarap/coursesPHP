//		The data from db is got and kept at start plan.php 
var expDate = new Date(); // Exp time of cookies stored
expDate.setTime(expDate.getTime() + (24 * 60 * 60 * 1000)); 
currentmarkers=[];curr_addday=1;
function zoomToMarkers(markers){
//  Create a new viewpoint bound
var bounds = new google.maps.LatLngBounds ();
//  Go through each...
for (var i = 0, LtLgLen = markers.length; i < LtLgLen; i++) {
  //  And increase the bounds to take this point
  bounds.extend (markers[i].geometry.location);
}
//  Fit these bounds to the map
map.fitBounds (bounds);
}
function bouncemarker(linkid,off){
	//alert(linkid);
	for(var i=0;i<markersArray.length;i++){
	if(markersArray[i].linkid==linkid)
	if(off)markersArray[i].setAnimation(null);
	else markersArray[i].setAnimation(google.maps.Animation.BOUNCE);
	}
}
function showlist(){
	var html='';
	for(var i=0;i<currentmarkers.length;i++)
	if(map.getBounds().contains(currentmarkers[i].geometry.location)){
		html+="<span id='"+currentmarkers[i].linkid+"' class='search' onclick='openInfoWindow("+i+")' onmouseover='bouncemarker(\""+currentmarkers[i].linkid+"\")' onmouseout='bouncemarker(\""+currentmarkers[i].linkid+"\",true)'>"+currentmarkers[i].name+"</span><br>";
	}
	$("#searchresults").html(html);
}
$(function(){
	panelpresent=true;
	var laststamp=new Date($.cookie('timestamp_plan'));
		initialise_days_menu();
		showtrip();
		showpanel();	
	if($.cookie('timestamp_plan') && (new Date() - laststamp)/(60*1000)<2);
	else getdb(function(data){
		var ctimestamp=$.cookie('timestamp_planner');
		if(ctimestamp && ctimestamp>data["timestamp"] && $.cookie("theList")!=undefined){
			theList=JSON.parse($.cookie("theList"));
		}else {
			$.cookie("timestamp_plan",(new Date()).toJSON());
			$.cookie("theList",JSON.stringify(theList),{ expires: expDate });
		}
		if(theList==null||theList==undefined)theList={};
	else{
		noofdays=Object.keys(theList).length;
		if(noofdays<1)noofdays=1;
		initialise_days_menu();
		showtrip();
		showpanel();
		}
	});
	

	showcities();
	$('.citytab').click(function(){
		if($(this).data("city")!=currcity){
			geocoder.geocode( { 'address': $(this).data("city")}, function(results, status) {
		      if (status == google.maps.GeocoderStatus.OK) {
		        map.setCenter(results[0].geometry.location);
		        currcity=$(this).data("city");
		        console.log(results[0]);
		        lat=results[0].geometry.location.lat();
		        long=results[0].geometry.location.lng();
		      } else {
		        notify("Sorry,There Was an Error, Due to : " + status,"error");
		      }
		    });		
		}
	});
	google.maps.event.addListener(map,"mouseup",function(){
		map.clearOverlays();
		showdbdata(curractivity,undefined,false);
		showlist();
	});
});
var theList={},cities={};
var currentcateg='';
var currentsubtype='';
function delday(){
	if(confirm("Do you really want to delete all of your Day "+currday+"'s Plans ?"))
	{
	for(var i=currday;i<noofdays;i++)
	{
		theList[i]=theList[i+1];
		if(theList[i]==undefined)theList[i]={};
	}
	theList[noofdays]=undefined;
	if(currday==noofdays)currday--;
	noofdays--;
	if(noofdays==0){noofdays=currday=1;theList[1]={};}
	initialise_days_menu();
	showpanel();
	goday(currday);
	savelist();
	}
}
function showdbdata(activity,placeobj,zoom){
	//theArray;
	activity=activity.toLowerCase();
	curractivity=activity;
	//alert("YO "+activity);
	if(zoom==undefined)zoom=true;
	if(typeof thePlaces[activity] == 'undefined' ){
		notify("Sorry, We dont have any information for the selected item, Please try again in a few days");
		if(loaderpresent)$("#loader").fadeOut("slow");
		return;
	}
	//console.log("hello");

	theArray=thePlaces[activity];
	places=[];placedata=[];
	currentmarkers=[];
	for(var i=0;i<theArray.length;i++)
	if(map.getBounds().contains(new google.maps.LatLng(theArray[i].lat,theArray[i].long)))
	{
		theObj=theArray[i];
		latlong=new google.maps.LatLng(theObj.lat , theObj.long);
		//placedataelem={};	placedataelem['text']=theArray[i].text;	placedataelem['image']=theArray[i].image;
		placedata.push({
			text:theArray[i].text,
			image:theArray[i].image
		});
		var icon;
		switch(activity){
		case 'accommodation':icon="img/markers/accommodation.png";break;
		case 'restaurant':icon="img/markers/restaurant.png";break;		
		case 'mustsee':icon="img/markers/mustsee.png";break;		
		case 'sight':icon="img/markers/sight.png";break;
		case 'entertainment':icon="img/markers/entertainment.png";break;		
		default://icon="http://maps.google.com/mapfiles/markerff.gif";
		icon="img/markers/default.png";
		}
		var linkid="linkid-"+theObj.name;
		linkid = linkid.replace(/[!\"#$%&'\(\)\*\+,\.\/:;<=>\?\@\[\\\]\^`\{\|\}~ ]/g, 's');
		places.push({
			name	:theObj.name,
			icon 	:icon,		// To be done according to type
			geometry:{
						location:latlong
					 },
			linkid	: linkid
		});
		currentmarkers.push({
			name	:theObj.name,
			icon 	:icon,		
			geometry:{
						location:latlong
					 },
			linkid	:linkid
		});
	}
	//console.log(placedata);
	if(places.length>0)
		createMarkers(places,placedata,true,zoom);
	else if(loaderpresent)$("#loader").fadeOut("slow");
	showlist();
}
function planmytrip(){
	$("#backdrop").modal('hide');
	$("#backdroptitle").html("Now Let us Create a schedule for your Vacation Plan");
	$("#backdrop .contents").html("\
		<pre style='font-size:1.5em;font-family:calibri'>In the following page you can\
<ul style='list-style:none'>	\
<li>Order the places you want to visit ,</li>\
<li>Deciede the time you want to spend at each place</li>\
<li>and plan the whole vacation.</li>\
<li>You can come back to this screen later to make changes to the list of places</li>\
<li>ie. You can Add a place or remove it from your vacation.</li>\
</ul>\
So later we will help you plan and arrange all the services you need for your '<b>Custom</b>' vacation.\n\
<a style='margin-top:20px;text-align:center;display:block;' href='plan/index.php'><button class='btn btn-large btn-success'>Start Planning</button></a>\
		</pre>\
		");
	$("#backdrop").modal('show');
}
function checkitem(theObj,day){
	if(!theList)theList={};
	var res=false;
	if(theList && theList[day])
	$.each(theList[day],function(ii,listitem){
	  $.each(theList[day][ii],function(i,item){
	  	if(item!=undefined && item!=null)
	  	//alert("Checking for "+item.title+" "+theObj.title);
		if(item.title==theObj.title){alert("You have already added this place.");res=true;}
		});
	});
	return res;
}
function additemtoday(theObj){
	if(infoArray)
	for( iw in infoArray) 	infoArray[iw].set("map",null);
	var f=0;
	f=checkitem(theObj,curr_addday);
	alert(theObj.title,f);
	console.log(f,"DF");
	if(f){notify(theObj.title+" was already added your trip","error","#left_noty");}
	else {
	if(theList[curr_addday]==undefined)theList[curr_addday]={}
	if(theList[curr_addday][theObj.type]==undefined)theList[curr_addday][theObj.type]=[];
	theList[curr_addday][theObj.type].push(theObj);
	//

	notify(theObj.title+" was added to your trip","info","#left_noty");
	}
	showtrip();
	showpanel();
	savelist();
	//console.log(theList);
}
	function deleteitem(one,two,three){
		//var one=$(this).data('1'),two=$(this).data('2'),three=$(this).data('3');
		var evt=theList[one][""+two][""+three];
		if(confirm("Do you want to Delete "+evt.title+" from Day "+one+"'s Plan ?")){
			var count=theList[one][two].length;
			//for(var i=three;i<count-1;i++)
			//theList[one][two][i]=theList[one][two][i+1];
			theList[one][two][three]=undefined;
			two=two.replace(/\s+/g, '');
			console.log($(".typelist."+one+two+three));
			$(".typelist."+one+two+three).slideUp("slow");
		}
	}
function savelist(){
	$.cookie("timestamp_plan",(new Date()).toJSON());
	$.cookie('theList',JSON.stringify(theList),{ expires: expDate });
}
$(window).on("unload",function(){
	savelist();
});
function showcities(){
	var cities=JSON.parse($.cookie('cities'));
	$("#citiestab ul").html("");
	for(var i=0;i<cities.length;i++)
	$("#citiestab ul").append('<li class="citytab'+(i==0?" active":"")+'" data-reference="'+cities[i].reference+'" data-city="'+cities[i].city+'"><a href="#'+cities[i].city+'" data-toggle="tab">'+cities[i].city+'</a></li>');
}
function addcities(){
	window.location='start.php';
	window.reload();
	//$("#backdrop .contents").load("start.php");
	//$("#backdrop").modal('show');
}

function showtrip(showit){
	if(showit==undefined)showit=false;
	var show="";
	if(theList)
	show+='<div id="showtrip" class=" panel-group">';
	for(var day=1;day<=noofdays;day++){
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
        if(theList[day]==undefined)show+='<h4>No Plans are added for this day </h4>';
		for(type in theList[day]){
			show+='<div class="modal-header">\
	        <h4 class="modal-title">'+type+'</h4>\
	      </div>';
	      	show+='<div class="modal-body">\
	      		   <ul>';
	      	if(theList[day] && theList[day][type])
	        for(i in theList[day][type])
	        if(theList[day][type][i]!=undefined && theList[day][type][i]!=null)
	        {
	        	show+='<li class="modaltypelist">\
	        			'+theList[day][type][i].title+'<br>\
	        			'+theList[day][type][i].subtype+'\
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
function showpanel(){
	var show="";
		var day=currday;
		$("#left_col_dayno").html(currday);
        if(theList[day]==undefined||theList[day]=={})show+='<h4>No Plans are added for this day </h4>';
		for(type in theList[day]){
			//show+='<h6 class="modal-title">'+type+'</h6>';
	      	show+='<div class="modal-body">\
	      		   <ul>';
	      		  if(theList[day][type])
	        for(i in theList[day][type])
	        	if(theList[day][type][i]!=undefined && theList[day][type][i]!=null)
	        {
	        	var type1=type.replace(/\s+/g, '');
	        	show+='<li class="typelist '+day+type1+i+'">\
	        			'+theList[day][type][i].title+'\
	        			<span onclick=\'deleteitem("'+day+'","'+type+'","'+i+'")\' style="position:absolute;right:-10px" class="close delitem">&times</span>\
	        			</li>';
	        }
	      	show+='</ul>\
	      		   </div>';
	}
	if(show=="")show='<div class="modal-header">\
        <h4 class="modal-title">Currently, You have no plans Scheduled for this day. Please Add plans to your trip</h4>\
      </div>';
	$("#leftpanelcontents").html(show);
}
function get_db(key){
	$.ajax({
		url :"save.php",
		type:"post",
		data:{
			page:"plan",
			key:key,
		},
		success:function(data){
			eval(key+" = JSON.parse('"+data+"');");
		}
	});
}
function getdb(callback){
	var data=["cities","theList"];
	$.ajax({
		url:"save.php",
		type:"post",
		dataType:"json",
		data:{
			page:"plan",
			data:data,
			multi:true
		},
		success:function(data){
			if(data.present){
				//console.log(data);
				//tmp=data;
				cities=JSON.parse(data.cities);
				theList=JSON.parse(data.theList);
				if(callback)callback(data);
			}
		},
		error:function(xhr,status,error){
			alert(status+error);
			alert(xhr.responseText);
		}
	});	
}
function set_db(key){
	$.ajax({
		url :"save.php",
		type:"post",
		data:{
			page:"plan",
			key:key,
			save:true
		},
		success:function(data){
			alert(data);
		}
	});
}
function setdb(){
	var data={};
	data["cities"]=JSON.stringify(cities);
	data["theList"]=JSON.stringify(theList);
	$.ajax({
		url:"save.php",
		type:"post",
		data:{
			page:"plan",
			data:data,
			save:true,
			multi:true
		},
		success:function(data){
			alert(data);
		}
	});
	//$.ajax({url:"save.php",type:"post",data:{key:"theEvents",value:JSON.stringify(theEvents),save:true}});
}