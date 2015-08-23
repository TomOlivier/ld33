#pragma strict

class Player
{
	public var controller: PlayerController;
	public var character: Character = null;
	public var playerPrefab: GameObject; // set to load correct display of player

	// UI Vars
	public var relatedSelectionBox: GameObject; // related char selection Player box on bottom

	public var color: Color;
	public var name: String;
	public var uid: int;
	
	public var points : int = 0;			// Active points/Force
	public var pointsMax : int = 100;		// Points required to enter RAMPAGE mode
	public var life : int = 100;			// active HP
	public var lifeDef : int = 100;			// HP on start
	public var maxLife : int = 100;			// max hp
	public var maxLifeDef : int = 100;		// max hp on start
	public var isAlive : boolean = true;

	public var rank : int = 0;				// Rank 1-4 of player
	public var score : int = 0;				// Round sets score
	public var wins : int = 0;				// Number of wins in set
	public var loses : int = 0;				// Number of loses

	public var isIA: boolean = false;
	public var isActive : boolean = false;

	public var device : CompatibleDevice = null;
	public var playerInstance : GameObject; // set once the game starts : instance of the prefab set before

	public function FullReset() {
		GameReset();
		wins = 0;
		loses = 0;
		score = 0;
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
			playerInstance.SendMessage ("GetHit", damage);
		}
		else {
			playerInstance.SendMessage ("Die");
			playerInstance = null;
			//GameReset();
		}
	}
}
