<?php
	$whitelist = array(
		'127.0.0.1',
		'::1'
	);

	if(!in_array($_SERVER['REMOTE_ADDR'], $whitelist)){
		header('Location: ../users/sign_in.php');
		exit();
	}
?>

<!DOCTYPE html>
<html>
<head>
	<title>index</title>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
</head>
<body>
	<script type="text/javascript">
		function getLogFromDatabase (argument) {
            $.ajax({
                    url: "putLogIntoTxt.php",
                    type:"POST",
                    data: {},
                    dataType:'text',
                    success: function(msg){
                    	$("#output").html("getLogFromDatabase");
                    	console.log(msg);
                    },
                     error:function(xhr, ajaxOptions, thrownError){ 
                        console.log(xhr.responseText);
                        console.log(thrownError); 
                        $("#output").html(thrownError);
                     }
                });
        }
		function updateWeek (argument) {
            $.ajax({
                    url: "create-week-log.php",
                    type:"POST",
                    data: {},
                    dataType:'text',
                    success: function(msg){
                    	$("#output").html("updateWeek");
                    	console.log(msg);
                    },
                     error:function(xhr, ajaxOptions, thrownError){ 
                        console.log(xhr.responseText);
                        console.log(thrownError); 
                        $("#output").html(thrownError);
                     }
                });
        }
		function updateMonth (argument) {
            $.ajax({
                    url: "create-month-log.php",
                    type:"POST",
                    data: {},
                    dataType:'text',
                    success: function(msg){
                    	$("#output").html("updateMonth");
                    	console.log(msg);
                    },
                     error:function(xhr, ajaxOptions, thrownError){ 
                        console.log(xhr.responseText);
                        console.log(thrownError); 
                        $("#output").html(thrownError);
                     }
                });
        }
		function clearSensor (argument) {
            $.ajax({
                    url: "clear_sensor_file.php",
                    type:"POST",
                    data: {},
                    dataType:'text',
                    success: function(msg){
                    	$("#output").html("clearSensor");
                    	console.log(msg);
                    },
                     error:function(xhr, ajaxOptions, thrownError){ 
                        console.log(xhr.responseText);
                        console.log(thrownError); 
                        $("#output").html(thrownError);
                     }
                });
        }
		function clearPi (argument) {
            $.ajax({
                    url: "clear_pi_file.php",
                    type:"POST",
                    data: {},
                    dataType:'text',
                    success: function(msg){
                    	$("#output").html("clearPi");
                    	console.log(msg);
                    },
                     error:function(xhr, ajaxOptions, thrownError){ 
                        console.log(xhr.responseText);
                        console.log(thrownError); 
                        $("#output").html(thrownError);
                     }
                });
        }
        //setInterval(clearPi, 600000);
        //setInterval(clearSensor, 600000);
        setInterval(getLogFromDatabase, 600000);
        setInterval(updateWeek, 600000);
        setInterval(updateMonth, 600000);
	</script>
	<button onclick="getLogFromDatabase()">getLogFromDatabase</button>
	<button onclick="updateWeek()">updateWeek</button>
	<button onclick="updateMonth()">updateMonth</button>
	<button onclick="clearSensor()">clearSensor</button>
	<button onclick="clearPi()">clearPi</button>
	<div id="output">
		
	</div>
</body>
</html>