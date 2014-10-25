<?php

class Sitatvegg {
	
	static function initiative(){
		self::parser();
	}

	static function parser(){
		require self::viewsDirectory() . '/index.php';
	}

	static function configDirectory(){
		return realpath('../app/config');
	}

	static function viewsDirectory(){
		return realpath('../app/views');
	}

}