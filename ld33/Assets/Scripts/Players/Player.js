#pragma strict

class Player
{
	public var controller: PlayerController;
	public var character: Character = null;

	// UI Vars
	public var relatedSelectionBox: GameObject; // related char selection Player box on bottom

	public var color: Color;
	public var name: String;
	public var uid: int;

	public var points : float = 0;					// Active points/Force
	public var pointsMax : float = 100;				// Points required to enter RAMPAGE mode
	public var pointsPerNPC : float = 3;			// Points aquired per NPC kill
	public var life : int = 100;					// active HP
	public var lifeDef : int = 100;					// HP on start
	public var maxLife : int = 100;					// max hp
	public var maxLifeDef : int = 100;				// max hp on start
	public var hitDamage : int = 8;					// hit damage
	public var rampageDamage : int = 40;			// rampage damage;
	public var rampageResistance : float = 3.0f;	// damage divider when on rampage
	public var isAlive : boolean = true;			// if player is alive
	public var isRampage : boolean = false;			// player on rampage mode (insta kill)
	
	public var roundDeathId : int = 0;
	public var roundKills : int = 0;		// Total of kills this round
	public var kills : int = 0;				// Total of kills
	public var deaths : int = 0;			// Total of deaths
	public var wins : int = 0;				// Number of wins
	public var loses : int = 0;				// Number of loses

	public var rank : int = 0;				// Rank 1-4 of player
	public var score : int = 0;				// Round sets score

	public var isIA: boolean = false;
	public var isActive : boolean = false;

	public var device : CompatibleDevice = null;
	public var playerInstance : GameObject; // set once the game starts : instance of the prefab set before


	public function FullReset() {
		GameReset();
		wins = 0;
		loses = 0;
		score = 0;
		kills = 0;
		deaths = 0;
	}

	public function GameReset() {
		points = 0;
		life = lifeDef;
		maxLife = maxLifeDef;
		isAlive = true;
		roundKills = 0;
		isRampage = false;
	}

	public function GetPoints(damage : int) : int {
		if(points > damage){
			points -= damage;
			return damage;
		} else {
			var diff : int = points;
			points = 0;
			return points;
		}
	}

	public function TriggerRampage()
	{
		if (isRampage)
			return ;
		isRampage = true;
		GameObject.Find("Game").BroadcastMessage("PlayerRampage", this);
	}

	public function GetDamaged(damage:int) {
		if (isRampage) {
			damage /= rampageResistance;
		}
		life = life - damage;

		if (life > 0 && isAlive) {
			playerInstance.GetComponent.<Hittable>().GetHit(damage);
		} else {
			if (playerInstance) {
				playerInstance.GetComponent.<Hittable>().Die();
			}

			playerInstance = null;
			isAlive = false;
			GameObject.Find("Game").BroadcastMessage("PlayerDied", this);
		}
	}

	function AddLife (l : int) {
		life = Mathf.Min(life + l, maxLife);
		Debug.Log('Life ' + life);
	}
}
