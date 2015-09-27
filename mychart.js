document.write ("<script language='javascript' src='Chart.js'></script>");
document.write ("<script language='javascript' src='js/d3.v3.min.js'></script>");
var mycolor = ["#F7464A","#46BFBD","#FDB45C","#949FB1","#4D5360",
			   "#CC66FF","#00CCFF","#CC9900","#6600CC","#E6B8B8",
			   "#CC3300","#FF6699","#CCFF66","#CCCCFF","#00CC99",
			   "#FF66FF","#FF3300","#9966FF","#00CC99","#00FFFF",
			   "#339933","#666699","#660033","#993333"];
var myrgba = ["rgba(247, 70, 74","rgba(70, 191, 189","rgba(253, 180, 92",
			  "rgba(148, 159, 177","rgba(77, 83, 96","rgba(204, 102, 255",
			  "rgba(0, 204, 255","rgba(204, 153, 0","rgba(102, 0, 204",
			  "rgba(230, 184, 184","rgba(204, 51, 0","rgba(255, 102, 153",
			  "rgba(204, 255, 102","rgba(204, 204, 255","rgba(0, 204, 153",
			  "rgba(255, 102, 255","rgba(255, 51, 0","rgba(153, 102, 255",
			  "rgba(0, 204, 153","rgba(0, 255, 255","rgba(51, 153, 51",
			  "rgba(102, 102, 153","rgba(102, 0, 51","rgba(153, 51, 51"];

function linechart(elementID,label,data_array){
	var data_arr = new Array();
	for(var i =0; i<data_array.length;i++){
		if(i == 1){
			if(data_array[1][0]==null){
				break;
			}
		}
		var data_of_obj = new Array();
		if(data_array[1][0]!=null){
		for (var j =0; j<data_array[i].length; j++){
			data_of_obj.push(data_array[i][j]);
		}}else{
			for (var j = 0 ;j<data_array.length; j++){
				data_of_obj.push(data_array[j]);
			}
		}
		var obj = {
				label: "My First dataset",
				fillColor : myrgba[i]+",0.2)",
				strokeColor : myrgba[i]+",1)",
				pointColor : myrgba[i]+",1)",
				pointStrokeColor : "#fff",
				pointHighlightFill : "#fff",
				pointHighlightStroke : myrgba[i]+",1)",
				data :data_of_obj
			  };
		data_arr.push(obj);	  
	}
	var linechartdata ={
		labels:label,
		datasets:data_arr
	};
	var ctx = document.getElementById(elementID).getContext("2d");
		window.myLine = new Chart(ctx).Line(linechartdata, {
			responsive: false
		});
}

function polarchart(elementID,label,data_array){
	var data_arr = new Array();
	var sum=0;
	for(var i =0; i <label.length; i++){
		var obj = {
					value: data_array[i],
					color:mycolor[i],
					highlight: "#FF5A5E",
					label: label[i]+" ",
				};
				sum = sum +data_array[i];
				data_arr.push(obj);
	}
	var polarData = data_arr;
			var ctx = document.getElementById(elementID).getContext("2d");
				window.myPolarArea = new Chart(ctx).PolarArea(polarData, {
					responsive:false,
					tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %>"+" / "+String(sum)
				});
}

function littlechart(brother_ele,how_many_times){
	var who_arr = new Array();
	father=document.getElementById(brother_ele).parentNode;
	child = father.getElementsByTagName("div")[0];
	if(child.childNodes.length!=0){
		for(var i =0;i<how_many_times.length;i++){
			child.removeChild(child.childNodes[0]);	
		}
	}
	for(var i=0;i<how_many_times.length;i++){
		split=how_many_times[i].split(".txt")[0];
		nicelook = split.split("avg-");
		console.log(nicelook[1]);
		if(typeof nicelook[1] !== 'undefined'){
			who_arr.push(nicelook[1]);
		}else{
			who_arr.push(split);
		}

	}
	for(var i =0;i<how_many_times.length;i++){
		addele(who_arr,i);
	}
	function addele(who_is_who,index){
	  out_div = document.createElement("div");
	  child.style.padding="12px";
	  child.style.float="right";
	  child.appendChild(out_div);
	  div = document.createElement("div");
	  div.style.width="15px";
	  div.style.display="inline-block";
	  div.style.backgroundColor=mycolor[index];
	  div.style.height="15px";
	  out_div.appendChild(div);
	  div = document.createElement("div");
	  div.innerHTML=who_is_who[index];
	  div.style.display="inline-block";
	  out_div.appendChild(div);
	}
}

function linecomparechart(elementID,label,data_array){
	var here = document.getElementById(elementID);
	if(here.childNodes.length!=0){
		here.removeChild(here.childNodes[0]);
	}
	var svg_width = 500;
	var svg_height = 400;
	var start_x = 0;
	var date_label = label;
	var dataset = new Array();
	for(var i =0;i<data_array.length;i++){
		dataset[i]=data_array[i];
	}
	var label = new Array();
	for(var i =0 ; i<data_array.length;i++){
		label[i] = data_array[i];
	}
	var svg = d3.select(here)
				.append("svg")
				.attr("width",svg_width)
				.attr("height",svg_height);
	var mins = ["30mins","60mins","90mins","120mins",">120mins"];
	svg.selectAll("rect"+i)
		.data(dataset[0])
		.enter()
		.append("rect")
		.attr("x",function(d,i){
			start_x = start_x + (20/100).toFixed(2)*400;
			return start_x-(20/100).toFixed(2)*400+60;  			
		})
		.attr("y",40)
		.attr("width",function(d,i){
			return (20/100).toFixed(2)*400;
		})
		.attr("height",20)
		.attr("fill",function(d,i){
			return mycolor[i];
		});
    	start_x = 0;
    svg.selectAll("text"+i)
		.data(label[0])
		.enter()
		.append("text")
		.text(function(d,i){
			return mins[i];
		})
		.attr("text-anchor","middle")
		.attr("x",function(d,i){
			start_x = start_x + (20/100).toFixed(2)*400;
			return start_x-(20/100).toFixed(2)*400+(20/100).toFixed(2)*400/2+60;
		})
		.attr("y",55)
		.attr("font-size","16px")
		.attr("fill","white");
    	start_x = 0;
	svg.selectAll("text"+i)
		.data(date_label)
		.enter()
		.append("text")
		.text(function(d){
			return d;
		})
		.attr("x",0)
		.attr("y",function(d,i){
			return 90+50*i;
		})
		.attr("font-size","12px")
		.attr("fill","black");

	for(var i =0 ; i <dataset.length ; i++){
		var sum = 0;
		for(var j =0 ; j<dataset[i].length;j++){
			sum = sum + dataset[i][j];
		}
		svg.selectAll("rect"+i)
		.data(dataset[i])
		.enter()
		.append("rect")
		.attr("x",function(d,i){
			start_x = start_x + (d/sum).toFixed(2)*400;
			return start_x-(d/sum).toFixed(2)*400+60;  			
		})
		.attr("y",70+50*i)
		.attr("width",function(d,i){
			return (d/sum).toFixed(2)*400;
		})
		.attr("height",30)
		.attr("fill",function(d,i){
			return mycolor[i];
		});
    	start_x = 0;
		svg.selectAll("text"+i)
		.data(label[i])
		.enter()
		.append("text")
		.text(function(d){
			num = (d/sum*100);
			if (num < 3) {
				return "";
			} else if (num < 5) {
				return num.toFixed(0) + "";
			} else {
				return num.toFixed(2) + "%";
			}
		})
		.attr("text-anchor","middle")
		.attr("x",function(d,i){
			start_x = start_x + (d/sum).toFixed(2)*400;
			return start_x-(d/sum).toFixed(2)*400+(d/sum).toFixed(2)*400/2+60;
		})
		.attr("y",90+50*i)
		.attr("font-size","12px")
		.attr("fill","black");
    	start_x = 0;
	}
}
