<?php
	if (!isset($_SESSION)) { session_start(); }
	$uid = $_SESSION["Member_ID"];
	$data = $_POST['data'];
	$areaName = $data['areaName'];

    $map = new writeMap($areaName);
    $map->createData($data);
    $map->writeData();

	/**
	* Write informations of maps into *.json
	*/
	class writeMap
	{
		private $file; //Files for reading and writing.
		private $output = array();

		function __construct($areaName)
		{
			$path = 'data/'. $areaName . '.json';
			$this->file = fopen($path, "w") or die("Unable to open file!");
		}

		function createData($data)
		{
			print_r($data);
			$group = array();
			$seat  = array();

			//Row entities
			$entity = array(
							'type'=> 'entity',
				            'no'  => $data['entity']
				            );
			array_push($this->output, $entity);

			//Group
			foreach ($data['group'] as $groupItem) {
				$group = array(
						      'type'=> 'group',
					          'no'=> $groupItem['no'],
					          'x' => $groupItem['x'],
				              'y' => $groupItem['y']
				              );
				array_push($this->output, $group);
			}

			//Seat
			foreach ($data['seat'] as $seatItem) {
				$seat =  array(
							   'type' => 'seat',
					           'a_mac'=> $seatItem['a_mac'],
					           'x'    => $seatItem['x'],
					           'y'    => $seatItem['y']
					           // 'occupied' => true !!!!!!!!!!!!!!!!!!!!!!
					           );
				
				array_push($this->output, $seat);
			}
		}

		function writeData()
		{
			fwrite($this->file, json_encode($this->output));
			fclose($this->file);
		}

		function deleteData()
		{
			
		}
	}


?>

