#pragma strict

public class CatchableBonus extends Hittable
{

public var bonusSpeed : BonusDefinition = new BonusDefinition(5, 0, 2);
public var bonusStrength : BonusDefinition = new BonusDefinition(1.5, 0, 2);
public var bonusLife : BonusDefinition = new BonusDefinition(1, 50, 0);

function Start () {

}

function Update () {

}

function OnTriggerEnter2D(col : Collider2D) {
	if (col.gameObject.tag == "Player" && !col.isTrigger) { // only collide on base player
		// TODO: notify player
		
//		Debug.Log("enter");
		var playerToApplyBonus : PlayerController = col.gameObject.GetComponent.<PlayerController>();
		
		playerToApplyBonus.ApplyBonusSpeed(bonusSpeed);
		playerToApplyBonus.ApplyBonusStrength(bonusSpeed);
		playerToApplyBonus.ApplyBonusLife(bonusLife);
		
		Die();
	}
}

}