document.write ("<script language='javascript' src='../mychart.js'></script>");
document.write ("<script language='javascript' src='../StringToData.js'></script>");
document.write ("<script language='javascript' src='../Chart.js'></script>");
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
	      	updateMapInfo();
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
	  		event.stopPropagation();
	  		var groupNo = $(this).data('group');
	  		$(this).addClass('groupClicked');
	  	    show_group_information(groupNo);
	  });

	//Change event of tools that can create seats and groups on map.
	$('body')
	  .on('change', 'input[name=check]',
	     function(event) {

	         if($('input:checked').val() == 'Group'){
	         	 $('#img-table').attr('draggable', 'false');
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
		      		$('#img-table').attr('draggable', 'true');
		            $(document).unbind();
		      }
    });
	
	//Area options
	$('body')	
	  .on('click', '.nav-area>li',
	  	 function(event) {
		  	event.preventDefault();
		  	var areaName = $(this).find('a').html();

		  	//Avoid repeatedly showing spinner
		  	if($('div').hasClass('spinner')) return;

		  	if(areaName == '+') return;
		  	if(typeof areaName !== 'undefined'){
		  		loadMap(areaName);
		    }
		    $(this).siblings('li').attr('disabled', true);
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

//		
			var target = $(this).find('a').html();
			var tar = "";
			
			//Driver case
			if(target == 'Driver'){
				$('.nav-chartTiming').remove();
				var Timing_array = ['Driver Info', 'Today', 'Compare Weeks'];
				var li_element = "";
				$.each(Timing_array, function(index, val) {
					li_element += "<li class='chart-timing'><a>" + val + "</a></li>";
				});

				$('<ul></ul>').addClass('nav-chartTiming')
							  .append(li_element)
							  .appendTo('.section-header');
			}else{
				$('.nav-chartTiming').remove();
				var Timing_array = ['Today', 'Week', 'Same Day Weeks Ago', 'Compare Weeks', 'Compare Months'];
				var li_element = "";
				$.each(Timing_array, function(index, val) {
					li_element += "<li class='chart-timing'><a>" + val + "</a></li>";
				});

				$('<ul></ul>').addClass('nav-chartTiming')
							  .append(li_element)
							  .appendTo('.section-header');
			}
//


			$('.section-content').remove();
			$(this).siblings().removeClass('selected');
			$(this).addClass('selected');
			$('ul.nav-chartTiming').addClass('display');
			$('li.chart-timing').removeClass('selected')
								.first()
								.addClass('selected');

			$('<div class="section-content"></div>').appendTo('.right-container')
			// var target = $(this).find('a').html();
			// var tar = "";

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
						break;
					case 'People':
						tar += "people";
						break;
					case 'Come Taxi':
						tar += "come_taxi";
						break;
					case 'Sit Time':
						tar += "sit_time";
						break;
					case 'Leave Taxi':
						tar += "leave_taxi";
						break;
					case 'Driver':
						tar += "driver";
			}

			$('<div id="' + tar + '_today" class="chart-cell">' +
				'<canvas style="float:left; margin: 0 20%;" id="today" width="300" height="400"></canvas>' +
			'</div>')
			.appendTo('.section-content');

			//Restaurant case
			if(target == 'Dinning Time')
			{eating_time_today();}
			else if(target == 'Come Store Rate')
			{come_store_today();}
			else if(target == 'Leave Store Rate')
			{leave_store_today();}
			else if(target == 'Turn Rate')
			{turn_rate_today();}

			//Taxi case
			else if(target == 'People')
			{people_today();}
			else if(target == 'Come Taxi')
			{come_taxi_today();}
			else if(target == 'Sit Time')
			{sit_time_today();}
			else if(target == 'Leave Taxi')
			{leave_taxi_today();}
			else if(target == 'Driver'){
				$('.chart-cell').remove();
				loadDriverInfo(); 
				return;
			}

			//Chart title on the bottom
			$('<div></div>').html('<b>' + target + '</b>  ( Today )')
				.addClass('chart-meta')
				.appendTo('div.chart-cell:last-child');
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
						break;
					case 'People':
						tar += "people";
						break;
					case 'Come Taxi':
						tar += "come_taxi";
						break;
					case 'Sit Time':
						tar += "sit_time";
						break;
					case 'Leave Taxi':
						tar += "leave_taxi";
						break;
					case 'Driver':
						tar += "driver";
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
						break;
					case 'Driver Info':
						tar += "_info";
				}
				console.log(tar);
				$('*[id="' + tar +'"]').remove();
				return;
			}

			$(this).addClass('selected');


			if(target =='Driver Info'){
				loadDriverInfo();
				return;
			}
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
							'<canvas style="float:left; margin: 0px 20%;" id="today" width="300" height="400"></canvas>' +
						'</div>')
						.appendTo('.section-content');
						come_store_today();
						break;
					case 'Leave Store Rate':
						$('<div id="leave_store_today" class="chart-cell">' +
							'<canvas style="float:left; margin: 0px 20%;" id="today" width="300" height="400"></canvas>' +
						'</div>')
						.appendTo('.section-content');
						leave_store_today();
						break;
					case 'Turn Rate':
						$('<div id="turn_rate_today" class="chart-cell">' +
							'<canvas style="float:left; margin: 0px 20%;" id="today" width="300" height="400"></canvas>' +
						'</div>')
						.appendTo('.section-content');
						turn_rate_today();
					case 'People':
						$('<div id="people_today" class="chart-cell">' +
							'<canvas style="float:left; margin: 0px 20%;" id="today" width="300" height="400"></canvas>' +
						'</div>')
						.appendTo('.section-content');
						people_today();
						break;
					case 'Come Taxi':
						$('<div id="come_taxi_today" class="chart-cell">' +
							'<canvas style="float:left; margin: 0px 20%;" id="today" width="300" height="400"></canvas>' +
						'</div>')
						.appendTo('.section-content');
						come_taxi_today();
						break;
					case 'Leave Taxi':
						$('<div id="leave_taxi_today" class="chart-cell">' +
							'<canvas style="float:left; margin: 0px 20%;" id="today" width="300" height="400"></canvas>' +
						'</div>')
						.appendTo('.section-content');
						leave_taxi_today();
						break;
					case 'Sit Time':
						$('<div id="sit_time_today" class="chart-cell">' +
							'<canvas style="float:left; margin: 0px 20%;" id="today" width="300" height="400"></canvas>' +
						'</div>')
						.appendTo('.section-content');
						sit_time_today();
						break;
					case 'Driver':
						$('<div id="driver_today" class="chart-cell">' +
							'<canvas style="float:left; margin: 0px 20%;" id="today" width="300" height="400"></canvas>' +
						'</div>')
						.appendTo('.section-content');
						overtime_today();
				}
			//Week
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
					case 'People':
						$('<div id="people_week" class="chart-cell">' +
							'<div style="float:left" id="seven_days" width="300" height="400"></div>' +
						'</div>')
						.appendTo('.section-content');
						people_seven_days();
						break;
					case 'Come Taxi':
						$('<div id="come_taxi_week" class="chart-cell">' +
							'<canvas style="float:left" id="seven_days" width="300" height="400"></canvas>' +
							'<div style="float:left"></div>' + 
						'</div>')
						.appendTo('.section-content');
						come_taxi_seven_days();
						break;
					case 'Leave Taxi':
						$('<div id="leave_taxi_week" class="chart-cell">' +
							'<canvas style="float:left" id="seven_days" width="300" height="400"></canvas>' +
							'<div style="float:left"></div>' + 
						'</div>')
						.appendTo('.section-content');
						leave_taxi_seven_days();
						break;
					case 'Sit Time':
						$('<div id="sit_time_week" class="chart-cell">' +
							'<div style="float:left" id="seven_days" width="300" height="400"></div>' +
						'</div>')
						.appendTo('.section-content');
						sit_time_seven_days();
					// 	break;
					// case 'Driver':
					// 	$('<div id="driver_today" class="chart-cell">' +
					// 		'<canvas style="float:left" id="seven_days" width="300" height="400"></canvas>' +
					// 	'</div>')
					// 	.appendTo('.section-content');
					// 	who_overtime_this_week();
				}
			//Same Day Weeks ago
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
					case 'People':
						$('<div id="people_same_day" class="chart-cell">' +
							'<div style="float:left" id="weeks_ago_same_day" width="300" height="400"></div>' +
						'</div>')
						.appendTo('.section-content');
						people_weeks_ago_same_day();
						break;
					case 'Come Taxi':
						$('<div id="come_taxi_same_day" class="chart-cell">' +
							'<canvas style="float:left" id="weeks_ago_same_day" width="300" height="400"></canvas>' +
							'<div style="float:left"></div>' + 
						'</div>')
						.appendTo('.section-content');
						come_taxi_weeks_ago_same_day()
						break;
					case 'Leave Taxi':
						$('<div id="leave_taxi_same_day" class="chart-cell">' +
							'<canvas style="float:left" id="weeks_ago_same_day" width="300" height="400"></canvas>' +
							'<div style="float:left"></div>' + 
						'</div>')
						.appendTo('.section-content');
						leave_taxi_weeks_ago_same_day()
						break;
					case 'Sit Time':
						$('<div id="sit_time_same_day" class="chart-cell">' +
							'<div style="float:left" id="weeks_ago_same_day" width="300" height="400"></div>' +
						'</div>')
						.appendTo('.section-content');
						sit_time_weeks_ago_same_day()
						break;
					// case 'Driver':
					// 	$('<div id="driver_same_day" class="chart-cell">' +
					// 		'<canvas style="float:left" id="weeks_ago_same_day" width="300" height="400"></canvas>' +
					// 	'</div>')
					// 	.appendTo('.section-content');
						// who_overtime_this_week();
				}
			//Comepare Weeks
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
					case 'People':
						$('<div id="people_compare_weeks" class="chart-cell">' +
							'<div style="float:left" id="compare_weeks" width="300" height="400"></div>' +
						'</div>')
						.appendTo('.section-content');
						people_compare_weeks();
						break;
					case 'Come Taxi':
						$('<div id="come_taxi_compare_weeks" class="chart-cell">' +
							'<canvas style="float:left" id="compare_weeks" width="300" height="400"></canvas>' +
							'<div style="float:left"></div>' + 
						'</div>')
						.appendTo('.section-content');
						come_taxi_compare_weeks();
						break;
					case 'Leave Taxi':
						$('<div id="leave_taxi_compare_weeks" class="chart-cell">' +
							'<canvas style="float:left" id="compare_weeks" width="300" height="400"></canvas>' +
							'<div style="float:left"></div>' + 
						'</div>')
						.appendTo('.section-content');
						leave_taxi_compare_weeks();
						break;
					case 'Sit Time':
						$('<div id="sit_time_compare_weeks" class="chart-cell">' +
							'<div style="float:left" id="compare_weeks" width="300" height="400"></div>' +
						'</div>')
						.appendTo('.section-content');
						sit_time_compare_weeks();
						break;
					case 'Driver':
						$('<div id="driver_compare_weeks" class="chart-cell">' +
							'<div style="float:left" id="compare_weeks" width="300" height="400"></div>' +
						'</div>')
						.appendTo('.section-content');
						overtime_compare_weeks();
				}
			//Compare months
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
					case 'People':
						$('<div id="people_compare_months" class="chart-cell">' +
							'<div style="float:left" id="compare_months" width="300" height="400"></div>' +
						'</div>')
						.appendTo('.section-content');
						people_compare_months();
						break;
					case 'Come Taxi':
						$('<div id="come_taxi_compare_months" class="chart-cell">' +
							'<canvas style="float:left" id="compare_months" width="300" height="400"></canvas>' +
							'<div style="float:left"></div>' + 
						'</div>')
						.appendTo('.section-content');
						come_taxi_compare_months();
						break;
					case 'Leave Taxi':
						$('<div id="leave_taxi_compare_months" class="chart-cell">' +
							'<canvas style="float:left" id="compare_months" width="300" height="400"></canvas>' +
							'<div style="float:left"></div>' + 
						'</div>')
						.appendTo('.section-content');
						leave_taxi_compare_months();
						break;
					case 'Sit Time':
						$('<div id="sit_time_compare_months" class="chart-cell">' +
							'<div style="float:left" id="compare_months" width="300" height="400"></div>' +
						'</div>')
						.appendTo('.section-content');
						sit_time_compare_months();
						break;
					// case 'Driver':
					// 	$('<div id="driver_compare_months" class="chart-cell">' +
					// 		'<canvas style="float:left" id="compare_months" width="300" height="400"></canvas>' +
					// 	'</div>')
					// 	.appendTo('.section-content');
						// driver_compare_months();
				}
			}

			$('<div></div>').html('<b>' + function_target + '</b>  ( ' + target + ' )')
							.addClass('chart-meta')
							.appendTo('div.chart-cell:last-child');

	});

	$('body')
	  .on('click', '#btn-addArea',
	    function(event) {
	  	  event.preventDefault();
	  	  	var form_popup = "<div id='popup'><form id='form-createArea'>" +
			"<ul><li>Area Name<input id='input-areaName' placeholder='A, B, Outdoor, ...' type='text' required></li>" +
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
		  	updateMapInfo();
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
	      		showMessage('success', 'New area *' + area + '* added!');
	      		loadSeatTablePage();
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
	  .on('click', '.remove-area', 
	  	function(event) {
		event.preventDefault();
		var area    = $('.nav-area a.selected').html();
		var tool = "<div id='popup'><form id='form-buildtable'><ul>" +
					"<li class='u-textCenter'>Wanna delete " + area +" ? </li></ul>" +
					"<button id='btn-remove-area'>Remove</button> <button id='btn-close'>Close</button>" + 
					"</form></div>";

		$('body').append(tool);
		$('#popup').hide()
				   .show()
				   .addClass('visible');
	});

	//Delete area
	$('body')
	  .on('click', '#btn-remove-area', 
	  	function(event) {
		event.preventDefault();
		var area    = $('.nav-area a.selected').html();
		var amacOnMap  = {};
		var piMac = $('ul.nav-area li.selected').data('pimac');

		$.each($('.map-seat'), function(index, val) {
			if(typeof $(val).data('amac') !== 'undefined')
				amacOnMap[index] = $(val).data('amac');
		});
	
		$.ajax({
	      url: "remove.php",
	      type:"POST",
	      data: {target: 'area', pimac: piMac, amac: amacOnMap, areaName: area},
	      success: function(msg){
	      	console.log(msg);
	      	loadSeatTablePage();
			showMessage('success', 'Area ' + area + ' Removed!');
	      },
	      error:function(xhr, ajaxOptions, thrownError){ 
	        console.log(xhr.responseText);
	        console.log(thrownError); 
	      }
	    });

		$(this).parents('div').remove();
	});

	$('body')
	  .on('click', '#btn-remove-group', 
	  	function(event) {
		event.preventDefault();
		var groupNo = $('.groupClicked').data('group');
		var area    = $('.nav-area a.selected').html();
		var selectedGroup = $('.map-entity.grouped[data-group=' + groupNo + ']');
		var a_mac = [];

		$.each(selectedGroup, function(index, val) {
			var a_mac = $(val).find('.map-seat').data('amac');
			if(typeof a_mac !== 'undefined'){
				amac.push(a_mac);
			}
			
		});

		$.ajax({
	      url: "remove.php",
	      type:"POST",
	      data: {target: 'group', groupn: groupNo, areaName: area, amac: a_mac},
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
		      	updateMapInfo();
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
		      data: {target: 'bind', groupn: groupNo, amac: a_mac},
		      success: function(msg){
		      	$('.seatClicked').attr('data-amac', a_mac);
		      	updateMapInfo();
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


	// $('body')
	//   .on('click', 'div.map-info', 
	//   	function(event) {
	// 		event.preventDefault();
	// 		updateMapInfo();

	// });

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

	// /*
	//  * Replace all SVG images with inline SVG
	//  */
	// $('img.svg').each(function(){
	//     var $img = $(this);
	//     var imgID = $img.attr('id');
	//     var imgClass = $img.attr('class');
	//     var imgURL = $img.attr('src');

	//     $.get(imgURL, function(data) {
	//         // Get the SVG tag, ignore the rest
	//         var $svg = $(data).find('svg');

	//         // Add replaced image's ID to the new SVG
	//         if(typeof imgID !== 'undefined') {
	//             $svg = $svg.attr('id', imgID);
	//         }
	//         // Add replaced image's classes to the new SVG
	//         if(typeof imgClass !== 'undefined') {
	//             $svg = $svg.attr('class', imgClass+' replaced-svg');
	//         }

	//         // Remove any invalid XML tags as per http://validator.w3.org
	//         $svg = $svg.removeAttr('xmlns:a');

	//         // Check if the viewport is set, if the viewport is not set the SVG wont't scale.
	//         if(!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
	//             $svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'));
	//         }

	//          // Replace image with new SVG
	//          $img.replaceWith($svg);
	//          // .attr("style", "fill: #fff");
	//     }, 'xml');

	//  //    $('.section-function>ul>li').hover(function() {
	// 	// 	    var el = $(this);
	// 	// 	    var svg = el.find('svg path');
	// 	// 	    svg.attr("style", "fill: #f46353");
	// 	// 	}, function() {
	// 	// 	    var el = $(this);
	// 	// 	    var svg = el.find('svg path');
	// 	// 	    svg.attr("style", "fill: #fff");
	// 	// });

	// 	// $('.svg').hover(function(){
	// 	// 	var el = $(this);
	// 	// 	var svg = el.find('svg path');
	// 	// 	svg.attr("style", "fill: #f46353");
	// 	//    }, function(){
	// 	// 	    var el = $(this);
	// 	// 	    var svg = el.find('svg path');
	// 	// 	    svg.attr("style", "fill: #fff");
	// 	// });
	// });

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

	svgFormater();

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


Date.prototype.today = function () { 
    return this.getFullYear() + "/" + 
    		(((this.getMonth()+1) < 10) ? "0" : "") +
    		(this.getMonth() + 1) + "/" + 
    		((this.getDate() < 10) ? "0" : "" ) + 
    		this.getDate();
}

// For the time now
Date.prototype.timeNow = function () {
     return ((this.getHours() < 10) ? "0" : "") + this.getHours() +":"+ ((this.getMinutes() < 10) ? "0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
}

function svgFormater(){
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
				li_element += "<li data-pimac=" + val[1] +"><a>" + val[0] + "</a></li>";
			});
				li_element += "<li id='btn-addArea'><a>+</a></li>"
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

	var userType;

	$.ajax({
		url: 'getDataFromDB.php',
		type: 'POST',
		dataType: 'JSON',
		data: {target: 'Uid'},
		success: function(msg){
			userType = msg[0];
			//Check type
			if(userType == '餐廳'){
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
			else if(userType == '計程車'){
				setTimeout(function(){
					hideLoadingSpinner();
					var Chartfunction_array = ['Driver','People', 'Come Taxi', 'Leave Taxi', 'Sit Time'];
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

					//
					loadDriverInfo();	  

				}, getRandomTime());
			}
		},
		error:function(xhr, ajaxOptions, thrownError){ 
	    	console.log(xhr.responseText);
	    	console.log(thrownError); 
	    }

	});
	
}

function loadDriverInfo(){
	if(!$('div').hasClass('section-content'))
		$('<div class="section-content"></div>').appendTo('.right-container');
	if($('table').hasClass('table-main'))
		$('.table-main').remove();

	var driver = driver_today();
	var tdStr = "";

	for(var key in driver){
		var name = key,
			plate = driver[key],
			overtime = 'yes';
		
		tdStr +=  ('<tr>' +
				    '<td>' + name + '</td>' +
				    '<td>' + plate + '</td>' +
				    '<td>' + overtime + '</td>' +
				  '</tr>');
	}
	
	$(' <table id="driver_info" class="table-main">' +
		 '<tr>' +
		    '<th>Driver Name</td>' +
		    '<th>Number Plate</td>' +
		    '<th>Over Time</td>' +
		  '</tr>'+ tdStr + '</table>')
	.appendTo('.section-content');
	
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
	                            '<img id="img-table" ondragstart="drag(event)" ondragend="dragEnd(event)" draggable="false" width="40" height="40" src="assets/furniture72.SVG">' +
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
		showLoadingSpinner();
	
	//Load all area name from areaname.json file
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
			    	}).addClass('svg'); 
			    	if(amac != '') $(img).attr('data-amac', amac);
			    	
			    	$('.map-entity[data-position=' + pos + ']').append(img);
				}
			});

			setTimeout(function(){
				hideLoadingSpinner();
				updateMapInfo();
				$('.section-content').show();
				showMapTool();

			}, getRandomTime());


	})
	.error(function(){
		setTimeout(function(){
			hideLoadingSpinner();
			$('.section-content').show();
	 		$('<div id="div-createMap">' +
	            '<h1>Let\'s create a map for seats!</h1>' +
	            '<lable for="points"></label>' +
	            '<input type="number" id="scroll" name="points" min="5" max="10" value="5"></input>' +
	            '<input style="width: 30%; padding: 12px; cursor: pointer; font-size: 20px; border: 1px solid #FFF; color: #FFF; background: rgb(22, 160, 133) none repeat scroll 0% 0%;" id="btn-createMap" value="Create" type="button">' +
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

//Update number of serving and idle seats
function updateMapInfo(){
   	var allSeat   = $('.map-seat').length,
   	    idleSeat  = 0,
   	    seatingSeat = 0,
   		amacOnMap = {},
   		areaName  = $('ul.nav-area').find('a.selected').html(),
   		piMac     = $('ul.nav-area li.selected').data('pimac'),
   		currentTime = new Date().today() + " " + new Date().timeNow();

	$.each($('.map-seat'), function(index, val) {
		if(typeof $(val).data('amac') !== 'undefined')
			amacOnMap[index] = $(val).data('amac');
	});

	//Number of seat which has been bound > 0
	if(Object.keys(amacOnMap).length > 0){
		$.ajax({
	        url: 'getDataFromDB.php',
	        type:'POST',
	        data: {target: 'mapInfo', amac: amacOnMap},
	        dataType:'JSON',
	        success: function(msg){
	        	seatingSeat = msg[0];
	        	idleSeat = allSeat - seatingSeat;
	        	//Change number of idle seats
	        	$('.map-info-cell:nth-child(1)').find('div:nth-child(2)').html(idleSeat);
	        	//Change number of serving seats
	        	$('.map-info-cell:nth-child(2)').find('div:nth-child(2)').html(allSeat);
	        	//Change area name
	        	$('.area-info-cell:nth-child(1)').find('h1').html(areaName);
	        	//Change pi MAC
	        	$('.area-info-cell:nth-child(2)').find('h1').html(piMac);
	        	//Change last update time
	        	$('.area-info-cell:nth-child(3)').find('h1').html(currentTime);

	        	console.log('Map info updated!');
	        },
	        error:function(xhr, ajaxOptions, thrownError){ 
	          showMessage('error', 'Failed to update map detail information!');
	          console.log(xhr.responseText);
	          console.log(thrownError); 
	        }
	    });
	}
	else{
		idleSeat = allSeat;
	    $('.map-info-cell:nth-child(1)').find('div:nth-child(2)').html(idleSeat);
	    //Change number of serving seats
	    $('.map-info-cell:nth-child(2)').find('div:nth-child(2)').html(allSeat);
	    //Change area name
	    $('.area-info-cell:nth-child(1)').find('h1').html(areaName);
	    //Change pi MAC
	    $('.area-info-cell:nth-child(2)').find('h1').html(piMac);
	    //Change last update time
	    $('.area-info-cell:nth-child(3)').find('h1').html(currentTime);
	}


}


/*
*  Map-related functions below 
*/

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
    		$('<div style="height:' + (h + 5)+ 'px;" class="section-information">' +
    			'<div class="remove-area">×</div>' + 
    			'<div class="area-info">' +
    			'<div class="area-info-cell"><div class="area-info-name">Area Name</div><h1></h1></div>' +
			    '<div class="area-info-cell"><div class="area-info-name">Pi MAC Address</div><h1></h1></div>' +
			    '<div class="area-info-cell"><div class="area-info-name">Last Update</div><h1></h1></div>' +
			    '</div>' +
			    '<div class="map-info">' +
			    '<div class="map-info-cell"><div>Idle</div><div class="map-info-detail">0</div></div>' +
                '<div class="map-info-cell"><div>All</div><div class="map-info-detail">0</div></div>' +
                '<div class="map-info-cell"><div>Hot</div><div class="map-info-detail">1</div></div>' +
                '</div>')
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
		// svgFormater();
}

function removeMap(){
	//Check if the div exists.
	if($('.div-map').length){
		$('.div-map').remove();
	}
}



