<?php

class Google {

	static function config(){
		return ( include Sitatvegg::configDirectory().'/google.php' );
	}

	static function retrieve(){
		$config = self::config();
		return json_decode(file_get_contents($config['feed']));
	}

	static function parse(){
		
		var_dump(self::retrieve());
	}

}