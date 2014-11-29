
<!-- Passenger Template -->

<script type="text/template" id="passenger_template">
    <%
     var thisorder;
     _.each(cruise.orders, function(order) {
	if (order.id==orderid){
	    thisorder = order;
	    return;
	}
     });
     var totalTickets = 0;
	for (var i=1;i<6;i++){
	    if (!isNaN(parseInt(thisorder['price'+i+'_tickets'])))
		totalTickets+=parseInt(thisorder['price'+i+'_tickets']);
	}
    %>
    <!-- Top Navbar-->
    <div class="navbar">
      <div class="navbar-inner">
	<div class="left"><a href="#" class="back link"><i class="icon icon-back-blue"></i><span>Back</span></a></div>
	<div class="center sliding">Cruise Check In</div>
	<div class="right">
	  <!-- Right link contains only icon - additional "icon-only" class--><a href="#" class="link icon-only open-panel"><i class="icon icon-bars-blue"></i></a>
	</div>
      </div>
    </div>
    <div class="pages">
      <!-- Page, data-page contains page name-->
      <div data-page="passenger" class="page" data-cruiseid="<%=cruise.id%>" data-orderid="<%=thisorder.id%>">
	<!-- Scrollable page content-->
	<div class="page-content">

	  <div class="content-block top">



	    <div class="content-block-inner">
		<form method="POST" class="ajax-submit form-checkin <%=(thisorder.checked_in==1)?'checked-in':'checked-out'%>">
		<input type="hidden" name="checked_in" id="checked_in" value="<%=(thisorder.checked_in==1)?0:1%>"/>
		<input type="hidden" name="id" id="id" value="<%=thisorder.id%>"/>
		
		<div class="row warning">
		      <div class="col-100">Passenger is checked in</div>	     
		</div>
		
	        <div class="row btn-checkin-wrap">
		    <div class="col-20">&nbsp;</div>
		    <div class="col-60"><input data-checkin="1" type="submit" class="button button-submit btn-checkin" value="Check In"/></div>
		    <div class="col-20">&nbsp;</div>		    		   		    
		</div> 
		
	      <div class="list-block media-list">
		    <ul>
		      <li><a href="#" class="item-link item-content disabled">
			    <div class="item-media">
				<div class="rect <%=(thisorder.checked_in==1)?'ordered':'aval'%>"><%=totalTickets%></div>
			    </div>
			    <div class="item-inner">
				<div class="item-title item-title-row"><%=thisorder.name%></div>
				<div class="item-text"><%=getPricesString(cruise, thisorder)%></div>
			    </div>
			  </a>
		      </li>
		      </ul>
		      <ul style="border-top:none;">
		      <li><div class="item-content">                      
			    <div class="item-inner">
			      <div class="item-title item-title-row">Info</div>			  
				<div class="item-text" style="height: auto;">
				    <p>Cruise: <%=cruise.title%></p>
				    <p>Vessel: <%=cruise.schooner_name%></p>
				    <p>Cruise Date: Today <%=cruise.from_time_formatted%></p>
				    <p>Purchase Date: <%=thisorder.purchased_formatted%></p>
				    <p>Email Address: <%=thisorder.email%></p>
				    <p>Phone Number: <%=thisorder.phone%></p>
				    <p>Order id: <%=thisorder.id%></p>

				</div>
			    </div>

			  </div>
		      </li>
		      </ul>
		  </div>
		<div class="row btn-checkout-wrap">
			<div class="col-20">&nbsp;</div>
			<div class="col-60"><input data-checkin="0" type="submit" class="button button-cancel btn-checkin" value="Check Out"/></div>
			<div class="col-20">&nbsp;</div>		    		   		    
		</div> 
		
		</form>
	    </div>
	    <!-- END content-block-inner-->
	  </div>
	    <!-- END content-block-->
	</div>
      </div>
    </div>
</script>