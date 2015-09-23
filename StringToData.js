function getToday(){
	var tmpDate = new Date();
	year = String(tmpDate.getFullYear())[2]+String(tmpDate.getFullYear())[3];
	month = (tmpDate.getMonth()+1).toString();
	if (month.length<2){
		month = "0" + month;
	}

	day = tmpDate.getDate().toString();
		if(day.length<2){
		day = "0"+day;
	}
	today = year + "-" + month+ "-" + day + ".txt";
	return today;
}

function getpassedmonth(){
	var tmpDate = new Date();
	var montharr = new Array();
	month = tmpDate.getMonth()+1;
	for(var i = 1 ;i<=month;i++){
		if (i.toString().length<2){
			tmpMonth = "0"+i.toString();
		}else{
			tmpMonth = i.toString();
		}
		montharr.push("avg-month-"+tmpMonth+".txt");
	}
	return montharr;
}

function getpassedweek(){
	function whichweek(){
		var tmpDate = new Date();
		today = tmpDate.getDate();
		daysago = today-1;
		tmpDate.setDate(tmpDate.getDate() -daysago);
		firstday=tmpDate.getDay();
		if(today<=6-firstday+1){
			return 1;
		}
		return Math.ceil(((today-(6-firstday+1))/7+1));
	}
	var weekarr = new Array();
	var tmpDate = new Date();
	month = (tmpDate.getMonth()+1).toString();
	if(month.length<2){
		month = "0"+month;
	}
	for(var i = 0 ; i < whichweek() ; i++){
		file = "avg-week-"+month+"-"+(i+1).toString()+".txt";
		weekarr.push(file);
	}
	return weekarr;
}

function lastWeekArray(){
	var lastWeekArray = [];
	for(var i = 6; i >= 0;i--)
	{
		var tmpDate = new Date();
		tmpDate.setDate(tmpDate.getDate() - i);
		var month = (tmpDate.getMonth() + 1).toString();
		var day = tmpDate.getDate().toString();
		if(month.length < 2)
		{
			month = "0" + month;
		}
		if(day.length < 2)
		{
			day = "0" + day;
		}
		year = String(tmpDate.getFullYear())[2]+String(tmpDate.getFullYear())[3];
		lastWeekArray.push(year + "-" + month + "-" + day + ".txt");
	}
	return lastWeekArray; 	
}

function last4WeekSameDay(){
	var last4WeekSameDay = [];
	for(var i = 3; i >= 0;i--)
	{
		var tmpDate = new Date();
		tmpDate.setDate(tmpDate.getDate() - i * 7);
		var month = (tmpDate.getMonth() + 1).toString();
		var day = tmpDate.getDate().toString();
		if(month.length < 2)
		{
			month = "0" + month;
		}
		if(day.length < 2)
		{
			day = "0" + day;
		}
		year = String(tmpDate.getFullYear())[2]+String(tmpDate.getFullYear())[3];
		last4WeekSameDay.push(year + "-" + month + "-" + day + ".txt");
	}
	return last4WeekSameDay;
}

function parse_turn_rate(str){
	return parseInt(str);
}

function parse_eating_Time_label(str){

	getlabel = str.split("\"");
	label = new Array();
	for(var i = 1 ; i <getlabel.length;i=i+2){
		label.push(getlabel[i]);
	}
	return label;
}

function parse_eating_Time_value(str){
	length = str.split(":").length-1;
	value = new Array();
	for(var i = 1 ; i <=length ; i++){
		split = str.split(":");
		if(i == length){
			val = split[i].split("}")[0];
		}else{
		val = split[i].split(",")[0];
		}
		value.push(parseInt(val));
	}
	return value;
}

function parse_avg_eating_time(str){
	avg_eating_time = str.split("m");
	return parseFloat(avg_eating_time[0]);
}

function parse_come(str){
	value = new Array();

	cut_half = str.split("]");
	only_come_part = cut_half[0].split(",");

	for(var i = 0 ; i <only_come_part.length ; i++){
		if(i==0){
			v=only_come_part[i].split("[");
			val=parseInt(v[2]);
		}else{
			val = parseInt(only_come_part[i]);
		}
		value.push(val);
	}
	return value;
}

function parse_leave(str){
	value = new Array();
	split = str.split("[");
	v = split[3].split(",");
	for(var i = 0 ; i < v.length;i++){
		if(i==v.length-1){
			val = v[i].split("]")[0];
		}else{
			val = v[i];
		}
		value.push(parseInt(val));
	}
	return value;
}

function parse_t_id(str){
	value = new Array();
	key = new Array();
	split = str.split(",");
	finalvalue = new Array();
	for(var i = 0 ; i<split.length; i++){
		getkey = split[i].split("\"")[1];
		key.push(getkey);
	}
	split = str.split(":");
	for(var i =1; i<split.length; i++){
		if(i==split.length-1){
			getvalue = split[i].split(",")[0].split("}")[0];
		}else{
			getvalue = split[i].split(",")[0];
		}
		value.push(parseInt(getvalue));
	}
	for(var i =0 ; i<key.length; i++){
		finalvalue[key[i]] = value[i];
	}
	return finalvalue;
	//回傳的array key值是字元，如"1"，非整數0.1.2.3.4....
}

function parse_most_hot(str){
	return str;
}




// function parse_temp_array(){
// 目前看起來不需要
// }

// function pares_update_time(){
// 目前看起來不需要
// }
