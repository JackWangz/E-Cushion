document.write ("<script language='javascript' src='mychart.js'></script>");
document.write ("<script language='javascript' src='StringToData.js'></script>");
document.write ("<script language='javascript' src='Chart.js'></script>");
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
function createRequest() {
  try {
    request = new XMLHttpRequest();
  } catch (tryMS) {
    try {
      request = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (otherMS) {
      try {
        request = new ActiveXObject("Microsoft.XMLHTTP");
      } catch (failed) {
        request = null;
      }
    }
  } 
  return request;
}

function eating_time_today(){
  today = getToday();
  console.log(today);
  console.log("-------------------");
  var request = createRequest();
    if (request==null){
      alert("Unable to create request");
      return;
    }
  request.onreadystatechange=showdata;
  request.open("GET","readfile.php?f="+today,true);
  request.send(null);
  function showdata(){
    if (request.readyState==4){
      if (request.status==200){
        var data = request.responseText;
        var obj = JSON.parse(data);
        polarchart("today",parse_eating_Time_label(obj["eating_Time"]),parse_eating_Time_value(obj["eating_Time"]));
      }
    }
  }
}
function eating_time_seven_days(){
  var sevendays = lastWeekArray();
  console.log(sevendays);
  console.log("-------------------");
  var filearry = sevendays[0];
  for(var i =1;i<sevendays.length;i++){
     filearry = filearry + ","+sevendays[i];
  }
  var request = createRequest();
    if (request==null){
      alert("Unable to create request");
      return;
    }
  request.onreadystatechange=showdata;
  request.open("GET","readfile.php?f="+filearry,true);
  request.send(null);
  function showdata(){
    var objarray =new Array();
    if (request.readyState==4){
      if (request.status==200){
        var data = request.responseText;
        var split = data.split("~~~~~~~~~~");
        for(var i =0;i<split.length-1;i++){
          objarray.push(JSON.parse(split[i]));
        }
        label = new Array();
        for(var i =0 ; i<sevendays.length;i++){
          label.push(sevendays[i].split(".")[0]);
        }
        var dataset = new Array();
        for(var i =0; i<objarray.length;i++){
          dataset[i]=parse_eating_Time_value(objarray[i]["eating_Time"]);
        }
        linecomparechart("seven_days",label,dataset);
      }
    }
  }
}




function eating_time_weeks_ago_same_day(){
  fourdays = last4WeekSameDay();
  console.log(fourdays);
  console.log("-------------------");
  var filearry = fourdays[0];
  for(var i =1;i<fourdays.length;i++){
     filearry = filearry + ","+fourdays[i];
  }
  var request = createRequest();
    if (request==null){
      alert("Unable to create request");
      return;
    }
  request.onreadystatechange=showdata;
  request.open("GET","readfile.php?f="+filearry,true);
  request.send(null);
  function showdata(){
    var objarray =new Array();
    if (request.readyState==4){
      if (request.status==200){
        var data = request.responseText;
        var split = data.split("~~~~~~~~~~");
        for(var i =0;i<split.length-1;i++){
          objarray.push(JSON.parse(split[i]));
        }
        label = new Array();
        for(var i =0 ; i<fourdays.length;i++){
          label.push(fourdays[i].split(".")[0]);
        }
        var dataset = new Array();
        for(var i =0; i<objarray.length;i++){
          dataset[i]=parse_eating_Time_value(objarray[i]["eating_Time"]);
        }
        linecomparechart("weeks_ago_same_day",label,dataset);
      }
    }
  }
}
function eating_time_compare_weeks(){
  var weeks =getpassedweek();
  console.log(weeks);
  console.log("-------------------");
  var filearry = weeks[0];
  for(var i =1;i<weeks.length;i++){
     filearry = filearry + ","+weeks[i];
  }
  var request = createRequest();
    if (request==null){
      alert("Unable to create request");
      return;
    }
  request.onreadystatechange=showdata;
  request.open("GET","readfile.php?f="+filearry,true);
  request.send(null);
  function showdata(){
    var objarray =new Array();
    if (request.readyState==4){
      if (request.status==200){
        var data = request.responseText;
        var split = data.split("~~~~~~~~~~");
        for(var i =0;i<split.length-1;i++){
          objarray.push(JSON.parse(split[i]));
        }
        label = new Array();
        for(var i =0 ; i<weeks.length;i++){
          label.push(weeks[i].split(".")[0].split("avg-")[1]);
        }
        var dataset = new Array();
        for(var i =0; i<objarray.length;i++){
          dataset[i]=parse_eating_Time_value(objarray[i]["eating_Time"]);
        }
        linecomparechart("compare_weeks",label,dataset);
      }
    }
  }
}
function eating_time_compare_months(){
  passedmonth = getpassedmonth();
  console.log(passedmonth);
  console.log("-------------------");
  var filearry = passedmonth[0];
  for(var i =1;i<passedmonth.length;i++){
     filearry = filearry + ","+passedmonth[i];
  }
  var request = createRequest();
    if (request==null){
      alert("Unable to create request");
      return;
    }
  request.onreadystatechange=showdata;
  request.open("GET","readfile.php?f="+filearry,true);
  request.send(null);
  function showdata(){
    var objarray =new Array();
    if (request.readyState==4){
      if (request.status==200){
        var data = request.responseText;
        var split = data.split("~~~~~~~~~~");
        for(var i =0;i<split.length-1;i++){
          objarray.push(JSON.parse(split[i]));
        }
        label = new Array();
        for(var i =0 ; i<passedmonth.length;i++){
          label.push(passedmonth[i].split(".")[0].split("avg-")[1]);
        }
        var dataset = new Array();
        for(var i =0; i<objarray.length;i++){
          dataset[i]=parse_eating_Time_value(objarray[i]["eating_Time"]);
        }
        linecomparechart("compare_months",label,dataset);
      }
    }
  }
}


function avg_eating_time_today(){
  today = getToday();
  console.log(today);
  var request = createRequest();
    if (request==null){
      alert("Unable to create request");
      return;
    }
  request.onreadystatechange=showdata;
  request.open("GET","readfile.php?f="+today,true);
  request.send(null);
  function showdata(){
    if (request.readyState==4){
      if (request.status==200){
        var data = request.responseText;
        var obj = JSON.parse(data);
        console.log(parse_avg_eating_time(obj["avg_eating_time"]));
        console.log("-------------------");
      }
    }
  }
}

function avg_eating_time_seven_days(){
  var sevendays = lastWeekArray();
  console.log(sevendays);
  console.log("-------------------");
  var filearry = sevendays[0];
  for(var i =1;i<sevendays.length;i++){
     filearry = filearry + ","+sevendays[i];
  }
  var request = createRequest();
    if (request==null){
      alert("Unable to create request");
      return;
    }
  request.onreadystatechange=showdata;
  request.open("GET","readfile.php?f="+filearry,true);
  request.send(null);
  function showdata(){
    var objarray =new Array();
    if (request.readyState==4){
      if (request.status==200){
        var data = request.responseText;
        var split = data.split("~~~~~~~~~~");
        for(var i =0;i<split.length-1;i++){
          objarray.push(JSON.parse(split[i]));
        }
        label = new Array();
        for(var i =0 ; i<sevendays.length;i++){
          label.push(sevendays[i].split(".")[0]);
        }
        var dataset = new Array();
        for(var i =0; i<objarray.length;i++){
          dataset[i]=parse_avg_eating_time(objarray[i]["avg_eating_time"]);
        }
        linechart("seven_days",label,dataset);
      }
    }
  }
}

function avg_eating_time_weeks_ago_same_day(){
  var fourdays =last4WeekSameDay();
  console.log(fourdays);
  console.log("-------------------");
  var filearry = fourdays[0];
  for(var i =1;i<fourdays.length;i++){
     filearry = filearry + ","+fourdays[i];
  }
  var request = createRequest();
    if (request==null){
      alert("Unable to create request");
      return;
    }
  request.onreadystatechange=showdata;
  request.open("GET","readfile.php?f="+filearry,true);
  request.send(null);
  function showdata(){
    var objarray =new Array();
    if (request.readyState==4){
      if (request.status==200){
        var data = request.responseText;
        var split = data.split("~~~~~~~~~~");
        for(var i =0;i<split.length-1;i++){
          objarray.push(JSON.parse(split[i]));
        }
        label = new Array();
        for(var i =0 ; i<fourdays.length;i++){
          label.push(fourdays[i].split(".")[0]);
        }
        var dataset = new Array();
        for(var i =0; i<objarray.length;i++){
          dataset[i]=parse_avg_eating_time(objarray[i]["avg_eating_time"]);
        }
        linechart("weeks_ago_same_day",label,dataset);
      }
    }
  }
}
function avg_eating_time_compare_weeks(){
  var weeks =getpassedweek();
  console.log(weeks);
  console.log("-------------------");
  var filearry = weeks[0];
  for(var i =1;i<weeks.length;i++){
     filearry = filearry + ","+weeks[i];
  }
  var request = createRequest();
    if (request==null){
      alert("Unable to create request");
      return;
    }
  request.onreadystatechange=showdata;
  request.open("GET","readfile.php?f="+filearry,true);
  request.send(null);
  function showdata(){
    var objarray =new Array();
    if (request.readyState==4){
      if (request.status==200){
        var data = request.responseText;
        var split = data.split("~~~~~~~~~~");
        for(var i =0;i<split.length-1;i++){
          objarray.push(JSON.parse(split[i]));
        }
        label = new Array();
        for(var i =0 ; i<weeks.length;i++){
          labelname=weeks[i].split(".")[0].split("-");
          label.push(labelname[2]+"-"+labelname[3]);
        }
        var dataset = new Array();
        for(var i =0; i<objarray.length;i++){
          dataset[i]=parse_avg_eating_time(objarray[i]["avg_eating_time"]);
        }
        linechart("compare_weeks",label,dataset);
      }
    }
  }
}

function avg_eating_time_compare_months(){
  passedmonth = getpassedmonth();
  console.log(passedmonth);
  console.log("-------------------");
  var filearry = passedmonth[0];
  for(var i =1;i<passedmonth.length;i++){
     filearry = filearry + ","+passedmonth[i];
  }
  var request = createRequest();
    if (request==null){
      alert("Unable to create request");
      return;
    }
  request.onreadystatechange=showdata;
  request.open("GET","readfile.php?f="+filearry,true);
  request.send(null);
  function showdata(){
    var objarray =new Array();
    if (request.readyState==4){
      if (request.status==200){
        var data = request.responseText;
        var split = data.split("~~~~~~~~~~");
        for(var i =0;i<split.length-1;i++){
          objarray.push(JSON.parse(split[i]));
        }
        label = new Array();
        for(var i =0 ; i<passedmonth.length;i++){
          month = passedmonth[i].split(".")[0].split("-")[2];
          label.push(month);
        }
        var dataset = new Array();
        for(var i =0; i<objarray.length;i++){
          dataset[i]=parse_avg_eating_time(objarray[i]["avg_eating_time"]);
        }
        linechart("compare_months",label,dataset);
      }
    }
  }
}

function come_store_today(){
  today = getToday();
  console.log(today);
  console.log("-------------------");
  var request = createRequest();
    if (request==null){
      alert("Unable to create request");
      return;
    }
  request.onreadystatechange=showdata;
  request.open("GET","readfile.php?f="+today,true);
  request.send(null);
  function showdata(){
    if (request.readyState==4){
      if (request.status==200){
        var data = request.responseText;
        var obj=JSON.parse(data);
        label = ["0am","1am","2am","3am","4am","5am","6am","7am","8am","9am","10am","11am",
                "12pm","1pm","2pm","3pm","4pm","5pm","6pm","7pm","8pm","9pm","10pm","11pm"];
        dataset = parse_come(obj["come_and_leave"]);
        linechart("today",label,dataset);
      }
    }
  }
}
function come_store_seven_days(){
  var sevendays = lastWeekArray();
  console.log(sevendays);
  var filearry = sevendays[0];
  for(var i =1;i<sevendays.length;i++){
     filearry = filearry + ","+sevendays[i];
  }
  var request = createRequest();
    if (request==null){
      alert("Unable to create request");
      return;
    }
  request.onreadystatechange=showdata;
  request.open("GET","readfile.php?f="+filearry,true);
  request.send(null);
  function showdata(){
    var objarray =new Array();
    if (request.readyState==4){
      if (request.status==200){
        var data = request.responseText;
        var split = data.split("~~~~~~~~~~");
        for(var i =0;i<split.length-1;i++){
          objarray.push(JSON.parse(split[i]));
        }
        label =["0am","1am","2am","3am","4am","5am","6am","7am","8am","9am","10am","11am",
                "12pm","1pm","2pm","3pm","4pm","5pm","6pm","7pm","8pm","9pm","10pm","11pm"];
        var dataset = new Array();
        for(var i =0; i<objarray.length;i++){
          dataset[i]=parse_come(objarray[i]["come_and_leave"]);
        }
        linechart("seven_days",label,dataset);
        littlechart("seven_days",sevendays);
        console.log("-------------------");
      }
    }
  }
}
function come_store_weeks_ago_same_day(){
  var fourdays = last4WeekSameDay();
  console.log(fourdays);
  var filearry = fourdays[0];
  for(var i =1;i<fourdays.length;i++){
     filearry = filearry + ","+fourdays[i];
  }
  var request = createRequest();
    if (request==null){
      alert("Unable to create request");
      return;
    }
  request.onreadystatechange=showdata;
  request.open("GET","readfile.php?f="+filearry,true);
  request.send(null);
  function showdata(){
    var objarray =new Array();
    if (request.readyState==4){
      if (request.status==200){
        var data = request.responseText;
        var split = data.split("~~~~~~~~~~");
        for(var i =0;i<split.length-1;i++){
          objarray.push(JSON.parse(split[i]));
        }
        label =["0am","1am","2am","3am","4am","5am","6am","7am","8am","9am","10am","11am",
                "12pm","1pm","2pm","3pm","4pm","5pm","6pm","7pm","8pm","9pm","10pm","11pm"];
        var dataset = new Array();
        for(var i =0; i<objarray.length;i++){
          dataset[i]=parse_come(objarray[i]["come_and_leave"]);
        }
        linechart("weeks_ago_same_day",label,dataset);
        littlechart("weeks_ago_same_day",fourdays);
        console.log("-------------------");
      }
    }
  }
}


function come_store_compare_weeks(){
  var weeks = getpassedweek();
  console.log(weeks);
  var filearry = weeks[0];
  for(var i =1;i<weeks.length;i++){
     filearry = filearry + ","+weeks[i];
  }
  var request = createRequest();
    if (request==null){
      alert("Unable to create request");
      return;
    }
  request.onreadystatechange=showdata;
  request.open("GET","readfile.php?f="+filearry,true);
  request.send(null);
  function showdata(){
    var objarray =new Array();
    if (request.readyState==4){
      if (request.status==200){
        var data = request.responseText;
        var split = data.split("~~~~~~~~~~");
        for(var i =0;i<split.length-1;i++){
          objarray.push(JSON.parse(split[i]));
        }
        label =["0am","1am","2am","3am","4am","5am","6am","7am","8am","9am","10am","11am",
                "12pm","1pm","2pm","3pm","4pm","5pm","6pm","7pm","8pm","9pm","10pm","11pm"];
        var dataset = new Array();
        for(var i =0; i<objarray.length;i++){
          dataset[i]=parse_come(objarray[i]["come_and_leave"]);
        }
        linechart("compare_weeks",label,dataset);
        littlechart("compare_weeks",weeks);
      }
    }
  }
  console.log("-------------------");
}


function come_store_compare_months(){
  var passedmonth = getpassedmonth();
  console.log(passedmonth);
  var filearry = passedmonth[0];
  for(var i =1;i<passedmonth.length;i++){
     filearry = filearry + ","+passedmonth[i];
  }
  var request = createRequest();
    if (request==null){
      alert("Unable to create request");
      return;
    }
  request.onreadystatechange=showdata;
  request.open("GET","readfile.php?f="+filearry,true);
  request.send(null);
  function showdata(){
    var objarray =new Array();
    if (request.readyState==4){
      if (request.status==200){
        var data = request.responseText;
        var split = data.split("~~~~~~~~~~");
        for(var i =0;i<split.length-1;i++){
          objarray.push(JSON.parse(split[i]));
        }
        label =["0am","1am","2am","3am","4am","5am","6am","7am","8am","9am","10am","11am",
                "12pm","1pm","2pm","3pm","4pm","5pm","6pm","7pm","8pm","9pm","10pm","11pm"];
        var dataset = new Array();
        for(var i =0; i<objarray.length;i++){
          dataset[i]=parse_come(objarray[i]["come_and_leave"]);
        }
        linechart("compare_months",label,dataset);
        littlechart("compare_months",passedmonth);
      }
    }
  }
  console.log("-------------------");
}

function leave_store_today(){
  today = getToday();
  console.log(today);
  console.log("-------------------");
  var request = createRequest();
    if (request==null){
      alert("Unable to create request");
      return;
    }
  request.onreadystatechange=showdata;
  request.open("GET","readfile.php?f="+today,true);
  request.send(null);
  function showdata(){
    if (request.readyState==4){
      if (request.status==200){
        var data = request.responseText;
        var obj=JSON.parse(data);
        label = ["0am","1am","2am","3am","4am","5am","6am","7am","8am","9am","10am","11am",
                "12pm","1pm","2pm","3pm","4pm","5pm","6pm","7pm","8pm","9pm","10pm","11pm"];
        dataset = parse_leave(obj["come_and_leave"]);
        linechart("today",label,dataset);
      }
    }
  }
}

function leave_store_seven_days(){
  var sevendays =lastWeekArray();
  var filearry = sevendays[0];
  console.log(sevendays);
  for(var i =1;i<sevendays.length;i++){
     filearry = filearry + ","+sevendays[i];
  }
  var request = createRequest();
    if (request==null){
      alert("Unable to create request");
      return;
    }
  request.onreadystatechange=showdata;
  request.open("GET","readfile.php?f="+filearry,true);
  request.send(null);
  function showdata(){
    var objarray =new Array();
    if (request.readyState==4){
      if (request.status==200){
        var data = request.responseText;
        var split = data.split("~~~~~~~~~~");
        for(var i =0;i<split.length-1;i++){
          objarray.push(JSON.parse(split[i]));
        }
        label =["0am","1am","2am","3am","4am","5am","6am","7am","8am","9am","10am","11am",
                "12pm","1pm","2pm","3pm","4pm","5pm","6pm","7pm","8pm","9pm","10pm","11pm"];
        var dataset = new Array();
        for(var i =0; i<objarray.length;i++){
          dataset[i]=parse_leave(objarray[i]["come_and_leave"]);
        }
        linechart("seven_days",label,dataset);
        littlechart("seven_days",sevendays);
        console.log("-------------------");
      }
    }
  }
}
function leave_store_weeks_ago_same_day(){
  var fourdays =last4WeekSameDay();
  var filearry = fourdays[0];
  for(var i =1;i<fourdays.length;i++){
     filearry = filearry + ","+fourdays[i];
  }
  var request = createRequest();
    if (request==null){
      alert("Unable to create request");
      return;
    }
  request.onreadystatechange=showdata;
  request.open("GET","readfile.php?f="+filearry,true);
  request.send(null);
  function showdata(){
    var objarray =new Array();
    if (request.readyState==4){
      if (request.status==200){
        var data = request.responseText;
        var split = data.split("~~~~~~~~~~");
        for(var i =0;i<split.length-1;i++){
          objarray.push(JSON.parse(split[i]));
        }
        label =["0am","1am","2am","3am","4am","5am","6am","7am","8am","9am","10am","11am",
                "12pm","1pm","2pm","3pm","4pm","5pm","6pm","7pm","8pm","9pm","10pm","11pm"];
        var dataset = new Array();
        for(var i =0; i<objarray.length;i++){
          dataset[i]=parse_leave(objarray[i]["come_and_leave"]);
        }
        linechart("weeks_ago_same_day",label,dataset);
        littlechart("weeks_ago_same_day",fourdays);
        console.log(fourdays);
        console.log("-------------------");
      }
    }
  }
}
function leave_store_compare_weeks(){
  var weeks =getpassedweek();
  var filearry = weeks[0];
  for(var i =1;i<weeks.length;i++){
     filearry = filearry + ","+weeks[i];
  }
  var request = createRequest();
    if (request==null){
      alert("Unable to create request");
      return;
    }
  request.onreadystatechange=showdata;
  request.open("GET","readfile.php?f="+filearry,true);
  request.send(null);
  function showdata(){
    var objarray =new Array();
    if (request.readyState==4){
      if (request.status==200){
        var data = request.responseText;
        var split = data.split("~~~~~~~~~~");
        for(var i =0;i<split.length-1;i++){
          objarray.push(JSON.parse(split[i]));
        }
        label =["0am","1am","2am","3am","4am","5am","6am","7am","8am","9am","10am","11am",
                "12pm","1pm","2pm","3pm","4pm","5pm","6pm","7pm","8pm","9pm","10pm","11pm"];
        var dataset = new Array();
        for(var i =0; i<objarray.length;i++){
          dataset[i]=parse_leave(objarray[i]["come_and_leave"]);
        }
        linechart("compare_weeks",label,dataset);
        littlechart("compare_weeks",weeks);
        console.log(weeks);
        console.log("-------------------");
      }
    }
  }
}
function leave_store_compare_months(){
  var passedmonth =getpassedmonth();
  var filearry = passedmonth[0];
  for(var i =1;i<passedmonth.length;i++){
     filearry = filearry + ","+passedmonth[i];
  }
  var request = createRequest();
    if (request==null){
      alert("Unable to create request");
      return;
    }
  request.onreadystatechange=showdata;
  request.open("GET","readfile.php?f="+filearry,true);
  request.send(null);
  function showdata(){
    var objarray =new Array();
    if (request.readyState==4){
      if (request.status==200){
        var data = request.responseText;
        var split = data.split("~~~~~~~~~~");
        for(var i =0;i<split.length-1;i++){
          objarray.push(JSON.parse(split[i]));
        }
        label =["0am","1am","2am","3am","4am","5am","6am","7am","8am","9am","10am","11am",
                "12pm","1pm","2pm","3pm","4pm","5pm","6pm","7pm","8pm","9pm","10pm","11pm"];
        var dataset = new Array();
        for(var i =0; i<objarray.length;i++){
          dataset[i]=parse_leave(objarray[i]["come_and_leave"]);
        }
        linechart("compare_months",label,dataset);
        littlechart("compare_months",passedmonth);
        console.log(passedmonth);
        console.log("-------------------");
      }
    }
  }
}

function turn_rate_today(){
  today = getToday();
  console.log(today);
  var request = createRequest();
    if (request==null){
      alert("Unable to create request");
      return;
    }
  request.onreadystatechange=showdata;
  request.open("GET","readfile.php?f="+today,true);
  request.send(null);
  function showdata(){
    if (request.readyState==4){
      if (request.status==200){
        var data = request.responseText;
        var obj = JSON.parse(data);
        console.log(parse_turn_rate(obj[Object.keys(obj)[0]]));
        console.log("-------------------");
      }
    }
  }
}
function turn_rate_seven_days(){

  var sevendays = lastWeekArray();
  console.log(sevendays);
  console.log("-------------------");
  var filearry = sevendays[0];
  for(var i =1;i<sevendays.length;i++){
     filearry = filearry + ","+sevendays[i];
  }
  var request = createRequest();
    if (request==null){
      alert("Unable to create request");
      return;
    }
  request.onreadystatechange=showdata;
  request.open("GET","readfile.php?f="+filearry,true);
  request.send(null);
  function showdata(){
    var objarray =new Array();
    if (request.readyState==4){
      if (request.status==200){
        var data = request.responseText;
        var split = data.split("~~~~~~~~~~");
        for(var i =0;i<split.length-1;i++){
          objarray.push(JSON.parse(split[i]));
        }
        label = new Array();
        for(var i =0 ; i<sevendays.length;i++){
          label.push(sevendays[i].split(".")[0]);
        }
        var dataset = new Array();
        for(var i =0; i<objarray.length;i++){
          dataset[i]=parse_turn_rate(objarray[i][Object.keys(objarray[i])[0]]);
        }
        linechart("seven_days",label,dataset);
      }
    }
  }
}

function turn_rate_weeks_ago_same_day(){
  var fourdays =last4WeekSameDay();
  console.log(fourdays);
  console.log("-------------------");
  var filearry = fourdays[0];
  for(var i =1;i<fourdays.length;i++){
     filearry = filearry + ","+fourdays[i];
  }
  var request = createRequest();
    if (request==null){
      alert("Unable to create request");
      return;
    }
  request.onreadystatechange=showdata;
  request.open("GET","readfile.php?f="+filearry,true);
  request.send(null);
  function showdata(){
    var objarray =new Array();
    if (request.readyState==4){
      if (request.status==200){
        var data = request.responseText;
        var split = data.split("~~~~~~~~~~");
        for(var i =0;i<split.length-1;i++){
          objarray.push(JSON.parse(split[i]));
        }
        label = new Array();
        for(var i =0 ; i<fourdays.length;i++){
          label.push(fourdays[i].split(".")[0]);
        }
        var dataset = new Array();
        for(var i =0; i<objarray.length;i++){
          dataset[i]=parse_turn_rate(objarray[i][Object.keys(objarray[i])[0]]);
        }
        linechart("weeks_ago_same_day",label,dataset);
      }
    }
  }
}
function turn_rate_compare_weeks(){
  var weeks =getpassedweek();
  console.log(weeks);
  console.log("-------------------");
  var filearry = weeks[0];
  for(var i =1;i<weeks.length;i++){
     filearry = filearry + ","+weeks[i];
  }
  var request = createRequest();
    if (request==null){
      alert("Unable to create request");
      return;
    }
  request.onreadystatechange=showdata;
  request.open("GET","readfile.php?f="+filearry,true);
  request.send(null);
  function showdata(){
    var objarray =new Array();
    if (request.readyState==4){
      if (request.status==200){
        var data = request.responseText;
        var split = data.split("~~~~~~~~~~");
        for(var i =0;i<split.length-1;i++){
          objarray.push(JSON.parse(split[i]));
        }
        label = new Array();
        for(var i =0 ; i<weeks.length;i++){
          label.push(weeks[i].split(".")[0]);
        }
        var dataset = new Array();
        for(var i =0; i<objarray.length;i++){
          dataset[i]=parse_turn_rate(objarray[i][Object.keys(objarray[i])[0]]);
        }
        linechart("compare_weeks",label,dataset);
      }
    }
  }
}
function turn_rate_compare_months(){
  var passedmonth =getpassedmonth();
  console.log(passedmonth);
  console.log("-------------------");
  var filearry = passedmonth[0];
  for(var i =1;i<passedmonth.length;i++){
     filearry = filearry + ","+passedmonth[i];
  }
  var request = createRequest();
    if (request==null){
      alert("Unable to create request");
      return;
    }
  request.onreadystatechange=showdata;
  request.open("GET","readfile.php?f="+filearry,true);
  request.send(null);
  function showdata(){
    var objarray =new Array();
    if (request.readyState==4){
      if (request.status==200){
        var data = request.responseText;
        var split = data.split("~~~~~~~~~~");
        for(var i =0;i<split.length-1;i++){
          objarray.push(JSON.parse(split[i]));
        }
        label = new Array();
        for(var i =0 ; i<passedmonth.length;i++){
          label.push(passedmonth[i].split(".")[0]);
        }
        var dataset = new Array();
        for(var i =0; i<objarray.length;i++){
          dataset[i]=parse_turn_rate(objarray[i][Object.keys(objarray[i])[0]]);
        }
        linechart("compare_months",label,dataset);
      }
    }
  }
}

function people_today(){
  today = getToday();
  console.log(today);
  console.log("-------------------");
  var request = createRequest();
    if (request==null){
      alert("Unable to create request");
      return;
    }
  request.onreadystatechange=showdata;
  request.open("GET","readfile.php?f="+today,true);
  request.send(null);
  function showdata(){
    if (request.readyState==4){
      if (request.status==200){
        var data = request.responseText;
        var obj = JSON.parse(data);
        polarchart("today",parse_people_label(obj[Object.keys(obj)[0]]),parse_people_value(obj[Object.keys(obj)[0]]));
      }
    }
  }
}
function people_seven_days(){
  var sevendays = lastWeekArray();
  console.log(sevendays);
  console.log("-------------------");
  var filearry = sevendays[0];
  for(var i =1;i<sevendays.length;i++){
     filearry = filearry + ","+sevendays[i];
  }
  var request = createRequest();
    if (request==null){
      alert("Unable to create request");
      return;
    }
  request.onreadystatechange=showdata;
  request.open("GET","readfile.php?f="+filearry,true);
  request.send(null);
  function showdata(){
    var objarray =new Array();
    if (request.readyState==4){
      if (request.status==200){
        var data = request.responseText;
        var split = data.split("~~~~~~~~~~");
        for(var i =0;i<split.length-1;i++){
          objarray.push(JSON.parse(split[i]));
        }
        label = new Array();
        for(var i =0 ; i<sevendays.length;i++){
          label.push(sevendays[i].split(".")[0]);
        }
        var dataset = new Array();
        for(var i =0; i<objarray.length;i++){
          dataset[i]=parse_people_value(objarray[i][Object.keys(objarray[i])[0]]);
        }
        linecomparechart("seven_days",label,dataset);
      }
    }
  }
}

function people_weeks_ago_same_day(){
  var fourdays = last4WeekSameDay();
  console.log(fourdays);
  console.log("-------------------");
  var filearry = fourdays[0];
  for(var i =1;i<fourdays.length;i++){
     filearry = filearry + ","+fourdays[i];
  }
  var request = createRequest();
    if (request==null){
      alert("Unable to create request");
      return;
    }
  request.onreadystatechange=showdata;
  request.open("GET","readfile.php?f="+filearry,true);
  request.send(null);
  function showdata(){
    var objarray =new Array();
    if (request.readyState==4){
      if (request.status==200){
        var data = request.responseText;
        var split = data.split("~~~~~~~~~~");
        for(var i =0;i<split.length-1;i++){
          objarray.push(JSON.parse(split[i]));
        }
        label = new Array();
        for(var i =0 ; i<fourdays.length;i++){
          label.push(fourdays[i].split(".")[0]);
        }
        var dataset = new Array();
        for(var i =0; i<objarray.length;i++){
          dataset[i]=parse_people_value(objarray[i][Object.keys(objarray[i])[0]]);
        }
        linecomparechart("weeks_ago_same_day",label,dataset);
      }
    }
  }
}

function people_compare_weeks(){
  var weeks = getpassedweek();
  console.log(weeks);
  console.log("-------------------");
  var filearry = weeks[0];
  for(var i =1;i<weeks.length;i++){
     filearry = filearry + ","+weeks[i];
  }
  var request = createRequest();
    if (request==null){
      alert("Unable to create request");
      return;
    }
  request.onreadystatechange=showdata;
  request.open("GET","readfile.php?f="+filearry,true);
  request.send(null);
  function showdata(){
    var objarray =new Array();
    if (request.readyState==4){
      if (request.status==200){
        var data = request.responseText;
        console.log(data);
        var split = data.split("~~~~~~~~~~");
        for(var i =0;i<split.length-1;i++){
          objarray.push(JSON.parse(split[i]));
        }
        label = new Array();
        for(var i =0 ; i<weeks.length;i++){
          label.push(weeks[i].split(".")[0].split("avg-")[1]);
        }
        var dataset = new Array();
        for(var i =0; i<objarray.length;i++){
          dataset[i]=parse_people_value(objarray[i][Object.keys(objarray[i])[0]]);
        }
        linecomparechart("compare_weeks",label,dataset);
      }
    }
  }
}

function people_compare_months(){
  passedmonth = getpassedmonth();
  console.log(passedmonth);
  console.log("-------------------");
  var filearry = passedmonth[0];
  for(var i =1;i<passedmonth.length;i++){
     filearry = filearry + ","+passedmonth[i];
  }
  var request = createRequest();
    if (request==null){
      alert("Unable to create request");
      return;
    }
  request.onreadystatechange=showdata;
  request.open("GET","readfile.php?f="+filearry,true);
  request.send(null);
  function showdata(){
    var objarray =new Array();
    if (request.readyState==4){
      if (request.status==200){
        var data = request.responseText;
        var split = data.split("~~~~~~~~~~");
        for(var i =0;i<split.length-1;i++){
          objarray.push(JSON.parse(split[i]));
        }
        label = new Array();
        for(var i =0 ; i<passedmonth.length;i++){
          label.push(passedmonth[i].split(".")[0].split("avg-")[1]);
        }
        var dataset = new Array();
        for(var i =0; i<objarray.length;i++){
          dataset[i]=parse_people_value(objarray[i][Object.keys(objarray[i])[0]]);
        }
        linecomparechart("compare_months",label,dataset);
      }
    }
  }
}

function sit_time_today(){
  today = getToday();
  console.log(today);
  console.log("-------------------");
  var request = createRequest();
    if (request==null){
      alert("Unable to create request");
      return;
    }
  request.onreadystatechange=showdata;
  request.open("GET","readfile.php?f="+today,true);
  request.send(null);
  function showdata(){
    if (request.readyState==4){
      if (request.status==200){
        var data = request.responseText;
        var obj = JSON.parse(data);
        polarchart("today",parse_sit_time_label(obj["sit_time"]),parse_sit_time_value(obj["sit_time"]));
      }
    }
  }
}
function sit_time_seven_days(){
  var sevendays = lastWeekArray();
  console.log(sevendays);
  console.log("-------------------");
  var filearry = sevendays[0];
  for(var i =1;i<sevendays.length;i++){
     filearry = filearry + ","+sevendays[i];
  }
  var request = createRequest();
    if (request==null){
      alert("Unable to create request");
      return;
    }
  request.onreadystatechange=showdata;
  request.open("GET","readfile.php?f="+filearry,true);
  request.send(null);
  function showdata(){
    var objarray =new Array();
    if (request.readyState==4){
      if (request.status==200){
        var data = request.responseText;
        console.log(data);
        var split = data.split("~~~~~~~~~~");
        for(var i =0;i<split.length-1;i++){
          objarray.push(JSON.parse(split[i]));
        }
        label = new Array();
        for(var i =0 ; i<sevendays.length;i++){
          label.push(sevendays[i].split(".")[0]);
        }
        var dataset = new Array();
        for(var i =0; i<objarray.length;i++){
          dataset[i]=parse_sit_time_value(objarray[i]["sit_time"]);
        }
        linecomparechart("seven_days",label,dataset);
      }
    }
  }
}




function sit_time_weeks_ago_same_day(){
  fourdays = last4WeekSameDay();
  console.log(fourdays);
  console.log("-------------------");
  var filearry = fourdays[0];
  for(var i =1;i<fourdays.length;i++){
     filearry = filearry + ","+fourdays[i];
  }
  var request = createRequest();
    if (request==null){
      alert("Unable to create request");
      return;
    }
  request.onreadystatechange=showdata;
  request.open("GET","readfile.php?f="+filearry,true);
  request.send(null);
  function showdata(){
    var objarray =new Array();
    if (request.readyState==4){
      if (request.status==200){
        var data = request.responseText;
        var split = data.split("~~~~~~~~~~");
        for(var i =0;i<split.length-1;i++){
          objarray.push(JSON.parse(split[i]));
        }
        label = new Array();
        for(var i =0 ; i<fourdays.length;i++){
          label.push(fourdays[i].split(".")[0]);
        }
        var dataset = new Array();
        for(var i =0; i<objarray.length;i++){
          dataset[i]=parse_sit_time_value(objarray[i]["sit_time"]);
        }
        linecomparechart("weeks_ago_same_day",label,dataset);
      }
    }
  }
}
function sit_time_compare_weeks(){
  var weeks =getpassedweek();
  console.log(weeks);
  console.log("-------------------");
  var filearry = weeks[0];
  for(var i =1;i<weeks.length;i++){
     filearry = filearry + ","+weeks[i];
  }
  var request = createRequest();
    if (request==null){
      alert("Unable to create request");
      return;
    }
  request.onreadystatechange=showdata;
  request.open("GET","readfile.php?f="+filearry,true);
  request.send(null);
  function showdata(){
    var objarray =new Array();
    if (request.readyState==4){
      if (request.status==200){
        var data = request.responseText;
        var split = data.split("~~~~~~~~~~");
        for(var i =0;i<split.length-1;i++){
          objarray.push(JSON.parse(split[i]));
        }
        label = new Array();
        for(var i =0 ; i<weeks.length;i++){
          label.push(weeks[i].split(".")[0].split("avg-")[1]);
        }
        var dataset = new Array();
        for(var i =0; i<objarray.length;i++){
          dataset[i]=parse_sit_time_value(objarray[i]["sit_time"]);
        }
        linecomparechart("compare_weeks",label,dataset);
      }
    }
  }
}
function sit_time_compare_months(){
  passedmonth = getpassedmonth();
  console.log(passedmonth);
  console.log("-------------------");
  var filearry = passedmonth[0];
  for(var i =1;i<passedmonth.length;i++){
     filearry = filearry + ","+passedmonth[i];
  }
  var request = createRequest();
    if (request==null){
      alert("Unable to create request");
      return;
    }
  request.onreadystatechange=showdata;
  request.open("GET","readfile.php?f="+filearry,true);
  request.send(null);
  function showdata(){
    var objarray =new Array();
    if (request.readyState==4){
      if (request.status==200){
        var data = request.responseText;
        var split = data.split("~~~~~~~~~~");
        for(var i =0;i<split.length-1;i++){
          objarray.push(JSON.parse(split[i]));
        }
        label = new Array();
        for(var i =0 ; i<passedmonth.length;i++){
          label.push(passedmonth[i].split(".")[0].split("avg-")[1]);
        }
        var dataset = new Array();
        for(var i =0; i<objarray.length;i++){
          dataset[i]=parse_sit_time_value(objarray[i]["sit_time"]);
        }
        linecomparechart("compare_months",label,dataset);
      }
    }
  }
}

function avg_sitting_time_today(){
  today = getToday();
  console.log(today);
  var request = createRequest();
    if (request==null){
      alert("Unable to create request");
      return;
    }
  request.onreadystatechange=showdata;
  request.open("GET","readfile.php?f="+today,true);
  request.send(null);
  function showdata(){
    if (request.readyState==4){
      if (request.status==200){
        var data = request.responseText;
        var obj = JSON.parse(data);
        console.log(parse_avg_sitting_time(obj["avg_sitting_time"]));
        console.log("-------------------");
      }
    }
  }
}

function avg_sitting_time_seven_days(){
  var sevendays = lastWeekArray();
  console.log(sevendays);
  console.log("-------------------");
  var filearry = sevendays[0];
  for(var i =1;i<sevendays.length;i++){
     filearry = filearry + ","+sevendays[i];
  }
  var request = createRequest();
    if (request==null){
      alert("Unable to create request");
      return;
    }
  request.onreadystatechange=showdata;
  request.open("GET","readfile.php?f="+filearry,true);
  request.send(null);
  function showdata(){
    var objarray =new Array();
    if (request.readyState==4){
      if (request.status==200){
        var data = request.responseText;
        var split = data.split("~~~~~~~~~~");
        for(var i =0;i<split.length-1;i++){
          objarray.push(JSON.parse(split[i]));
        }
        label = new Array();
        for(var i =0 ; i<sevendays.length;i++){
          label.push(sevendays[i].split(".")[0]);
        }
        var dataset = new Array();
        for(var i =0; i<objarray.length;i++){
          dataset[i]=parse_avg_sitting_time(objarray[i]["avg_sitting_time"]);
        }
        linechart("seven_days",label,dataset);
      }
    }
  }
}

function avg_sitting_time_weeks_ago_same_day(){
  var fourdays =last4WeekSameDay();
  console.log(fourdays);
  console.log("-------------------");
  var filearry = fourdays[0];
  for(var i =1;i<fourdays.length;i++){
     filearry = filearry + ","+fourdays[i];
  }
  var request = createRequest();
    if (request==null){
      alert("Unable to create request");
      return;
    }
  request.onreadystatechange=showdata;
  request.open("GET","readfile.php?f="+filearry,true);
  request.send(null);
  function showdata(){
    var objarray =new Array();
    if (request.readyState==4){
      if (request.status==200){
        var data = request.responseText;
        var split = data.split("~~~~~~~~~~");
        for(var i =0;i<split.length-1;i++){
          objarray.push(JSON.parse(split[i]));
        }
        label = new Array();
        for(var i =0 ; i<fourdays.length;i++){
          label.push(fourdays[i].split(".")[0]);
        }
        var dataset = new Array();
        for(var i =0; i<objarray.length;i++){
          dataset[i]=parse_avg_sitting_time(objarray[i]["avg_sitting_time"]);
        }
        linechart("weeks_ago_same_day",label,dataset);
      }
    }
  }
}
function avg_sitting_time_compare_weeks(){
  var weeks =getpassedweek();
  console.log(weeks);
  console.log("-------------------");
  var filearry = weeks[0];
  for(var i =1;i<weeks.length;i++){
     filearry = filearry + ","+weeks[i];
  }
  var request = createRequest();
    if (request==null){
      alert("Unable to create request");
      return;
    }
  request.onreadystatechange=showdata;
  request.open("GET","readfile.php?f="+filearry,true);
  request.send(null);
  function showdata(){
    var objarray =new Array();
    if (request.readyState==4){
      if (request.status==200){
        var data = request.responseText;
        var split = data.split("~~~~~~~~~~");
        for(var i =0;i<split.length-1;i++){
          objarray.push(JSON.parse(split[i]));
        }
        label = new Array();
        for(var i =0 ; i<weeks.length;i++){
          labelname=weeks[i].split(".")[0].split("-");
          label.push(labelname[2]+"-"+labelname[3]);
        }
        var dataset = new Array();
        for(var i =0; i<objarray.length;i++){
          dataset[i]=parse_avg_sitting_time(objarray[i]["avg_sitting_time"]);
        }
        linechart("compare_weeks",label,dataset);
      }
    }
  }
}

function avg_sitting_time_compare_months(){
  passedmonth = getpassedmonth();
  console.log(passedmonth);
  console.log("-------------------");
  var filearry = passedmonth[0];
  for(var i =1;i<passedmonth.length;i++){
     filearry = filearry + ","+passedmonth[i];
  }
  var request = createRequest();
    if (request==null){
      alert("Unable to create request");
      return;
    }
  request.onreadystatechange=showdata;
  request.open("GET","readfile.php?f="+filearry,true);
  request.send(null);
  function showdata(){
    var objarray =new Array();
    if (request.readyState==4){
      if (request.status==200){
        var data = request.responseText;
        var split = data.split("~~~~~~~~~~");
        for(var i =0;i<split.length-1;i++){
          objarray.push(JSON.parse(split[i]));
        }
        label = new Array();
        for(var i =0 ; i<passedmonth.length;i++){
          month = passedmonth[i].split(".")[0].split("-")[2];
          label.push(month);
        }
        var dataset = new Array();
        for(var i =0; i<objarray.length;i++){
          dataset[i]=parse_avg_sitting_time(objarray[i]["avg_sitting_time"]);
        }
        linechart("compare_months",label,dataset);
      }
    }
  }
}

function come_taxi_today(){
  today = getToday();
  console.log(today);
  console.log("-------------------");
  var request = createRequest();
    if (request==null){
      alert("Unable to create request");
      return;
    }
  request.onreadystatechange=showdata;
  request.open("GET","readfile.php?f="+today,true);
  request.send(null);
  function showdata(){
    if (request.readyState==4){
      if (request.status==200){
        var data = request.responseText;
        var obj=JSON.parse(data);
        label = ["0am","1am","2am","3am","4am","5am","6am","7am","8am","9am","10am","11am",
                "12pm","1pm","2pm","3pm","4pm","5pm","6pm","7pm","8pm","9pm","10pm","11pm"];
        dataset = parse_come(obj["come_and_leave"]);
        linechart("today",label,dataset);
      }
    }
  }
}
function come_taxi_seven_days(){
  var sevendays = lastWeekArray();
  console.log(sevendays);
  var filearry = sevendays[0];
  for(var i =1;i<sevendays.length;i++){
     filearry = filearry + ","+sevendays[i];
  }
  var request = createRequest();
    if (request==null){
      alert("Unable to create request");
      return;
    }
  request.onreadystatechange=showdata;
  request.open("GET","readfile.php?f="+filearry,true);
  request.send(null);
  function showdata(){
    var objarray =new Array();
    if (request.readyState==4){
      if (request.status==200){
        var data = request.responseText;
        var split = data.split("~~~~~~~~~~");
        for(var i =0;i<split.length-1;i++){
          objarray.push(JSON.parse(split[i]));
        }
        label =["0am","1am","2am","3am","4am","5am","6am","7am","8am","9am","10am","11am",
                "12pm","1pm","2pm","3pm","4pm","5pm","6pm","7pm","8pm","9pm","10pm","11pm"];
        var dataset = new Array();
        for(var i =0; i<objarray.length;i++){
          dataset[i]=parse_come(objarray[i]["come_and_leave"]);
        }
        linechart("seven_days",label,dataset);
        littlechart("seven_days",sevendays);
        console.log("-------------------");
      }
    }
  }
}
function come_taxi_weeks_ago_same_day(){
  var fourdays = last4WeekSameDay();
  console.log(fourdays);
  var filearry = fourdays[0];
  for(var i =1;i<fourdays.length;i++){
     filearry = filearry + ","+fourdays[i];
  }
  var request = createRequest();
    if (request==null){
      alert("Unable to create request");
      return;
    }
  request.onreadystatechange=showdata;
  request.open("GET","readfile.php?f="+filearry,true);
  request.send(null);
  function showdata(){
    var objarray =new Array();
    if (request.readyState==4){
      if (request.status==200){
        var data = request.responseText;

        var split = data.split("~~~~~~~~~~");
        for(var i =0;i<split.length-1;i++){
          objarray.push(JSON.parse(split[i]));
        }
        label =["0am","1am","2am","3am","4am","5am","6am","7am","8am","9am","10am","11am",
                "12pm","1pm","2pm","3pm","4pm","5pm","6pm","7pm","8pm","9pm","10pm","11pm"];
        var dataset = new Array();
        for(var i =0; i<objarray.length;i++){
          dataset[i]=parse_come(objarray[i]["come_and_leave"]);
        }
        linechart("weeks_ago_same_day",label,dataset);
        littlechart("weeks_ago_same_day",fourdays);
        console.log("-------------------");
      }
    }
  }
}


function come_taxi_compare_weeks(){
  var weeks = getpassedweek();
  console.log(weeks);
  var filearry = weeks[0];
  for(var i =1;i<weeks.length;i++){
     filearry = filearry + ","+weeks[i];
  }
  var request = createRequest();
    if (request==null){
      alert("Unable to create request");
      return;
    }
  request.onreadystatechange=showdata;
  request.open("GET","readfile.php?f="+filearry,true);
  request.send(null);
  function showdata(){
    var objarray =new Array();
    if (request.readyState==4){
      if (request.status==200){
        var data = request.responseText;
        var split = data.split("~~~~~~~~~~");
        for(var i =0;i<split.length-1;i++){
          objarray.push(JSON.parse(split[i]));
        }
        label =["0am","1am","2am","3am","4am","5am","6am","7am","8am","9am","10am","11am",
                "12pm","1pm","2pm","3pm","4pm","5pm","6pm","7pm","8pm","9pm","10pm","11pm"];
        var dataset = new Array();
        for(var i =0; i<objarray.length;i++){
          dataset[i]=parse_come(objarray[i]["come_and_leave"]);
        }
        linechart("compare_weeks",label,dataset);
        littlechart("compare_weeks",weeks);
      }
    }
  }
  console.log("-------------------");
}

function come_taxi_compare_months(){
  var passedmonth = getpassedmonth();
  console.log(passedmonth);
  var filearry = passedmonth[0];
  for(var i =1;i<passedmonth.length;i++){
     filearry = filearry + ","+passedmonth[i];
  }
  var request = createRequest();
    if (request==null){
      alert("Unable to create request");
      return;
    }
  request.onreadystatechange=showdata;
  request.open("GET","readfile.php?f="+filearry,true);
  request.send(null);
  function showdata(){
    var objarray =new Array();
    if (request.readyState==4){
      if (request.status==200){
        var data = request.responseText;
        var split = data.split("~~~~~~~~~~");
        for(var i =0;i<split.length-1;i++){
          objarray.push(JSON.parse(split[i]));
        }
        label =["0am","1am","2am","3am","4am","5am","6am","7am","8am","9am","10am","11am",
                "12pm","1pm","2pm","3pm","4pm","5pm","6pm","7pm","8pm","9pm","10pm","11pm"];
        var dataset = new Array();
        for(var i =0; i<objarray.length;i++){
          dataset[i]=parse_come(objarray[i]["come_and_leave"]);
        }
        linechart("compare_months",label,dataset);
        littlechart("compare_months",passedmonth);
      }
    }
  }
  console.log("-------------------");
}
function leave_taxi_today(){
  today = getToday();
  console.log(today);
  console.log("-------------------");
  var request = createRequest();
    if (request==null){
      alert("Unable to create request");
      return;
    }
  request.onreadystatechange=showdata;
  request.open("GET","readfile.php?f="+today,true);
  request.send(null);
  function showdata(){
    if (request.readyState==4){
      if (request.status==200){
        var data = request.responseText;
        var obj=JSON.parse(data);
        label = ["0am","1am","2am","3am","4am","5am","6am","7am","8am","9am","10am","11am",
                "12pm","1pm","2pm","3pm","4pm","5pm","6pm","7pm","8pm","9pm","10pm","11pm"];
        dataset = parse_leave(obj["come_and_leave"]);
        linechart("today",label,dataset);
      }
    }
  }
}

function leave_taxi_seven_days(){
  var sevendays =lastWeekArray();
  var filearry = sevendays[0];
  console.log(sevendays);
  for(var i =1;i<sevendays.length;i++){
     filearry = filearry + ","+sevendays[i];
  }
  var request = createRequest();
    if (request==null){
      alert("Unable to create request");
      return;
    }
  request.onreadystatechange=showdata;
  request.open("GET","readfile.php?f="+filearry,true);
  request.send(null);
  function showdata(){
    var objarray =new Array();
    if (request.readyState==4){
      if (request.status==200){
        var data = request.responseText;
        var split = data.split("~~~~~~~~~~");
        for(var i =0;i<split.length-1;i++){
          objarray.push(JSON.parse(split[i]));
        }
        label =["0am","1am","2am","3am","4am","5am","6am","7am","8am","9am","10am","11am",
                "12pm","1pm","2pm","3pm","4pm","5pm","6pm","7pm","8pm","9pm","10pm","11pm"];
        var dataset = new Array();
        for(var i =0; i<objarray.length;i++){
          dataset[i]=parse_leave(objarray[i]["come_and_leave"]);
        }
        linechart("seven_days",label,dataset);
        littlechart("seven_days",sevendays);
        console.log("-------------------");
      }
    }
  }
}
function leave_taxi_weeks_ago_same_day(){
  var fourdays =last4WeekSameDay();
  var filearry = fourdays[0];
  for(var i =1;i<fourdays.length;i++){
     filearry = filearry + ","+fourdays[i];
  }
  var request = createRequest();
    if (request==null){
      alert("Unable to create request");
      return;
    }
  request.onreadystatechange=showdata;
  request.open("GET","readfile.php?f="+filearry,true);
  request.send(null);
  function showdata(){
    var objarray =new Array();
    if (request.readyState==4){
      if (request.status==200){
        var data = request.responseText;
        var split = data.split("~~~~~~~~~~");
        for(var i =0;i<split.length-1;i++){
          objarray.push(JSON.parse(split[i]));
        }
        label =["0am","1am","2am","3am","4am","5am","6am","7am","8am","9am","10am","11am",
                "12pm","1pm","2pm","3pm","4pm","5pm","6pm","7pm","8pm","9pm","10pm","11pm"];
        var dataset = new Array();
        for(var i =0; i<objarray.length;i++){
          dataset[i]=parse_leave(objarray[i]["come_and_leave"]);
        }
        linechart("weeks_ago_same_day",label,dataset);
        littlechart("weeks_ago_same_day",fourdays);
        console.log(fourdays);
        console.log("-------------------");
      }
    }
  }
}
function leave_taxi_compare_weeks(){
  var weeks =getpassedweek();
  var filearry = weeks[0];
  for(var i =1;i<weeks.length;i++){
     filearry = filearry + ","+weeks[i];
  }
  var request = createRequest();
    if (request==null){
      alert("Unable to create request");
      return;
    }
  request.onreadystatechange=showdata;
  request.open("GET","readfile.php?f="+filearry,true);
  request.send(null);
  function showdata(){
    var objarray =new Array();
    if (request.readyState==4){
      if (request.status==200){
        var data = request.responseText;
        var split = data.split("~~~~~~~~~~");
        for(var i =0;i<split.length-1;i++){
          objarray.push(JSON.parse(split[i]));
        }
        label =["0am","1am","2am","3am","4am","5am","6am","7am","8am","9am","10am","11am",
                "12pm","1pm","2pm","3pm","4pm","5pm","6pm","7pm","8pm","9pm","10pm","11pm"];
        var dataset = new Array();
        for(var i =0; i<objarray.length;i++){
          dataset[i]=parse_leave(objarray[i]["come_and_leave"]);
        }
        linechart("compare_weeks",label,dataset);
        littlechart("compare_weeks",weeks);
        console.log(weeks);
        console.log("-------------------");
      }
    }
  }
}
function leave_taxi_compare_months(){
  var passedmonth =getpassedmonth();
  var filearry = passedmonth[0];
  for(var i =1;i<passedmonth.length;i++){
     filearry = filearry + ","+passedmonth[i];
  }
  var request = createRequest();
    if (request==null){
      alert("Unable to create request");
      return;
    }
  request.onreadystatechange=showdata;
  request.open("GET","readfile.php?f="+filearry,true);
  request.send(null);
  function showdata(){
    var objarray =new Array();
    if (request.readyState==4){
      if (request.status==200){
        var data = request.responseText;
        var split = data.split("~~~~~~~~~~");
        for(var i =0;i<split.length-1;i++){
          objarray.push(JSON.parse(split[i]));
        }
        label =["0am","1am","2am","3am","4am","5am","6am","7am","8am","9am","10am","11am",
                "12pm","1pm","2pm","3pm","4pm","5pm","6pm","7pm","8pm","9pm","10pm","11pm"];
        var dataset = new Array();
        for(var i =0; i<objarray.length;i++){
          dataset[i]=parse_leave(objarray[i]["come_and_leave"]);
        }
        linechart("compare_months",label,dataset);
        littlechart("compare_months",passedmonth);
        console.log(passedmonth);
        console.log("-------------------");
      }
    }
  }
}

// function driver_today(){
//   today = getToday();

//   var request = createRequest();
//     if (request==null){
//       alert("Unable to create request");
//       return;
//     }
//   request.onreadystatechange=showdata;
//   request.open("GET","readfile.php?f="+today,true);
//   request.send(null);
//   function showdata(){
//     if (request.readyState==4){
//       if (request.status==200){
//         var data = request.responseText;
//         var obj = JSON.parse(data);
//         driver = parse_driver(obj["司機"]);
//         // console.log("今天是 "+today+" 。司機名單如下：");
//         // console.log(driver);
//         // console.log("-------------------");
//         return driver;
//       }
//     }
//   }

//   return showdata();
// }

driver_today = function(){
  today = getToday();
  
  var request = createRequest();
    if (request==null){
      alert("Unable to create request");
      return;
    }
  request.onreadystatechange=showdata;
  request.open("GET","readfile.php?f="+today,false);
  request.send(null);
  function showdata(){
    if (request.readyState==4){
      if (request.status==200){
        var data = request.responseText;
        var obj = JSON.parse(data);
        driver = parse_driver(obj["司機"]);
        console.log("今天是 "+today+" 。司機名單如下：");
        console.log(driver);
        console.log("-------------------");
        return driver;
      }
    }
  }

  return showdata();
}


function who_overtime_today(){
  today = getToday();
  console.log(today);
  var request = createRequest();
    if (request==null){
      alert("Unable to create request");
      return;
    }
  request.onreadystatechange=showdata;
  request.open("GET","readfile.php?f="+today,true);
  request.send(null);
  function showdata(){
    if (request.readyState==4){
      if (request.status==200){
        var data = request.responseText;
        var obj=JSON.parse(data);
        console.log(parse_over_time(obj["超時"]));
        console.log("-------------------");
      }
    }
  }
}

function who_overtime_this_week(){
  thisweek = getthisweek();
  console.log(thisweek);
  var request = createRequest();
    if (request==null){
      alert("Unable to create request");
      return;
    }
  request.onreadystatechange=showdata;
  request.open("GET","readfile.php?f="+thisweek,true);
  request.send(null);
  function showdata(){
    if (request.readyState==4){
      if (request.status==200){
        var data = request.responseText;
        var obj=JSON.parse(data);
        console.log(parse_over_time_manydays(obj["超時"]));
        console.log("-------------------");
      }
    }
  }
}
function who_overtime_this_month(){
  thismonth = getthismonth();
  console.log(thismonth);
  var request = createRequest();
    if (request==null){
      alert("Unable to create request");
      return;
    }
  request.onreadystatechange=showdata;
  request.open("GET","readfile.php?f="+thismonth,true);
  request.send(null);
  function showdata(){
    if (request.readyState==4){
      if (request.status==200){
        var data = request.responseText;
        var obj=JSON.parse(data);
        console.log(parse_over_time_manydays(obj["超時"]));
        console.log("-------------------");
      }
    }
  }
}
function overtime_today(){
  today = getToday();
  console.log(today);
  console.log("-------------------");
  var request = createRequest();
    if (request==null){
      alert("Unable to create request");
      return;
    }
  request.onreadystatechange=showdata;
  request.open("GET","readfile.php?f="+today,true);
  request.send(null);
  function showdata(){
    if (request.readyState==4){
      if (request.status==200){
        var data = request.responseText;
        var obj = JSON.parse(data);
        value=parse_over_time(obj["超時"]);
        dataset = [0,0,0,0,0];
        length=Object.keys(value).length;
        for(var i =0 ;i<length;i++){
          if(value[Object.keys(value)[i]]<=30){
            dataset[0]++;
          }else if(value[Object.keys(value)[i]]>30 &&value[Object.keys(value)[i]]<=60){
            dataset[1]++;
          }else if(value[Object.keys(value)[i]]>60 &&value[Object.keys(value)[i]]<=90){
            dataset[2]++;
          }else if(value[Object.keys(value)[i]]>90 &&value[Object.keys(value)[i]]<=120){
            dataset[3]++;
          }else if(value[Object.keys(value)[i]]>120){
            dataset[4]++;
          }
        }
        label = ["30m","60m","90m","120m",">120m"];
        polarchart("today",label,dataset);
      }
    }
  }
}
function overtime_compare_weeks(){
  var weeks =getpassedweek();
  console.log(weeks);
  console.log("-------------------");
  var filearry = weeks[0];
  for(var i =1;i<weeks.length;i++){
     filearry = filearry + ","+weeks[i];
  }
  var request = createRequest();
    if (request==null){
      alert("Unable to create request");
      return;
    }
  request.onreadystatechange=showdata;
  request.open("GET","readfile.php?f="+filearry,true);
  request.send(null);
  function showdata(){
    var objarray =new Array();
    if (request.readyState==4){
      if (request.status==200){
        var data = request.responseText;
        var split = data.split("~~~~~~~~~~");
        for(var i =0;i<split.length-1;i++){
          objarray.push(JSON.parse(split[i]));
        }
        label = new Array();
        for(var i =0 ; i<weeks.length;i++){
          label.push(weeks[i].split(".")[0].split("avg-")[1].split("week-")[1]);
        }
        var dataset = new Array();
        length = objarray.length;
        dataset = new Array();
        for(var i =0; i<length;i++){
          tmp_dataset = [0,0,0,0,0];
          arraydata=parse_over_time_manydays(objarray[i]["超時"]);
          for(var j =0;j<length; j++){
            if(arraydata[Object.keys(arraydata)[j]]<=30){
              tmp_dataset[0]++;
            }else if(arraydata[Object.keys(arraydata)[j]]>30&&arraydata[Object.keys(arraydata)[j]]<=60){
              tmp_dataset[1]++;
            }else if(arraydata[Object.keys(arraydata)[j]]>60&&arraydata[Object.keys(arraydata)[j]]<=90){
              tmp_dataset[2]++;
            }else if(arraydata[Object.keys(arraydata)[j]]>90&&arraydata[Object.keys(arraydata)[j]]<=120){
              tmp_dataset[3]++;
            }else if(arraydata[Object.keys(arraydata)[j]]>120){
              tmp_dataset[4]++;
            }
            dataset[i]=tmp_dataset;
          }
        }
        console.log(dataset);
        linecomparechart("compare_weeks",label,dataset);
      }
    }
  }
}