#pragma strict

class Player
{
	public var controller: PlayerController;
	public var character: Character;

	public var color: Color;
	public var name: String;
	public var uid: int;
	
	public var points : int = 0;
	public var life : int = 10;
	public var lifeDef : int = 10;

	public var wins : int = 0;
	public var loses : int = 0;

	public var isIA: boolean = false;
	public var isActive : boolean = false;

	public var device : CompatibleDevice;

	public function FullReset() {
		GameReset();
		wins = 0;
		loses = 0;
	}

	public function GameReset() {
		points = 0;
		life = lifeDef;
	}

	public function GetDamaged(damage:int) {
		life -= damage;
		controller.GetComponent.<ParticleSystem>().Play();
	}
}
