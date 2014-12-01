//global vars
var functionsPath = "http://maritimegloucester.org/admin/includes/functions/",
    globCruises;

// Initialize your app
var myApp = new Framework7({
    notificationHold: 5000
});

// Export selectors engine
var $$ = Framework7.$;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});


//remove index page from history
mainView.history.splice(0,1);
// on every page after open animation
$$(document).on('pageAfterAnimation', function (e) {
    var page = e.detail.page;
    //remove previous page for cruise page (to disallow swibaback)
    if (page.name=="cruise"){
	$$('.page.page-on-left').remove();	
    }    
})

// Event listener to run specific code for specific pages (does not work for initial page?)
$$(document).on('pageInit', function (e) {
    var page = e.detail.page;
        
    //show image only if is fully loaded
    if ($('.media-list .item-media img').length>0)
    if (!IsImageLoaded($('.media-list .item-media img').get(0)))
    $('.media-list .item-media img').css({'margin-left':'-200px', opacity:'0'}).load(function(){	
	$(this).animate({'margin-left':'0px', opacity:'1'}, 1000);
	$(this).next('.avatar-bg').animate({'margin-left':'0px'}, 1000);
    });
    else {
	$('.avatar-bg').css({'margin-left':'0px'});
    }
    
});

// get global cruises
if (typeof globCruises == "undefined") {  
    var mFrom = moment("2014-06-25"); //today momentjs object
    var mTo = moment("2014-06-25").add('days', 14); //today + 14 days
    //jsonp request
    $.ajax({
	url: functionsPath+"get_cruises.php",
	jsonp: "callback",
	dataType: "jsonp",
	data: {
	    from: mFrom.format('DD-MM-YYYY'),	
	    to: mTo.format('DD-MM-YYYY')
	},
	// work with the response
	success: function(data){
	    globCruises = data;
	    if (globCruises.length==0 || !globCruises){
		var elNoData = $("<span>Unable to get cruises data<br />from "+mFrom.format('D MMM YYYY')+" to "+mTo.format('D MMM YYYY')+" </span>").css({
		    position: "absolute",
		    top: "50%",
		    "text-align": "center",
		    width: "100%",
		    "color": "#777777",
		    "font-weight": "bold"
		});
		//append nodata info to index page
		$('.view-main div[data-page="index"]').html(elNoData);	
		//append nodata info to cruises list
		$('.cruises-list ul').append('<li style="font-size:14px;margin:15px 0px;"text-align":"center"">'+elNoData.html()+'</li>');
	    }
	    else {
		//generate initial page for the next cruise
		createContentPage("cruise_template", {cruise:globCruises[0]});
		//generate initial cruises list
		var template = _.template($("#cruise_list_items_template").html(), {cruises: globCruises});
		$('.cruises-list ul').html(template);
	    }
	}
    });
    /*
    $.post(functionsPath+"get_cruises.php", {
	from: moment().format('DD-MM-YYYY'),	
	to: moment().add('days', 14).format('DD-MM-YYYY')
    }, function(data){
	
	globCruises = data;
	//generate initial page for the next cruise
	createContentPage("cruise_template", {cruise:globCruises[0]});
	
	//generate initial cruises list
	var template = _.template($("#cruise_list_items_template").html(), {cruises: globCruises});
	$('.cruises-list ul').html(template);
    }, 'json');
    */
}
else {
    //generate initial page for the next cruise
    createContentPage("cruise_template", {cruise:globCruises[0]});
    //generate initial cruises list
    var template = _.template($("#cruise_list_items_template").html(), {cruises: globCruises});
    $('.cruises-list ul').html(template);
}
//update timer
var  mins = 1;
var updateInterval = setInterval(function(){
    if (mins==1) ttext ='1 min';
    else if (mins<60) ttext= mins+' mins';
    else if (2>mins/60>1) ttext= '1 hour '+(mins-60)+' mins';
    else if (mins/60>=2)  ttext= Math.round(mins/60)+' hours '+(mins-Math.round(mins/60))+' mins';
    
    $(".updated-time").html("Updated "+ttext+" ago");
    mins++;
}, 60000)

/***************************************************************************
 *	on click scan qr code
 *	
 *	{orderid:2611}
 *	http://maritimegloucester.org/admin/includes/sections/orders/checkin.php?id=2611
 ***************************************************************************/

$$(document).on('click', '.btn-qrcode', function () {
    cordova.plugins.barcodeScanner.scan(
      function (result) {
	  /*
	    myApp.addNotification({
		message:"We got a barcode\n" +
                "Result: " + result.text + "\n" +
                "Format: " + result.format + "\n" +
                "Cancelled: " + result.cancelled
		});
	      */
		result.text = result.text.replace(/\\/g, "");
		try {
		    var obj = jQuery.parseJSON(result.text);
		}
		catch(e){
		    
		}
		var orderid,cruiseid;
		if (!empty(obj)) {
		    orderid = obj.orderid;
		    cruiseid = obj.cruiseid;
		}    
		else if (result.text.indexOf('maritimegloucester.org')!=-1 && result.text.indexOf('id=')!=-1) {
		    orderid = result.text.split("id=")[1].split("&")[0];
		}
		createOrderPage(orderid);		
      }, 
      function (error) {
	  myApp.addNotification({
	      title: "Error!",
	      message:"Scanning failed: " + error
	    });
          
      }
   );
})
/***************************************************************************
 *	on click refresh button
 ***************************************************************************/
$$(document).on('click', '.btn-refresh', function () {
    myApp.showPreloader('Refreshing Data');
    //jsonp request
    $.ajax({
	url: functionsPath+"get_cruises.php",
	jsonp: "callback",
	dataType: "jsonp",
	data: {
	    from: globCruises[0].from.split(" ")[0],
	    to: globCruises[globCruises.length-1].from.split(" ")[0]
	},
	// work with the response
	success: function(data){
	    if (typeof data !== "undefined" && data.length>0) {
	    globCruises = data;
	    var thisid = getCruiseIndexById(globCruises, $('.page.page-on-center').attr('data-cruiseid'));
	    createContentPage($('.page.page-on-center').attr('data-page')+"_template", {cruise: globCruises[thisid],orderid:$$('.page.page-on-center').attr('data-orderid')});
	     $(".updated-time").html("Updated Just Now");
	    }
	    myApp.hidePreloader();
	}
    });

});


/***************************************************************************
 *	infinite scroll for cruises list
 ***************************************************************************/
 $$('.panel-left').on('opened', function () {
    myApp.attachInfiniteScroll($$('.infinite-scroll'));
    
});

 
 var loading = false;

 $$('.infinite-scroll').on('infinite', function () {
      // Exit, if loading in progress
      if (loading) return;
      // Set loading flag
      loading = true;

      //jsonp request
      $.ajax({
	url: functionsPath+"get_cruises.php",
	jsonp: "callback",
	dataType: "jsonp",
	data: {
	    from: globCruises[globCruises.length-1].from.split(" ")[0],
	    days: 7
	},
	// work with the response
	success: function(data){
	  
	  if (typeof data==undefined||data.length==0){	      
	      //console.log('detach infinite scroll')
	      myApp.detachInfiniteScroll($$('.infinite-scroll'));	    
	      $$('.infinite-scroll-preloader').remove();
	  }
	  
	  var html = _.template($("#cruise_list_items_template").html(), {cruises: data});
	  $$('.cruises-list ul').append(html);
	  for (var ind in data){
	      if (typeof data[ind] == "object")
	       globCruises.push(data[ind]);
	  }
	 
	  
	  loading = false;
	  
	  if ($$('.cruises-list ul li').length>100) {
	    //console.log('detach infinite scroll')
	    myApp.detachInfiniteScroll($$('.infinite-scroll'));	    
	    $$('.infinite-scroll-preloader').remove();
	  }
	  
      }
    });

    });
 
 

/***************************************************************************
 *	on submit checkin form
 ***************************************************************************/
$(document).on('submit', 'form.form-checkin', function (e) {
    e.preventDefault();
    //jsonp request
      $.ajax({
	url: functionsPath+"toggle_checkin.php",
	jsonp: "callback",
	dataType: "jsonp",
	data: $(this).serialize(),
	// work with the response
	success: function(data){
	    if (data=="success") {
	     myApp.addNotification({
		 title:data,
		 message:($('input[name="checked_in"]').val()==1)?'checked in successfully':'checked out successfully'
	       });
	       $('form.form-checkin').toggleClass('checked-in').toggleClass('checked-out');
	       $('form.form-checkin .flip-container').toggleClass('flip');

	       $('input[name="checked_in"]').val(($('input[name="checked_in"]').val()==0)?1:0);
	     }
	     else {
		  myApp.addNotification({
		   title:'error',
		   message:data
	       });

	     }
	}
    });
  return false;
});

/***************************************************************************
 *	on click create dynamic page link
 ***************************************************************************/
$$(document).on('click', '.create-page', function () {
	    
	    var data={};
	    switch($$(this).attr('data-template-id')){
		case "cruise_template": data={cruise: globCruises[getCruiseIndexById(globCruises, $$(this).attr('data-cruiseid'))]};break;
		case "passengers_template": data={cruise: globCruises[getCruiseIndexById(globCruises, $$(this).attr('data-cruiseid'))]};break;
		case "passenger_template": data={cruise: globCruises[getCruiseIndexById(globCruises, $$(this).attr('data-cruiseid'))],orderid:$$(this).attr('data-orderid')};break;
	    }
	    /*
	    var data = {
		cruise:globCruises[getCruiseIndexById(globCruises, $$(this).attr('data-cruiseid'))],
		orderid:$$(this).attr('data-orderid')
	    }
	*/
	    createContentPage($$(this).attr('data-template-id'), data);
	    //mainView.url = "#"+$$(this).attr('data-template-id').replace('_template', '')
	    myApp.closePanel();
	    return false;
        });

/***************************************************************************
 *	Auxiliary functions
 ***************************************************************************/
//load dynamic page for specific order
function createOrderPage(orderid, onsuccess){
    var cruiseid;
    if (!empty(orderid)){
		    for (var i in globCruises){
			for (var j in globCruises[i].orders){
			    if (globCruises[i].orders[j].id==orderid) {
				cruiseid = globCruises[i].id;
				break;
			    }
			}
			if (!empty(cruiseid)) break;
		    }
    } else {
		    myApp.addNotification({
			    message:"Order id not passed"
		    });
    }
    if (!empty(cruiseid) && !empty(orderid)){
		    var cruiseind = getCruiseIndexById(globCruises, cruiseid);
		    data={cruise: globCruises[cruiseind],orderid:orderid};
		    createContentPage('passenger_template', data);
		    onsuccess();
    }
    else {
	     myApp.addNotification({
		    title: "Error!",
		    message:"Unable to find order "+orderid+" in the upcoming "+globCruises.length+" cruises",
		    hold: 10000
    });
		    
		}
    
}
//load dynamic page based on underscore template
function createContentPage(template_id, data) {
	var content = $$("#"+template_id).html();
	
            var template = _.template(content, data);	    
	    template= (typeof template == 'function')? template():template;
	    mainView.loadContent(template);
	    	    
	return;
}
//get prices string (per ticket type) for cruise (summarized) or specific order
function getPricesString(cruise, order){
     var str='';
     //get prices string for specific order
     if (!empty(order) && !empty(cruise)  && cruise!=='null'  && order!=='null') {
	for (var i=1;i<6;i++){
	   if (parseInt(order['price'+i+'_tickets'])!=0 && !isNaN(parseInt(order['price'+i+'_tickets'])) && typeof cruise['price'+i+'_name'] == "string") {
	       console.log(order['price'+i+'_tickets']);
	       str+=order['price'+i+'_tickets']+' '
		   +cruise['price'+i+'_name'].charAt(0).toUpperCase()
		   +cruise['price'+i+'_name'].slice(1).toLowerCase();
	       str+=(cruise['price'+i+'_name'].toLowerCase().slice(-1)=='s')?' ':'s ';	     
	   }
	}
     }
     
     //get totals prices string for cruise
     else if (!empty(cruise) && cruise!=='null'){
	 var arr_totalPerType = [0,0,0,0,0];
	 for (var num in cruise.orders){
	     for (var i=1;i<6;i++){
		 var nextprice = parseInt(cruise.orders[num]['price'+i+'_tickets']);
		 arr_totalPerType[i-1] += (isNaN(nextprice))?0:nextprice;
	     }
	 }
	 for (var i=1;i<6;i++){
	     if (parseInt(arr_totalPerType[i-1])!=0 && typeof cruise['price'+i+'_name'] == "string") {
		 str+=arr_totalPerType[i-1]+' '
		   +cruise['price'+i+'_name'].charAt(0).toUpperCase()
		   +cruise['price'+i+'_name'].slice(1).toLowerCase();
	       str+=(cruise['price'+i+'_name'].toLowerCase().slice(-1)=='s')?' ':'s ';	 
	     }
	 }	
	 
	 if (str == "") str = "0 Passengers";
     }
     return str;
}


function IsImageLoaded(img) {
    if (typeof img == "undefined") return false;
    if (!img.complete) {
        return false;
    }
    if (typeof img.naturalWidth !== "undefined" && img.naturalWidth === 0) {
        return false;
    }
    return true;
}

function getCruiseIndexById(cruises, id){
    for (var i in cruises){
	if (cruises[i].id == id) return i;
    }
    return 0;
    
}

function empty(mixed_var) {
  var undef, key, i, len;
  var emptyValues = [undef, null, false, 0, '', '0'];

  for (i = 0, len = emptyValues.length; i < len; i++) {
    if (mixed_var === emptyValues[i]) {
      return true;
    }
  }

  if (typeof mixed_var === 'object') {
    for (key in mixed_var) {
      return false;      
    }
    return true;
  }

  return false;
}