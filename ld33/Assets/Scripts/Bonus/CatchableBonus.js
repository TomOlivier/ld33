#pragma strict

public class CatchableBonus extends Hittable
{

public var speedMultiplier : float = 1.5;
public var strengthMultiplier : float = 1.5;
public var flatBonusHP : int = 50;

function Start () {

}

function Update () {

}

function OnTriggerEnter2D(col : Collider2D) {
	if (col.gameObject.tag == "Player" && !col.isTrigger) { // only collide on base player
		// TODO: notify player
		
		Debug.Log("enter");
		
		Die();
	}
}

}