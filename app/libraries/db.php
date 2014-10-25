<?php

use Illuminate\Database\Capsule\Manager as Capsule;

use Illuminate\Events\Dispatcher;
use Illuminate\Container\Container;

class DB extends Capsule {

	static function initiative(){
		$capsule = new Capsule;
		$capsule->addConnection(( include Sitatvegg::configDirectory().'/database.php' ));
		$capsule->setEventDispatcher(new Dispatcher(new Container));
		$capsule->setAsGlobal();
	}

}