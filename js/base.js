function show_seats_information() {
		var no_seat = $(this).html(); 
		var occu = true;
		var seating_time = new Date();
		var tool = "<div id=\"popup\"><ul><li>No.<p>"+ no_seat +
		"</li><li>Occupied<p>"+ occu +"</li><li>Seating Time<p>"+ seating_time +
		"</li></ul><button id=\"btn-close\">Close</button> <button id=\"btn-remove-seat\">Remove</button></div>";
		$("body").append(tool);
		$("#popup").show('slow');
	}

function show_table_information () {
		var no_seat = $(this).html();

		var tool = "<div id=\"popup\"><ul><li>No.<p>"+ no_seat +"</li></ul><button id=\"btn-close\">Close</button></div>";
		$("body").append(tool);
		$("#popup").show();
}


$(document).ready(function(){


	//show information
	$(".seats").bind('click', show_seats_information);
	$(".table-spilt-top").bind('click', show_table_information);

	$("body").on('click', '#btn-close', function(event) {
		event.preventDefault();
		$(this).parents('div').remove();
	});

	$('#btn-addtable').click(function(event) {
		var form_popup = "<div id=\"popup\"><form id=\"form-buildtable\">" +
		"Table No.<input id=\"input-tableno\" type=\"text\"><br>" +
		"Seat <select class=\"seats-needed\">" +
		"<option value=\"1\">1</option>" +
		"<option value=\"2\">2</option>" +
		"<option value=\"3\">3</option>" +
		"<option value=\"4\">4</option>" +
		"</select><br>" +
  		"<input id=\"btn-create\" type=\"button\" value=\"Create\" />" +
  		"  <input id=\"btn-close\"type=\"button\" value=\"Cancel\" /><br>" +
		"</form></div>";
		$("body").append(form_popup);
		$("#popup").animate({    
			opacity: 1,
    		top: "200"}, 600);
	});

	$('body').on('click', '#btn-create', function(event) {
		event.preventDefault();

		var tableno = $('#input-tableno').val();

		if(tableno == '' || isNaN(tableno)){
			$('#form-buildtable').append('Please input a number!').css('color', 'red');
			return;
		}

		var div_seats_string = "";
		for (var i = 0; i < $('.seats-needed').val(); i++) {
			div_seats_string += "<li><div class=\"seats\">"+ (i+1)  +"</div></li>";
		};

		var table = "<div class=\"table\">"+
                    "<div class=\"table-spilt-top\">"+ tableno +"</div>"+
                    "<div class=\"table-spilt-bot\">"+
                        "<ul>" +  div_seats_string + "</ul></div></div>";
		$('.section-content').append(table);
		
		$('.table').last().addClass('table');// add css

		$('.seats').unbind();
		$('.seats').bind('click', show_seats_information);

		$(".table-spilt-top").unbind();
		$(".table-spilt-top").bind('click', show_table_information);
		$(this).parents('div').remove();
	});


});