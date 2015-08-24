#pragma strict
@script RequireComponent(Rigidbody2D)

import System.Collections.Generic;

public var speed : float = 5;
public var spriteRenderer : SpriteRenderer = null;
public var pushStrength : float = 25;
public var weakness : float = 20; // the higher, the more it will the pushed
public var attackCooldownDef : float = 0.5;


//public var particleSystem : ParticleSystem;

private var pushedVector : Vector2;
private var numberOfPushesLeft : int = 0; // number of time the push has to be applied
private var initialPushVector : Vector2;

private var touchedUnits : Array = new Array();

private var cooldownAttack : float = 0;

public var playerInfo: Player;
public var playerAI : PlayerAI;

// Animation
private var anim : Animator;
private var activeCompleteAnim: String = "";

//Partie SFX
public var soundHit : AudioClip [];
public var soundEat : AudioClip [];
public var soundDead : AudioClip [];

function Animate(animName : String, conserve: boolean) {
	if (!conserve)
	{
		if (anim.GetCurrentAnimatorStateInfo(0).IsName(animName))
		{
			return ;
		}
		if (activeCompleteAnim != "" && anim.GetCurrentAnimatorStateInfo(0).IsName(activeCompleteAnim))
		{
			return ;
		}	
	}
	anim.Play(animName);
	if (conserve) {
		activeCompleteAnim = animName;
	}
	else {
		return ;
	}
}

function Start () {
	anim = transform.GetComponentInChildren(Animator);
}

function Update () {

	var activeAnim : String = "MobIdle";

	if (GameController.isInGUI == false && GameController.gamePlaying) {
		
		var inputDevicesController : InputDevicesController = InputDevicesController.GetInstance();

		var moveX : float;
		var moveY : float;
		var isHitting : boolean = false;

		if (!playerInfo.isIA) {
			moveX = inputDevicesController.GetAxisForDevice("Horizontal", playerInfo.device);
			moveY = -inputDevicesController.GetAxisForDevice("Vertical", playerInfo.device);
		} else {
			// Remind to attach the script PlayerAI to the AI
			var move : Vector3 = playerAI.WhatShouldIDo();
			moveX = -move.x;
			moveY = -move.y;
		}

		if (numberOfPushesLeft >= 0) {
			if (numberOfPushesLeft == 0) {
				pushedVector = Vector2(0,0);
				initialPushVector = Vector2(0,0);
			} else {
				pushedVector -= initialPushVector / weakness;
			}
			numberOfPushesLeft--;
		}

		if (moveX != 0 || moveY != 0) { // TODO: check if there's no pause / gui display
			var rot_z:float = Mathf.Atan2(moveX, -moveY) * Mathf.Rad2Deg; // - moveY because we did shit with cameras
	    	transform.rotation = Quaternion.Euler(transform.rotation.x, transform.rotation.y, rot_z - 90f);
		}

		// Attack Event : button for normal player, AI-defined otherwise
		if (!playerInfo.isIA) {
			isHitting = inputDevicesController.GetButtonForDevice(ActionButton.ATTACK, playerInfo.device);
		} else {
			isHitting = playerAI.CanHit();
		}

		cooldownAttack -= Time.deltaTime;
		if (cooldownAttack > 0) {
			cooldownAttack -= Time.deltaTime;
		} else if (isHitting) {
			if (cooldownAttack > 0) {
				cooldownAttack -= Time.deltaTime;
			} else {
				// ATTACK !
				for (var i = 0; i < touchedUnits.length; i++) {
					var objectToHit : GameObject = touchedUnits[i] as GameObject;
					if (!objectToHit) {
						touchedUnits.RemoveAt(i);
					} else {
						if (objectToHit.tag == "Player") {
							this.Push(objectToHit);
							activeAnim = "MobKick 1";
							Animate(activeAnim, true);
						} else if (objectToHit.tag == "Building") {
							this.AttackBuilding(objectToHit);
							activeAnim = "MobEat";
							Animate(activeAnim, true);
						}
					}
				}
				cooldownAttack = attackCooldownDef;
			}
		}

	var rb : Rigidbody2D = GetComponent.<Rigidbody2D>();
	rb.angularVelocity = 0;
	rb.velocity = Vector2 (moveX * speed, moveY * speed) + pushedVector;
	}

	if (activeAnim == "MobIdle") {
		if (moveX != 0 || moveY != 0) activeAnim = "MobWalk";
		Animate(activeAnim, false);
	}
}

function OnTriggerEnter2D(collider : Collider2D) {
	if (!collider.gameObject.tag.Equals("Building") && !collider.gameObject.tag.Equals("Player")) {
		return;
	}
	/*if (ArrayUtility.Contains(touchedUnits.ToBuiltin(GameObject), collider.gameObject)) {
		return;
	}*/
	touchedUnits.Add(collider.gameObject);
	//Debug.Log("canHit: " + collider.gameObject.tag);
	//Debug.Log("touchedUnits: " + touchedUnits);
}
function OnTriggerExit2D(collider : Collider2D) {
	if (!collider.gameObject.tag.Equals("Building") && !collider.gameObject.tag.Equals("Player")) {
		return;
	}

	var cleared : boolean = false;
	while (cleared == false)
	{
		cleared = true;
		//Debug.Log("cantHit: " + collider.gameObject.tag);
		for (var i = 0; i < touchedUnits.Count; i++) {
			if (touchedUnits[i] == collider.gameObject) {
				//Debug.Log("removed 1 at index: " + i);
				touchedUnits.RemoveAt(i);
				cleared = false;
				break;
			}
		}
	}
		//Debug.Log(this.gameObject + "touchedUnits : " + touchedUnits);
}

function OnCollisionEnter2D(collision : Collision2D) {
	if (collision.gameObject.tag.Equals("PNJScared")) {
		collision.gameObject.GetComponent.<PNJScaredAI>().startPanicking(0.1);

		var dieingAudio : AudioClip [] = collision.gameObject.GetComponent.<PNJScaredAI>().dieingSounds;

		SoundManager.instance.PlaySfx(dieingAudio[Random.Range(0,dieingAudio.length)]);
		collision.gameObject.GetComponent.<Hittable>().Die();

		playerInfo.points++;
		ShouldPointsScale();

		Destroy(collision.gameObject);
	} else if (collision.gameObject.tag.Equals("Tree")) {
		collision.gameObject.GetComponent.<Hittable>().Die();
		Destroy(collision.gameObject);
	}
}

function ShouldPointsScale () {
	transform.localScale = Vector3(1, 1, 1) * (1 + playerInfo.points / 33f);
}

function Push(playerToPush:GameObject) {

	var direction:Vector3 = (playerToPush.transform.position - this.gameObject.transform.position);
	direction.Normalize();
	direction *= pushStrength;

	var player : PlayerController = playerToPush.GetComponent.<PlayerController>();
	player.pushedVector = direction;
	player.initialPushVector = direction;
	player.numberOfPushesLeft = player.weakness;

	var dmg : int = 25;
	var pointsToSteal : int = 10;
	var pointStealed : int = 0;

	player.playerInfo.GetDamaged(dmg);

	if (player.playerInfo.isAlive == false)
	{
		playerInfo.kills++;
		playerInfo.roundKills++;

		if(player.soundDead && player.soundDead.length > 0)
			SoundManager.instance.PlaySfx(player.soundDead[Random.Range(0,player.soundDead.length)]);

		//Si on porte le coup fatal, on vole plus de points
		pointsToSteal = 1.5 * pointsToSteal;

		pointStealed = player.playerInfo.GetPoints(pointsToSteal);
		playerInfo.points += pointStealed;

	}
	else
	{
		//joue le son de dmg du jouer
		if(player.soundHit && player.soundHit.length > 0)
			SoundManager.instance.PlaySfx(player.soundHit[Random.Range(0,player.soundHit.length)]);

		pointStealed = player.playerInfo.GetPoints(pointsToSteal);
		playerInfo.points += pointStealed;

	}
	ShouldPointsScale();
}

function AttackBuilding(buildingToHit:GameObject) {
	if(soundEat && soundEat.length > 0)
		SoundManager.instance.PlaySfx(soundEat[Random.Range(0,soundEat.length)]);

	buildingToHit.GetComponent.<Building>().GetDamaged(this.pushStrength);
}