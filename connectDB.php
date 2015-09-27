<?php
	date_default_timezone_set('Asia/Taipei');
    try {
    	$db = new PDO(
		    'mysql:host=localhost;dbname=e-cushion;charset=utf8',
		    'erweb_16206059',
		    'az815048'
		);
    	$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	} catch (PDOException $e) {	
	    echo 'Connection failed: ' . $e->getMessage();
	}
?>