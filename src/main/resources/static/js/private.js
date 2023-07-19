$(document).ready(function(){
	
	$('#bills_table tbody').empty();
//    var data = [[${account.bills}]];
    var token = $("meta[name='_csrf']").attr("content");
    var header = $("meta[name='_csrf_header']").attr("content");
    var requestHeaders = {};
    requestHeaders[header] = token;
	$.each(data, function(key, value){
    	var rowID = value.id;
 		var dataRow = '<tr id="row'+rowID+'">'
			+ '<td class=align-middle align=center>'+value.id+'</td>'
			+ '<td id="balance'+rowID+'" class=align-middle align=center>'+value.balance+'</td>'
			+ '<td class=align-middle align=center>'+value.currency+'</td>'
			+ '<td class=align-middle align=center>'+value.active+'</td>'
			+ '<td class=align-middle align=center><div class="btn-group" id="group'+rowID+'">'
			+ '<button class="btn btn-primary" value="deposit">Deposit</button>'
			+ '<button class="btn btn-info" value="withdraw">Withdraw</button>'
			+ '<button class="btn btn-warning" value="transfer">Transfer</button>'
			+ '<button class="btn btn-dark" value="external">External</button>'
			+ '</div></td>'
			+ '<td><button class="btn btn-danger" id="erase'+rowID+'">Erase</button></td>'
			+ '</tr>';
    	$(dataRow).appendTo('#bills_table tbody');
	 	
	 	$('.btn-group .btn').click(function() {
	 		var action = $(this).val();
		 	var balance = value.balance;
   		 	var billForm =
				$('<form action="/bankdemo/bills/operate" method="post">'
				+ '<input type="hidden" name="id" value="'+rowID+'"/>'		
  		 		+ '<input type="hidden" name="action" value="'+action+'"/>'
  		 		+ '<input type="hidden" name="balance" value="'+balance+'"/></form>');
    		 	$(billForm).append('<input type="hidden" name="_csrf" value="'+token+'"/>');
    		 	$(billForm).appendTo(document.body);
    		 	$(billForm).submit();
	    		$(document.body).removeChild(billForm);
	 	});
	 	
	 	var eraseBTN = '#erase'+rowID;
	 	var groupBTN = '#group'+rowID;
	 	if(value.active == false){
	 		$(groupBTN).hide();
	 		$(eraseBTN).hide();	  
	 	}		
		$(eraseBTN).click(function(){
			if(!confirm('Are you sure to delete this bill?')){
                   return false;
  				}
			$.ajax({
			    url: '/bankdemo/bills/delete/'+rowID,
			    type: 'DELETE',
			    headers: requestHeaders,
			    success: function(){
			    	$(dataRow).remove();
			        return false;
			    }
			});
		});
		
		var connect = function(){
			let xhr = new XMLHttpRequest();
			xhr.open('GET', '/bankdemo/bills/notify');
			xhr.onload = function() {
				if (xhr.status == 201) {
					const json = JSON.parse(xhr.responseText);
					var cell = '#balance'+json.id;
					var total = parseFloat($(cell).html(), 2) + json.income;
					$(cell).text(total.toFixed(2));
					alert('+ ' + json.income);
					connect();
				}
				else {
					alert('Request failed: ' + xhr.status + ', ' + xhr.statusText);
				}			
			};
			xhr.onerror = function() {
				alert('Request failed: ' + xhr.status + ', ' + xhr.statusText);
			};
			xhr.send();
		};
		connect();
		
	});
	$('#bills_table tbody').hide().fadeIn('slow');
	
});

$(document).ready(function(){
	
    $('#currency_form').submit(function (ev) {
        ev.preventDefault();
        var phone = $('#account_phone').val();
        var type = $('#currency').val();
        var token = $("meta[name='_csrf']").attr("content");
        var header = $("meta[name='_csrf_header']").attr("content");
        var requestHeaders = {};
        requestHeaders[header] = token;
        $.ajax({
            type: 'POST',
            url: '/bankdemo/bills/add', 
            data: {
            	"phone": phone,
                "currency": type
            },
            headers: requestHeaders,
            success: function(data){
            	var rowID = data.id;
    	 		var info = '<tr id="row'+rowID+'">'
   					+ '<td class=align-middle align=center>'+data.id+'</td>'
   					+ '<td class=align-middle align=center>'+data.balance+'</td>'
   					+ '<td class=align-middle align=center>'+data.currency+'</td>'
   					+ '<td class=align-middle align=center>'+data.active+'</td>'
   					+ '<td class=align-middle align=center><div class="btn-group">'
   					+ '<button class="btn btn-primary" value="deposit">Deposit</button>'
   					+ '<button class="btn btn-info" value="withdraw">Withdraw</button>'
   					+ '<button class="btn btn-warning" value="transfer">Transfer</button>'
   					+ '<button class="btn btn-dark" value="external">External</button>'
   					+ '</div></td>'
 					+ '<td><button class="btn btn-danger" id="erase'+rowID+'">Erase</button>'
 					+'</td></tr>';
    		 	$(info).appendTo('#bills_table tbody');
    		 	
    		 	$('.btn-group .btn').click(function() {
    		 		var action = $(this).val();
	    		 	var balance = data.balance;
   	    		 	var billForm =
					$('<form action="/bankdemo/bills/operate" method="post">'
					+ '<input type="hidden" name="id" value="'+rowID+'"/>'		
    		 		+ '<input type="hidden" name="action" value="'+action+'"/>'
    		 		+ '<input type="hidden" name="balance" value="'+balance+'"/></form>');
	    		 	$(billForm).append('<input type="hidden" name="_csrf" value="'+token+'"/>');
	    		 	$(billForm).appendTo(document.body);
	    		 	$(billForm).submit();
 	    		 	$(document.body).removeChild(billForm);
    		 	});
    		 	
    		 	var dataRow = '#row'+rowID;
    		 	var eraseBTN = '#erase'+rowID;	    		 	
    		 	if(data.active == false){
    		 		$('.btn-group').hide();
    		 		$(eraseBTN).hide();	  
    		 	}	
    			$(eraseBTN).click(function(){
    				if(!confirm('Are you sure to delete this bill?')){
                        return false;
       				}
    				$.ajax({
    				    url: '/bankdemo/bills/delete/'+rowID,
    				    type: 'DELETE',
    				    headers: requestHeaders,
    				    success: function(){
    				    	$(dataRow).remove();
    				        return false;
    				    }
    				});
    			});
            }
        });
    });
    
});