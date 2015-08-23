#pragma strict

class Player
{
	public var controller: PlayerController;
	public var character: Character;
	public var playerPrefab: GameObject; // set to load correct display of player

	// UI Vars
	public var relatedSelectionBox: GameObject; // related char selection Player box on bottom

	public var color: Color;
	public var name: String;
	public var uid: int;
	
	public var points : int = 0;
	public var life : int = 100;
	public var lifeDef : int = 100;
	public var maxLife : int = 100;
	public var maxLifeDef : int = 100;
	public var isAlive : boolean = true;

	public var wins : int = 0;
	public var loses : int = 0;

	public var isIA: boolean = false;
	public var isActive : boolean = false;

	public var device : CompatibleDevice = null;
	public var playerInstance : GameObject; // set once the game starts : instance of the prefab set before

	public function FullReset() {
		GameReset();
		wins = 0;
		loses = 0;
	}

	public function GameReset() {
		points = 0;
		life = lifeDef;
		maxLife = maxLifeDef;
		isAlive = true;
	}

	public function GetDamaged(damage:int) {
		life = life - damage;
		if (life > 0) {
			playerInstance.GetComponent.<Hittable>().GetHit(damage);
		}
		else {
			playerInstance.GetComponent.<Hittable>().Die();
			playerInstance = null;
			//GameReset();
		}
	}
}
