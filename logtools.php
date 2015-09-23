<?php
	class LogTools {
		private $connection;

		function __construct() {
			require("connectDB.php");
	       	$this->connection = $db;
	   	}

	   	public function save($action, $target, $value) {
		   	$stmt  = $this->connection->prepare("INSERT INTO `log` (Ip, Action, Target, Value) VALUES (?, ?, ?, ?)");
		   	$ip = $this->get_client_ip();
			$stmt ->execute(array($ip, $action, $target, $value));
		}

	   	private function get_client_ip() {
			if (!empty($_SERVER["HTTP_CLIENT_IP"])){
			    $ip = $_SERVER["HTTP_CLIENT_IP"];
			} elseif(!empty($_SERVER["HTTP_X_FORWARDED_FOR"])){
			    $ip = $_SERVER["HTTP_X_FORWARDED_FOR"];
			} else{
			    $ip = $_SERVER["REMOTE_ADDR"];
			}
			return $ip;
		}
	}

	abstract class Action
	{
	    const Delete = 0;
	    const Insert = 1;
	    const Update = 2;
	    const Select = 3;
	}
?>