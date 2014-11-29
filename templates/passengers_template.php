<!-- Passengers Template -->

<script type="text/template" id="passengers_template">

<!-- Top Navbar-->
<div class="navbar">
  <div class="navbar-inner">
    <div class="left"><a href="#" class="back link"><i class="icon icon-back-blue"></i><span>Back</span></a></div>
    <div class="center sliding">Passengers of "<%=cruise.title%>"</div>
    <div class="right">
      <!-- Right link contains only icon - additional "icon-only" class--><a href="#" class="link icon-only open-panel"><i class="icon icon-bars-blue"></i></a>
    </div>
  </div>
</div>


<div class="pages">
  <!-- Page, data-page contains page name-->
  <div data-page="passengers" class="page" data-cruiseid="<%=cruise.id%>"  data-orderid="">
      <!-- Search bar -->
    <form class="searchbar" data-search-list=".list-block-search" data-search-in=".item-title">
        <div class="searchbar-input">
            <input type="search" placeholder="Search">
            <a href="#" class="searchbar-clear"></a>
        </div>
        <a href="#" class="searchbar-cancel">Cancel</a>
    </form>
    
    <!-- Search bar overlay-->
    <div class="searchbar-overlay"></div>
    <!-- Scrollable page content-->
    <div class="page-content">      
      <div class="content-block top">
        <div class="content-block-inner">
          <div class="list-block media-list list-block-search searchbar-found">
                <ul>
		     <% _.each(cruise.orders, function(order) { 
			 var totalTickets = 0;
			 for (var i=1;i<6;i++){
			    if (!isNaN(parseInt(order['price'+i+'_tickets'])))
			    totalTickets+=parseInt(order['price'+i+'_tickets']);
			 }
		     %>
			<li><a href="#" data-template-id="passenger_template" data-orderid="<%=order.id%>" data-cruiseid="<%=cruise.id%>" class="item-link item-content create-page">
			    <div class="item-media">
				<div class="rect <%=(order.checked_in==1)?'ordered':'aval'%>"><%=totalTickets%></div>
			    </div>
			    <div class="item-inner">
				<div class="item-title item-title-row"><%=order.name%></div>
				<div class="item-text"><%=getPricesString(cruise, order)%></div>
			    </div>
			  </a>
		      </li>
		     <% }); %>
	          
		  
		 </ul>
	  </div>
	    
        </div>
      </div>
    </div>
  </div>
</div>
</script>
