#pragma strict

public class CatchableBonus extends Hittable
{

var bonus : BonusDefinition;
var bonusType : String;

public var bonusSpeed : BonusDefinition = new BonusDefinition(1.3, 0, 2);
public var bonusStrength : BonusDefinition = new BonusDefinition(1.1, 0, 2);
public var bonusLife : BonusDefinition = new BonusDefinition(1, 25, 0);

function Awake () {
	var r : int = Random.Range(0, 9);

	if (r <= 4) {
		bonus = bonusSpeed;
		bonusType = 'speed';
	} else if (r <= 8) {
		bonus = bonusStrength;
		bonusType = 'strength';
	} else {
		bonus = bonusLife;
		bonusType = 'life';
	}

	// Debug.Log(r + '--' + bonusType);
}

function OnTriggerEnter2D(col : Collider2D) {
	if (col.gameObject.tag == "Player" && !col.isTrigger) { // only collide on base player

		var playerToApplyBonus : PlayerController = col.gameObject.GetComponent.<PlayerController>();
		playerToApplyBonus.ApplyBonus(bonusType, bonus);

		Die();
	}
}

}