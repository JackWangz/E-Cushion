document.write ("<script language='javascript' src='mychart.js'></script>");
document.write ("<script language='javascript' src='StringToData.js'></script>");
document.write ("<script language='javascript' src='Chart.js'></script>");
document.write ("<script language='javascript' src='ajax_showdata.js'></script>");

//JQuery
$(document).ready(function(){

	//Number selector
	$.fn.spinner = function() {

	};

	$('input[type=number]').spinner();

	//Sidebar toggle
	$('.viewNav').click(function(event) {
		toggleLeftContainer();
	});

	$('body').on('click', '.tool-toggle', function(event) {
		event.preventDefault();
		//Hide map tools
		if ($('.section-tools').hasClass('sidebar')){
			$('.section-tools').removeClass('sidebar')
			$('.section-tools').css('transform', 'translateY(0)');
		}
		//Show map tools
		else{
			$('.section-tools').addClass('sidebar')
			$('.section-tools').css('transform', 'translateY(60px)');
		}
	});

	//Input event for 'div-createMap'
	$('body')
	  .on('input', 'input[type=range]',
	  	function(event) {
			event.preventDefault();
			var row = $(this).val();
			$(this).siblings('p').html(row + " x " + row);
	});

	//Click event for createMap
	$('body')
	  .on('click', '#btn-createMap',
		function(event) {
			var row = $('input[type=number]').val();
			$(this).parents('#div-createMap').remove();
			removeMap();
			createMap(row, row);
			showMapTool();
	});

	$('body')
	  .on('click', '.map-seat',
	    function(event) {
	  		event.preventDefault();
	  		event.stopPropagation();
	  		var A_MAC   = $(this).data('amac'),
	  		    groupNo = $(this).parent('div').data('group');
	  		$(this).addClass('seatClicked');
	  		if(typeof A_MAC === 'undefined'){
	  			show_seats_information(groupNo, 0);
	  		}
	  		else show_seats_information(groupNo, A_MAC);
	  });

	$('body')
	  .on('click', '.grouped',
	    function(event) {
	  		event.preventDefault();
	  		var groupNo = $(this).data('group');
	  		$(this).addClass('groupClicked');
	  	    show_group_information(groupNo);
	  });

	//Change event of tools that can create seats and groups on map.
	$('body')
	  .on('change', 'input[name=check]',
	     function(event) {

	         if($('input:checked').val() == 'Group'){
	             $(document)
	                  .bind(
	                        "dragstart",
	                        function( ev, dd ){
	                        	$('.map-entity.grouped').addClass('disabled');

		                        return $('<div class="selection"/>')
		                              .css('opacity', .65 )
		                              .appendTo( document.body );
	                  })
	                  .bind(
	                        "drag",
	                        function( ev, dd ){
		                        $( dd.proxy ).css({
		                              top: Math.min( ev.pageY, dd.startY ),
		                              left: Math.min( ev.pageX, dd.startX ),
		                              height: Math.abs( ev.pageY - dd.startY ),
		                              width: Math.abs( ev.pageX - dd.startX )
		                        });
	                  })
	                  .bind(
	                        "dragend",
	                        function( ev, dd ){
	                        	$('.map-entity.grouped').removeClass('disabled');
	                        	$( dd.proxy ).remove();
	                  });
		      }
		      else if($('input:checked').val() == 'Seat')
		      {
		            $(document).unbind();
		      }
    });
	
	//Area options
	$('body')
	  .on('click', '.nav-area>li',
	  	 function(event) {
		  	event.preventDefault();
		  	var areaName = $(this).find('a').html();
		  	if(areaName == '+') return;
		  	if(typeof areaName !== 'undefined'){
		  		loadMap(areaName);
		    }
		    $(this).siblings('li').removeClass('selected');
		    $(this).siblings('li').find('a').removeClass('selected');
		    $(this).addClass('selected');
		    $(this).find('a').addClass('selected');
	  });

	//Chart function options
	$('body')
	  .on('click', 'li.chart-function',
	  	function(event) {
			event.preventDefault();
			$('.section-content').remove();
			$(this).siblings().removeClass('selected');
			$(this).addClass('selected');
			$('ul.nav-chartTiming').addClass('display');
			$('li.chart-timing').removeClass('selected')
								.first()
								.addClass('selected');

			$('<div class="section-content"></div>').appendTo('.right-container')
			var target = $(this).find('a').html();
			var tar = "";

			switch(target){
					case 'Dinning Time':
						tar += "dinning";
						break;
					case 'Come Store Rate':
						tar += "come_store";
						break;
					case 'Leave Store Rate':
						tar += "leave_store";
						break;
					case 'Turn Rate':
						tar += "turn_rate";
				}

			$('<div id="' + tar + '_today" class="chart-cell">' +
				'<canvas style="float:left" id="today" width="300" height="400"></canvas>' +
			'</div>')
			.appendTo('.section-content');

			if(target == 'Dinning Time')
			{eating_time_today();}
			else if(target == 'Come Store Rate')
			{come_store_today();}
			else if(target == 'Leave Store Rate')
			{leave_store_today();}
			else if(target == 'Turn Rate')
			{turn_rate_today();}
	});

	//Chart timing options
	$('body')
	  .on('click', 'li.chart-timing',
	  	function(event) {
			event.preventDefault();
			var function_target = $('.chart-function.selected').find('a').html();
			var target = $(this).find('a').html();

			if($(this).hasClass('selected')){
				$(this).removeClass('selected');

				var tar = "";

				switch(function_target){
					case 'Dinning Time':
						tar += "dinning";
						break;
					case 'Come Store Rate':
						tar += "come_store";
						break;
					case 'Leave Store Rate':
						tar += "leave_store";
						break;
					case 'Turn Rate':
						tar += "turn_rate";
				}

				switch(target){
					case 'Today':
						tar += "_today";
						break;
					case 'Week':
						tar += "_week";
						break;
					case 'Same Day Weeks Ago':
						tar += "_same_day";
						break;
					case 'Compare Weeks':
						tar += "_compare_weeks";
						break;
					case 'Compare Months':
						tar += "_compare_months";
				}

				$('div[id="' + tar +'"]').remove();
				console.log(tar);
				return;
			}

			$(this).addClass('selected');


			if(target == 'Today'){

				switch(function_target){
					case 'Dinning Time':
						$('<div id="dinning_today" class="chart-cell">' +
							'<canvas style="float:left" id="today" width="300" height="400"></canvas>' +
						'</div>')
						.appendTo('.section-content');
						eating_time_today();
						break;
					case 'Come Store Rate':
						$('<div id="come_store_today" class="chart-cell">' +
							'<canvas style="float:left" id="today" width="300" height="400"></canvas>' +
						'</div>')
						.appendTo('.section-content');
						come_store_today();
						break;
					case 'Leave Store Rate':
						$('<div id="leave_store_today" class="chart-cell">' +
							'<canvas style="float:left" id="today" width="300" height="400"></canvas>' +
						'</div>')
						.appendTo('.section-content');
						leave_store_today();
						break;
					case 'Turn Rate':
						$('<div id="turn_rate_today" class="chart-cell">' +
							'<canvas style="float:left" id="today" width="300" height="400"></canvas>' +
						'</div>')
						.appendTo('.section-content');
						turn_rate_today();
				}

			}else if(target == 'Week'){
				switch(function_target){
					case "Dinning Time":
						$('<div id="dinning_week" class="chart-cell">' +
							'<div style="float:left" id="seven_days" width="400" height="400"></div>' +
						'</div>')
						.appendTo('.section-content');
						eating_time_seven_days();
						break;
					case "Come Store Rate"	:
						$('<div id="come_store_week" class="chart-cell">' +
							'<canvas style="float:left" id="seven_days" width="400" height="400"></canvas>' +
							'<div style="float:left"></div>' +
						'</div>')
						.appendTo('.section-content');
						come_store_seven_days();
						break;
					case "Leave Store Rate":
						$('<div id="leave_store_week" class="chart-cell">' +
							'<canvas style="float:left" id="seven_days" width="400" height="400"></canvas>' +
							'<div style="float:left"></div>' +
						'</div>')
						.appendTo('.section-content');
						leave_store_seven_days();
						break;
					case "Turn Rate":
						$('<div id="turn_rate_week" class="chart-cell">' +
							'<canvas style="float:left" id="seven_days" width="400" height="400"></canvas>' +
						'</div>')
						.appendTo('.section-content');
						turn_rate_seven_days();
				}

			}else if(target == 'Same Day Weeks Ago'){
				switch(function_target){
					case "Dinning Time":
						$('<div id="dinning_same_day" class="chart-cell">' +
							'<div style="float:left" id="weeks_ago_same_day" width="400" height="400"></div>' +
						'</div>')
						.appendTo('.section-content');
						eating_time_weeks_ago_same_day();
						break;
					case "Come Store Rate":
						$('<div id="come_store_same_day" class="chart-cell">' +
							'<canvas style="float:left" id="weeks_ago_same_day" width="400" height="400"></canvas>' +
							'<div style="float:left"></div>' + 
						'</div>')
						.appendTo('.section-content');
						come_store_weeks_ago_same_day();
						break;
					case "Leave Store Rate":
						$('<div id="leave_store_same_day" class="chart-cell">' +
							'<canvas style="float:left" id="weeks_ago_same_day" width="400" height="400"></canvas>' +
							'<div style="float:left"></div>' + 
						'</div>')
						.appendTo('.section-content');
						leave_store_weeks_ago_same_day();
						break;
					case "Turn Rate":
						$('<div id="turn_rate_same_day" class="chart-cell">' +
							'<canvas style="float:left" id="weeks_ago_same_day" width="400" height="400"></canvas>' +
						'</div>')
						.appendTo('.section-content');
						turn_rate_weeks_ago_same_day();
				}
			}else if(target == 'Compare Weeks'){
				switch(function_target){
					case "Dinning Time":
						$('<div id="dinning_compare_weeks" class="chart-cell">' +
							'<div style="float:left" id="compare_weeks" width="400" height="400"></div>' +
						'</div>')
						.appendTo('.section-content');
						eating_time_compare_weeks();
						break;
					case "Come Store Rate":
						$('<div id="come_store_compare_weeks" class="chart-cell">' +
							'<canvas style="float:left" id="compare_weeks" width="400" height="400"></canvas>' +
							'<div style="float:left"></div>' + 
						'</div>')
						.appendTo('.section-content');
						come_store_compare_weeks();
						break;
					case "Leave Store Rate":
						$('<div id="leave_store_compare_weeks" class="chart-cell">' +
							'<canvas style="float:left" id="compare_weeks" width="400" height="400"></canvas>' +
							'<div style="float:left"></div>' + 
						'</div>')
						.appendTo('.section-content');
						leave_store_compare_weeks();
						break;
					case "Turn Rate":
						$('<div id="turn_rate_compare_weeks" class="chart-cell">' +
							'<canvas style="float:left" id="compare_weeks" width="400" height="400"></canvas>' +
						'</div>')
						.appendTo('.section-content');
						turn_rate_compare_weeks();
				}
			}else if(target == 'Compare Months'){
				switch(function_target){
					case "Dinning Time":
						$('<div id="dinning_compare_months" class="chart-cell">' +
							'<div style="float:left" id="compare_months" width="400" height="400"></div>' +
						'</div>')
						.appendTo('.section-content');
						eating_time_compare_months();
						break;
					case "Come Store Rate":
						$('<div id="come_store_compare_months" class="chart-cell">' +
							'<canvas style="float:left" id="compare_months" width="400" height="400"></canvas>' +
							'<div style="float:left"></div>' + 
						'</div>')
						.appendTo('.section-content');
						come_store_compare_months();
						break;
					case "Leave Store Rate":
						$('<div id="leave_store_compare_months" class="chart-cell">' +
							'<canvas style="float:left" id="compare_months" width="400" height="400"></canvas>' +
							'<div style="float:left"></div>' + 
						'</div>')
						.appendTo('.section-content');
						leave_store_compare_months();
						break;
					case "Turn Rate":
						$('<div id="turn_rate_compare_months" class="chart-cell">' +
							'<canvas style="float:left" id="compare_months" width="400" height="400"></canvas>' +
						'</div>')
						.appendTo('.section-content');
						turn_rate_compare_months();
				}
			}
	});

	$('body')
	  .on('click', '#btn-addArea',
	    function(event) {
	  	  event.preventDefault();
	  	  	var form_popup = "<div id='popup'><form id='form-createArea'>" +
			"<ul><li>Area Name<input id='input-areaName' placeholder='Area...' type='text' required></li>" +
			"<li>Pi MAC<input id='input-piMac' placeholder='AA:BB:CC:DD' type='text' required></li></ul>" +
	  		"<input id='btn-createArea' type='button' value='Create'/>  " +
	  		"<input id='btn-close' type='button' value='Cancel'/><br>" +
			"</form></div>";
			$('body').append(form_popup);
			$('#popup').hide()
					   .show()
					   .addClass('visible');
	  });

	$('body')
	  .on('click', '#btn-saveMapInfo',
	    function(event) {
		  	event.preventDefault();
		  	saveMapInfo();
	  });

	$('body')
	  .on('click', '#btn-close', 
	  	function(event) {
			event.preventDefault();
			$('.seatClicked').removeClass('seatClicked');
			$('.groupClicked').removeClass('groupClicked');
			$('#popup').remove();
			$('.map-entity.ready').removeClass('ready');

			$(this).parents('div').remove();
	});

	$('body')
	  .on('click', '#btn-createArea', function(event) {
	  	event.preventDefault();

	  	var area  = $('#input-areaName').val();
	  	var pimac = $('#input-piMac').val();
	  	if(area == '' && pimac == ''){
			$('#form-createArea').append('ERROR!').css('color', 'red');
			return;
		}

		$.ajax({
			url: 'insert.php',
			type: 'POST',
			data: {target: 'pi', areaName: area, piMac: pimac},
			success: function(msg){	
	      		showMessage('success', 'New area updated!');
	        },
	        error:function(xhr, ajaxOptions, thrownError){ 
	          console.log(xhr.responseText);
	          console.log(thrownError); 
	        }
		});
		$(this).parents('div').remove();
	});

	$('body')
	  .on('click', '#btn-create', 
		function(event) {
		event.preventDefault();

		var groupno = $('#input-groupno').val();
		if(groupno == '' || isNaN(groupno)){
			$('#form-buildtable').append('Please input a number!').css('color', 'red');
			return;
		}
		$.each($('.map-entity.ready'), function(index, val) {
			 $(val).attr('data-group', groupno);
		});

		saveMapInfo();

		$(this).parents('div').remove();
	});

	$('body')
	  .on('click', '#btn-remove-group', 
	  	function(event) {
		event.preventDefault();
		var groupNo = $('.groupClicked').data('group');
		var area    = $('.nav-area a.selected').html();
		var selectedGroup = $('.map-entity.grouped[data-group=' + groupNo + ']');
		var amac = [];

		$.each(selectedGroup, function(index, val) {
			var a_mac = $(val).find('.map-seat').data('amac');
			if(typeof a_mac !== 'undefined'){
				amac.push(a_mac);
			}
			
		});

		$.ajax({
	      url: "remove.php",
	      type:"POST",
	      data: {target: 'group', groupn: groupNo, areaName: area, amac},
	      success: function(msg){
	      	//Clean group entity and seat
	      	selectedGroup.empty()
			 			 .removeAttr('data-group')
			 			 .removeClass('grouped');
			//Save
			saveMapInfo();
			showMessage('success', 'Group Removed!');
	      },
	      error:function(xhr, ajaxOptions, thrownError){ 
	        console.log(xhr.responseText);
	        console.log(thrownError); 
	      }
	    });

	  	$('.groupClicked').removeClass('groupClicked');
		$(this).parents('div').remove();
	});

	$('body')
	  .on('click', '#btn-remove-seat', 
	  	function(event) {
		event.preventDefault();
		var a_mac = $('.seatClicked').data('amac');

		if(typeof a_mac === 'undefined'){
			$('.map-seat.seatClicked').remove();
			showMessage('success', 'Seat Deleted!');
			saveMapInfo();
		}else{
			$.ajax({
		      url: "remove.php",
		      type:"POST",
		      data: {target: 'seat', amac: a_mac},
		      success: function(msg){
		      	showMessage('success', 'Seat Deleted!');
		      	$('.map-seat.seatClicked').remove();
		      	saveMapInfo();
		      },
		      error:function(xhr, ajaxOptions, thrownError){ 
		      	$('.map-seat.seatClicked').removeClass('seatClicked');
		        console.log(xhr.responseText);
		        console.log(thrownError); 
		      }
		    });
		}

		$(this).parents('div').remove();
	});	

	$('body')
	  .on('click', '#btn-remove-seat', 
	  	function(event) {
		event.preventDefault();
		var a_mac = $('.seatClicked').data('amac');

		if(typeof a_mac === 'undefined'){
			$('.map-seat.seatClicked').remove();
			showMessage('success', 'Seat Deleted!');
			saveMapInfo();
		}else{
			$.ajax({
		      url: "remove.php",
		      type:"POST",
		      data: {target: 'seat', amac: a_mac},
		      success: function(msg){
		      	showMessage('success', 'Seat Deleted!');
		      	$('.map-seat.seatClicked').remove();
		      	saveMapInfo();
		      },
		      error:function(xhr, ajaxOptions, thrownError){ 
		      	$('.map-seat.seatClicked').removeClass('seatClicked');
		        console.log(xhr.responseText);
		        console.log(thrownError); 
		      }
		    });
		}
		
		$(this).parents('div').remove();
	});	

	$('body')
	  .on('click', '#btn-change', 
	  	function(event) {
			event.preventDefault();
			var a_mac = $(this).parent().find('ul li:nth-child(2) p').html();

			$.ajax({
		      url: "update.php",
		      type:"POST",
		      data: {amac: a_mac},
		      success: function(msg){
		      	console.log('Status Changed!');
		      },
		      error:function(xhr, ajaxOptions, thrownError){ 
		        console.log(xhr.responseText);
		        console.log(thrownError); 
		      }
		    });
			$(this).parents('div').remove();
	});	

	$('body')
	  .on('click', '#btn-bind', 
	  	function(event) {
			event.preventDefault();
			var groupNo = $('.seatClicked').parent('div').data('group');
			var a_mac   = $('#input-bind').val();

			$.ajax({
		      url: "insert.php",
		      type:"POST",
		      data: {table_name: 'bind', groupn: groupNo, amac: a_mac},
		      success: function(msg){
		      	console.log(msg);
		      	$('.seatClicked').attr('data-amac', a_mac);
		      	saveMapInfo();
		      },
		      error:function(xhr, ajaxOptions, thrownError){ 
		        console.log(xhr.responseText);
		        console.log(thrownError); 
		      }
		    })		    
		    .always(function() {
		    	$('.seatClicked').removeClass('seatClicked');	   
		    	console.log("Binding completed!");
		    });


		    
			$(this).parents('div').remove();
	});	

	$('body')
	  .on('click', 'ul.title-area>li', 
	  	function(event) {
			event.preventDefault();
			var areaNow = $('div.title-area').attr('data-areaname');
			var areaTochagne = $(this).find('a').html().substring(5);


			$(this).find('a').html("Area " + areaNow);
			$('div.title-area').attr('data-areaname', areaTochagne);
			$('div.title-area>a').html("Area " + areaTochagne);

			updateTable(areaTochagne);
	});

	$('body')
	  .on('click', '#link-table', 
	  	function(event) {
			event.preventDefault();
			toggleLeftContainer();
			loadSeatTablePage();
	});


    //Link to Chart page
	$('body')
	  .on('click', '#link-chart', 
	  	function(event) {
		  	event.preventDefault();
		  	toggleLeftContainer();

		  	loadChartPage();
	});

	$('body')
	  .on('click', '#link-settings', 
	  	function(event) {
			event.preventDefault();

			//Remove all elements of right container
			// $('.section-map').children().filter(":not(.spinner)").remove();
			// $('.section-header').children().remove();
			// $('#btn-addtable').hide();
	});


	/*
	 * Replace all SVG images with inline SVG
	 */
	$('img.svg').each(function(){
	    var $img = $(this);
	    var imgID = $img.attr('id');
	    var imgClass = $img.attr('class');
	    var imgURL = $img.attr('src');

	    $.get(imgURL, function(data) {
	        // Get the SVG tag, ignore the rest
	        var $svg = $(data).find('svg');

	        // Add replaced image's ID to the new SVG
	        if(typeof imgID !== 'undefined') {
	            $svg = $svg.attr('id', imgID);
	        }
	        // Add replaced image's classes to the new SVG
	        if(typeof imgClass !== 'undefined') {
	            $svg = $svg.attr('class', imgClass+' replaced-svg');
	        }

	        // Remove any invalid XML tags as per http://validator.w3.org
	        $svg = $svg.removeAttr('xmlns:a');

	        // Check if the viewport is set, if the viewport is not set the SVG wont't scale.
	        if(!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
	            $svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'));
	        }

	         // Replace image with new SVG
	         $img.replaceWith($svg);
	         // .attr("style", "fill: #fff");
	    }, 'xml');

	 //    $('.section-function>ul>li').hover(function() {
		// 	    var el = $(this);
		// 	    var svg = el.find('svg path');
		// 	    svg.attr("style", "fill: #f46353");
		// 	}, function() {
		// 	    var el = $(this);
		// 	    var svg = el.find('svg path');
		// 	    svg.attr("style", "fill: #fff");
		// });

		// $('.svg').hover(function(){
		// 	var el = $(this);
		// 	var svg = el.find('svg path');
		// 	svg.attr("style", "fill: #f46353");
		//    }, function(){
		// 	    var el = $(this);
		// 	    var svg = el.find('svg path');
		// 	    svg.attr("style", "fill: #fff");
		// });
	});

	$('body')
	  .on('click', '.chart-work-option>li>a', 
	  	function(event) {

			event.preventDefault();
			if($(this).hasClass('clicked')){
				$(this).addClass('clicked');
				$('.nav-filters').slideToggle('slow');
			}else{
				$(this).removeClass('clicked');
				$('.nav-filters').slideToggle('slow');
			}
	});



});


/***
*
*
*
*
*
*
*
*
*
*						
*
*
*
*
*
*
*	↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓　SELF-DEFINED FUNCTION BELOW　↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
*
*	
**/


//Caculate the result of subtraction of timestamp with the format(HH:MM:SS).
function calcTimeDifferent(t){
	var d = Math.floor(t / 86400);
	t %= 86400;
	var h = Math.floor(t / 3600);
	t %= 3600;
	var m = Math.floor(t / 60);
	return  (d == 0 ? "" : d + " 天 ") + (h == 0 ? "" : h + " 小時 ") + (m + " 分鐘");
}		

function getRandomTime(){
	return Math.floor(Math.random() * 1500) + 500;
}

function showMessage(status, text){
	//status = {info, success, warning, error}
	if($('div').hasClass('alert-message')) return;

	$('<div class="alert-message ' + status + '">' +
	'<div class="box-icon"></div>' +
	'<p>' + text +
	'</div>') 
	.appendTo('body');
	$('div.alert-message').animate({right: '0'}, 200);					

	setTimeout( function(){
		$('div.alert-message').css('right', '');
		setTimeout( function() {
			$('div.alert-message').remove();	
		}, 500);
	}, 2300);
	
}

function showLoadingSpinner(){
	if($('div').hasClass('spinner')) return;

	//Add new div that works for loading
	$('<div class="spinner">' +
	  '<div class="bounce1"></div>' +
	  '<div class="bounce2"></div>' +
	  '<div class="bounce3"></div>' +
	  '</div>')
	.appendTo('.right-container');
}

function hideLoadingSpinner(){
	$('div.spinner').remove();
}

function show_seats_information(groupNo, a_mac) {
		var occu = 0, seating_time, status, status_time;
		if(a_mac == 0){
			var tool = "<div id='popup'><form id='form-buildtable'><ul><li>Group No.<p>"+ groupNo +"</li>" +
					"<li>Occupied<p>"+ (occu == 0 ? "no" : "yes") +"</li> <li>Update Time<p>No Binding Device</li></ul></br>" +
					"<button id='btn-close'>Close</button> <button id='btn-remove-seat'>Remove</button></br></br></br>" + 
					"<button id='btn-bind'>Bind</button> <input id='input-bind' placeholder='AA:BB:CC:DD' type='text'> </form></div>";

			$('body').append(tool);
			$('#popup').hide()
					   .show()
					   .addClass('visible');

		}else{
			$.ajax({
		        url: "getDataFromDB.php",
		        type:"POST",
		        data: {target: 'seatInfo', groupn: groupNo, amac: a_mac},
		        dataType:'JSON',
		        success: function(msg){
		        	occu = msg[0];
		        	last_change_time = msg[1];
		        	amac = msg[2];
			        	
			        var date = new Date(last_change_time * 1000),
			        	now = Date.now() / 1000 | 0,
			        	time_diff = calcTimeDifferent(now - last_change_time);      	
			        	status_time = occu != 0 ? "Seating Time" : "Idle Time";

					var tool = "<div id='popup'><form id='form-buildtable'><ul><li>Group No.<p>"+ groupNo +"</li>" +
						"<li>Arduino MAC<p>"+ amac +"</li>" +
						"<li>Occupied<p>"+ (occu == 0 ? "no" : "yes") +"</li> <li>Update Time<p>"+ date.toLocaleString() +"</li>" +
						"<li>" + status_time + "<p>"+ time_diff +"</li></ul>"+
						"<button id='btn-close'>Close</button> <button id='btn-remove-seat'>Remove</button></br></br></br>" + 
						"<button id='btn-change'>Change</button></form></div>";

						$('body').append(tool);
						$('#popup').hide()
								   .show()
								   .addClass('visible');
		        },
		        error:function(xhr, ajaxOptions, thrownError){ 
		          console.log(xhr.responseText);
		          console.log(thrownError); 
		        }
		    });		
		}
		
		
}

function toggleLeftContainer(){
		if ($('.left-container').hasClass('sidebar')){
			$('.left-container').removeClass('sidebar')

			$('.right-container').css({
    			position: 'relative',
                transform: 'translateX(0px)'
			});

			$('.left-container').css('transform', 'translateX(-220px)');
		}
		//show
		else{
			$('.left-container').addClass('sidebar')
			$('.right-container').css({
				position: 'absolute',
                transform: 'translateX(220px)'
			});
			$('.left-container').css('transform', 'translateX(0px)');
			// $('.left-container').css('display', 'block');
		}
}

function show_group_information (groupNo) {
		var tool = "<div id='popup'><form id='form-buildtable'><ul><li>Group No.<p>"+ groupNo +"</li></ul>" +
		"<button id='btn-close'>Close</button>  <button id='btn-remove-group'>Remove</button></form></div>";

		$("body").append(tool);
		$('#popup').hide()
					.show()
					.addClass('visible');
}

function show_form_create(){
		var form_popup = "<div id='popup'><form id='form-buildtable'>" +
		"<ul><li>Group No.<input id='input-groupno' placeholder='Number' type='text'></li></ul>" +
  		"<input id='btn-create' type='button' value='Create'/>" +
  		"<input id='btn-close' type='button' value='Cancel'/>" +
		"</form></div>";
		$("body").append(form_popup);
		$('#popup').hide()
					.show()
					.addClass('visible');
}

function loadSeatTablePage(){
	//Remove all elements in section-header
	$('.section-header').empty()
						.removeClass('chart');
	//Remove all elements in section-map
	$('.section-map').empty();
	//Remove all elements in section-content
	$('.section-content').remove();

	showLoadingSpinner();

	//Get area name from Database via ajax
	$.ajax({
		url: 'getDataFromDB.php',
		type: 'POST',
		dataType: 'JSON',
		data: {action: 'areaName'},
		success: function(msg){

			setTimeout(function(){
				hideLoadingSpinner()
			}, getRandomTime());

			var li_element = "";
			$.each(msg, function(index, val) {
				li_element += "<li><center><a>" + val + "</a></center></li>";
			});
				li_element += "<li id='btn-addArea'><center><a>+</a></center></li>"
			//Load area element
			$('<ul></ul>').addClass('nav-area')
						  .append(li_element)
						  .appendTo('.section-header');

		},
		error:function(xhr, ajaxOptions, thrownError){ 
			showMessage('error', 'Load data failed!');
	    	console.log(xhr.responseText);
	    	console.log(thrownError); 
	    }
	})
	.fail(function() {
		showMessage('error', 'Load data failed!');
	});

}

function loadChartPage(){
	//Empty all elements in section-header
	$('.section-header').empty();
	//Remove all elements in section-content
	$('.section-content').remove();
	//Remove all elements in section-map
	$('.section-map').remove();
	//Remove all elements in section-tools
	$('.section-tools').remove();
	showLoadingSpinner();

	setTimeout(function(){
		hideLoadingSpinner();
		var Chartfunction_array = ['Dinning Time', 'Come Store Rate', 'Leave Store Rate', 'Turn Rate'];
		var Timing_array   = ['Today', 'Week', 'Same Day Weeks Ago', 'Compare Weeks', 'Compare Months'];

		var li_element = "";
		$.each(Chartfunction_array, function(index, val) {
			li_element += "<li class='chart-function'><a>" + val + "</a></li>";
		});
		$('.section-header').addClass('chart'); 
		//Load chart function elements
		$('<ul></ul>').addClass('nav-chart')
					  .append(li_element)
					  .appendTo('.section-header');

		li_element = "";
		$.each(Timing_array, function(index, val) {
			li_element += "<li class='chart-timing'><a>" + val + "</a></li>";
		});

		$('<ul></ul>').addClass('nav-chartTiming')
					  .append(li_element)
					  .appendTo('.section-header');

	}, getRandomTime());

}

function loadSettingsPage(){

}

function showMapTool(){
	var div_tools = 
	      $('<div class="section-tools">' +
	                    '<span class="tool-toggle">Edit</span>' +
	                    '<form>' +
	                        '<div class="tool-cell">' +
	                            '<p class="map-tool-name">Seat</p>' +
	                            '<input class="map-tool" id="tool-seat" name="check" value="Seat" type="radio"><label for="tool-seat"></label>' +
	                        '</div>' +
	                        '<div class="tool-cell">' +
	                            '<img id="img-table" ondragstart="drag(event)" ondragend="dragEnd(event)" draggable="true" width="40" height="40" src="assets/furniture72.SVG">' +
	                        '</div>' +
	                        '<div class="tool-cell">' +
	                            '<p class="map-tool-name">Group</p>' +
	                            '<input class="map-tool" id="tool-group" name= "check" value="Group" type="radio">' +
	                            '<label for="tool-group"></label>' +
	                        '</div>' +
	                        '<div class="tool-cell">' +
	                            '<a class="map-tool" id="btn-saveMapInfo">SAVE</a>' +
	                        '</div>' +
	                    '</form>' +
	                '</div>')
		  .appendTo('.right-container');
}

function loadMap(area) {
	//Remove all elements in section-map
	$('.section-map').remove();
	//Remove .section-information
	$('div.section-information').remove();
	//Remove .map-tools
	$('div.section-tools').remove();
	//Remove .section-content
	$('div.section-content').remove();

	$('<div class="section-content"></div>').appendTo('.right-container')
											.hide();
	if(!$('div').hasClass('spinner'))
		showLoadingSpinner()

	$.getJSON('data/' + area + '.json', function(json, textStatus) {
			$.each(json, function(index, val) {
				if(val.type == 'entity'){
					removeMap();
					createMap(val.no, val.no);
				}
				else if(val.type == 'group'){
					var pos = val.x + '-' + val.y;
					$('.map-entity[data-position=' + pos + ']').addClass('grouped')
															   .attr('data-group', val.no)
															   .css('cursor', 'pointer');
				}
				else if(val.type == 'seat'){
					var pos  = val.x + '-' + val.y,
					    amac = val.a_mac;
					    img  = document.createElement('img'),
	        		    style = "margin-top: 25%; cursor: pointer;";

	    			$(img).attr({
	    			  "width" : 40,
	    			  "height": 40,
	    			  "src"   : 'assets/furniture72.SVG',
	    			  "class" : 'map-seat',
	    			  "style" : style,
	    			  "draggable": false //Entities are unable to drag.
			    	}); 
			    	if(amac != '') $(img).attr('data-amac', amac);
			    	
			    	$('.map-entity[data-position=' + pos + ']').append(img);
				}
			});

			setTimeout(function(){
				hideLoadingSpinner();
				$('.section-content').show();
				showMapTool();

			}, getRandomTime());


	})
	.error(function(){

		setTimeout(function(){
			hideLoadingSpinner();
			$('.section-content').show();
	 		$('<div id="div-createMap">' +
	            '<h1>Let\'s create a <b>map</b> for seats</h1>' +
	            '<lable for="points"></label>' +
	            '<input type="number" id="scroll" name="points" min="5" max="10" value="5"></input>' +
	            '<input id="btn-createMap" value="Create" type="button">' +
	        '</div>').appendTo('.section-content');

			var el = $('input[type="number"]');

			// add elements
			el.wrap('<div class="numberPicker"></div>');     
			el.before('<span class="sub">-</span>');
			el.after('<span class="add">+</span>');
			// substract
			el.parent().on('click', '.sub', function () {
			if (el.val() > parseInt(el.attr('min')))
				el.val( function(i, oldval) { return --oldval; });
			});

			// increment
			el.parent().on('click', '.add', function () {
				if (el.val() < parseInt(el.attr('max')))
					el.val( function(i, oldval) { return ++oldval; });
			});

		}, getRandomTime());


	});

}

function updateTable(area){
   	var allSeat = 0;
   	var emptySeat = 0;
   	var areaName = area;

	// $.ajax({
 //        url: 'getDataFromDB.php',
 //        type:'POST',
 //        data: {table_name: '2', area: areaName},
 //        dataType:'JSON',

 //        success: function(msg){
 //        	$('body').find('.table').remove(); //Remove all the table div then
 //        	//Readd all tables
 //        	$.each(msg, function(index){
 //        		createTable(msg[index][0], msg[index][1]);
 //        		//count the occupied seats
 //        		for (var i = 0; i < msg[index][1].length; i++) {
 //        			if(msg[index][1][i][1] == 1) emptySeat++;
 //        			allSeat++;
 //        		};
 //        	});

 //         	//Update all/empty seat text 
 //        	$('#number-all').text(allSeat);
 //        	$('#number-empty').text(emptySeat); 
 //        	$('.show-condition').css('visibility', 'visible');
 //        },
 //        error:function(xhr, ajaxOptions, thrownError){ 
 //          console.log(xhr.responseText);
 //          console.log(thrownError); 
 //        }
 //    });
}


///////////////////////////////////
/** Map-related functions below **/

function dragEnd(){
	$('.map-entity').removeClass('disabled');
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.src);
    $('.map-entity:not(.grouped)').addClass('disabled');
}
function allowDrop(ev) {
    ev.preventDefault();
}
//Triggered when draggable table icon drops on each entity
function drop(ev) {
    ev.preventDefault();
    var targetEntity = $('.map-entity.active');

    targetEntity.removeClass('active');

    //Avoid duplication of the seat img.
    if(targetEntity.has('img').length){
    	showMessage('error', 'Please dont do that :(-');
    }
    else if(targetEntity.hasClass('grouped')){
	    var data = ev.dataTransfer.getData("text"),
	        img  = document.createElement('img'),
	        style= "margin-top: 25%; cursor: pointer;";

	    $(img).attr({
	    			  "width" : 40,
	    			  "height": 40,
	    			  "src"   : data,
	    			  "class" : 'map-seat',
	    			  "style" : style,
	    			  "draggable": false //Entities are unable to drag.
	    		})
	           .appendTo(ev.target);   	
    }else{
    	showMessage('error', 'Please put it on a group!');
    }

}

//Create maps
function createMap(row, col){

    var rectWidth = (20 - row) * 5,
        rowEntity = row,
        colEntity = col,
        w = rowEntity * rectWidth + 15,
        h = colEntity * rectWidth + 10;

    var div_sectionMap =
    				$('<div></div>').addClass('section-map')
    								.appendTo('.section-content');

    var div_mainMap = $('<div></div>').css({
    							width: w,
                        		height: h
                               })
                              .addClass('div-map')
                              .attr('data-row', row)
    						  .appendTo('.section-map');

    var div_mapInfo = 
    		$('<div style="height:' + (h + 5)+ 'px;" class="section-information">'+
			    '<div class="map-info">Idle<div class="map-info-detail">5</div></div>' +
                '<div class="map-info">Serving<div class="map-info-detail">10</div></div>' +
                '<div class="map-info">Avg<br>Idle<div class="map-info-detail">5.1</div></div>' +
                '<div class="map-info">Avg<br>Serving<div class="map-info-detail">2.7</div></div> </div>')
    			.appendTo('.section-content');

    //Create [row x col] blocks
	for (var i = 0; i < rowEntity; i++) {
        for (var j = 0; j < colEntity; j++) {
                  $(document.createElement('div'))
                  .css({
                        width: rectWidth,
                        height: rectWidth,
                  })
                  .attr("data-position", (i + 1) + "-" + (j + 1))
                  .attr("ondrop", "drop(event)")
                  .attr("ondragover", "allowDrop(event)")
                  .addClass('map-entity')
                  .appendTo('.div-map')
                  .on(
                      'dragover',
                      function(event) {
                      		event.preventDefault();
                        	$(this).addClass('active');
                       })
                  .on(
                      'dragleave',
                      function(event) {
                        $(this).removeClass('active');
                      })
                  .drop
                    ("start",
                    	function(){
                    	 $(this).addClass("active");
                    })
                  .drop
                    (function( ev, dd ){
    					ev.preventDefault();
    					ev.stopPropagation();

    					//Avoid duplication of group.
    					if( $('.map-entity.grouped.disabled.active').length > 0 ){
    						showMessage('error', 'Some group already created!');
    						return;
    					}else{
    						show_form_create();
	                		$(this).addClass("ready");
    					}
                  })
                  .drop(
                  	'end',
                  	  function(){
                        $(this).removeClass("active");
                  });

                  $.drop({ multi: true });
        }
    }
}


function saveMapInfo(){
		var areaName = $('li.selected').find('a').html();
		var rowNo    = $('.div-map').data('row'),
		    viewData =  {
		    				group : [],
		    				seat  : []
						};

		//Set number of row entities.
		viewData['entity'] = rowNo;
		//Set area name
		viewData['areaName'] = areaName;
		//Selected group prepared to create.
		$.each($('.map-entity.ready'), function(index, val) {
			var groupno  = $(this).data('group');
		   	var   str    = $(this).data('position');
		   	var position = new Array();
		   	    position = str.split('-');
		   	if(typeof groupno == 'undefined') return;

			var jsonData = {};
			    jsonData['no'] = groupno;
		        jsonData['x']  = position[0].trim();
		        jsonData['y']  = position[1].trim();

		    viewData.group.push(jsonData);
	    });
		$('.map-entity.ready').removeClass('ready')
							  .addClass('grouped');

	    var group = $('.map-entity.grouped');
	    //Group that already exists.
	    $.each(group, function(index, val) {
			var groupno  = $(this).data('group');
		   	var   str    = $(this).data('position');
		   	var position = new Array();
		   	    position = str.split('-');
		   	if(typeof groupno == 'undefined') return;

			var jsonData = {};
			    jsonData['no'] = groupno;
		        jsonData['x']  = position[0].trim();
		        jsonData['y']  = position[1].trim();

		    viewData.group.push(jsonData);
	    });

	    //Seat
	    if(group.find('img.map-seat').length > 0 ){
			$.each(group.find('img.map-seat'), function(index, val) {
			   	var   str    = $(val).parent('div').data('position'),
			   		  amac   = $(val).data('amac'),
			   	    position = new Array();
			   	    position = str.split('-');

				var jsonData = {};
			        jsonData['x'] = position[0].trim();
			        jsonData['y'] = position[1].trim();
			        typeof amac === 'undefined' ? jsonData['a_mac'] = '' : jsonData['a_mac'] = amac;

			    viewData.seat.push(jsonData);
			});
	    }

	    //Write map info into file
		$.ajax({
	      url: 'writeMap.php',
	      type: 'POST',
	      data: {data: viewData},
	      success: function(msg){	
	      	showMessage('info', 'Map saved!');
	      },
	      error:function(xhr, ajaxOptions, thrownError){ 
	        console.log(xhr.responseText);
	        console.log(thrownError); 
	      }
	    });

		//Insert map info into database
		$.ajax({
			url: 'insert.php',
			type: 'POST',
			data: {target: 'map', area: areaName, data: viewData},
			success: function(msg){
				console.log('Database updated!');
	        },
	        error:function(xhr, ajaxOptions, thrownError){ 
	          console.log(xhr.responseText);
	          console.log(thrownError); 
	        }
		});

}

function removeMap(){
	//Check if the div exists.
	if($('.div-map').length){
		$('.div-map').remove();
	}
}
///////////////////////////////////



function createTable (_table_no, _seats_no) {
	var tableno = _table_no;
	var div_seats_string = "";

	for (var i = 0; i < _seats_no.length; i++) {

		//if seat is occupied, change that background value with css
		if(_seats_no[i][1] == 0){
			div_seats_string += "<li><div data-table-no="+ tableno +" class='seats'>"+ _seats_no[i][0] +"</div></li>";
		}else{
			div_seats_string += "<li><div data-table-no="+ tableno +" class='seats occupied'>"+ _seats_no[i][0] +"</div></li>";
		}
	};

	var table = "<div class='table'>"+
                  "<div class='table-spilt-top'>"+ tableno +"</div>"+
                  "<div class='table-spilt-bot'>"+
                      "<ul>" +  div_seats_string + "</ul></div></div>";

	$('.section-map').append(table);
	$('.table').last().addClass('table');// add css
	$('.seats').unbind();
	$('.seats').bind('click', show_seats_information);
	$('.seats.occupied').css('background', '#68B0AB');

	$(".table-spilt-top").unbind();
	$(".table-spilt-top").bind('click', show_table_information);
}



