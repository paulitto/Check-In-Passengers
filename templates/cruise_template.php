<!-- Cruise Template -->

<script type="text/template" id="cruise_template">
<%
    var sTotals = getPricesString(cruise);
%>
<!-- Top Navbar-->
        <div class="navbar">
          <div class="navbar-inner">
            <!-- We have home navbar without left link-->
            <div class="center sliding">Cruise "<%=cruise.title%>" Summary</div>
            <div class="right">
              <!-- Right link contains only icon - additional "icon-only" class--><a href="#" class="link icon-only open-panel"><i class="icon icon-bars-blue"></i></a>
            </div>
          </div>
        </div>

<div class="pages navbar-through toolbar-through">
          <!-- Page, data-page contains page name-->
          <div data-page="cruise" class="page" data-cruiseid="<%=cruise.id%>" data-orderid="">
            <!-- Scrollable page content-->
            <div class="page-content">
              <div class="content-block top">
		  <div class="content-block-inner">
		      
		    <div class="row">
			<div class="col-20">&nbsp;</div>
			<div class="col-60"><a href="#" data-panel="left" class="button open-panel">View List</a></div>
			<div class="col-20">&nbsp;</div>		    		   		    
		    </div>		                
		
		     <div class="row rect-wrap">
			<div class="col-20">&nbsp;</div>
			<div class="col-20"><div class="rect total"><%=parseInt(cruise.max_places-cruise.available_places)%></div></div>
			<div class="col-20"><div class="rect ordered"><%=parseInt(cruise.total_checked_in)%></div></div>
			<div class="col-20"><div class="rect aval"><%=parseInt((cruise.max_places-cruise.available_places)-cruise.total_checked_in)%></div></div>                  
			<div class="col-20">&nbsp;</div>
		    </div>
		
		
              
		    <!--<div class="content-block-title">What about simple navigation?</div>
		    -->
		    <div class="list-block media-list">
			 <ul>							
				<li><a href="#" data-template-id="passengers_template" data-cruiseid="<%=cruise.id%>" class="item-link item-content <%=(sTotals=='0 Passengers')?'disabled':'create-page'%>">
				    <div class="item-media">
					<img src="<%=cruise.img_path%>"/>
					<div class="avatar-bg"></div>
				    </div>
				    <div class="item-inner">
					<div class="item-title-row">
					  <div class="item-title"><%=cruise.title%></div>					  
					</div>
					<div class="item-subtitle"><%=sTotals%></div>
					<div class="item-subtitle">Date: <%=cruise.from_formatted%></div>
					<div class="item-subtitle"><b>Info:</b></div>
					
					<div class="item-text">					    
					   
					    <p><%=cruise.description%><br/>
						Vessel: <%=cruise.schooner_name%>
					    </p>
					    
					    
					    
					    
					</div>
					   
				    </div>

				  </a>
			      </li>
			      
				

		      </ul>
		    </div>
              
              </div>
	      </div>
            </div>
          </div>
	  
        </div>

</script>
