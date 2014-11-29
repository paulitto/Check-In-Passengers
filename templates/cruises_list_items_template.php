<script type="text/template" id="cruise_list_items_template">
    <% _.each(cruises, function(cruise) { %>    
<li>
		    <div class="item-content">                      
			<a href="#" data-template-id="cruise_template" data-cruiseid="<%=cruise['id']%>" class="item-link item-content create-page">
			<div class="item-inner">
			    
			    <div class="item-media"><i class="icon icon-form-tel"> <span class="badge <%=(cruise['total_ordered']==0)?'badge-red':'badge-green'%>"><%=cruise['total_ordered']%></span></i></div>
			    <div class="item-title"><%=cruise['title']%></div>
			    <div class="item-after"><%=cruise['from_formatted']%></div>
			    
			</div>		    
			    </a>
		    </div>
		    
</li>
<% }); %>
</script>