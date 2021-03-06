﻿#pragma strict
@script RequireComponent(Rigidbody2D)

import System.Collections.Generic;
public var spriteRenderer : SpriteRenderer = null;

public var speed : float = 5;
public var pushStrength : float = 10;
public var weakness : float = 20; // the higher, the more it will the pushed
public var attackCooldownDef : float = 0.5;

public var eatCooldownDef : float = 0.25;

//public var particleSystem : ParticleSystem;

private var bonusSpeed : Array = new Array();
private var bonusLife : Array = new Array();
private var bonusStrength : Array = new Array();

private var pushedVector : Vector2;
private var numberOfPushesLeft : int = 0; // number of time the push has to be applied
private var initialPushVector : Vector2;

public var touchedUnits : Array = new Array();

private var cooldownAttack : float = 0;

public var playerInfo: Player;
public var playerAI : PlayerAI;

public var hitColliderWrapper : GameObject;

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

function OnTriggerEnter2D(collider : Collider2D) {
	return;	
}
function OnTriggerExit2D(collider : Collider2D) {
	return;
}

function Update () {

	var activeAnim : String = "MobIdle";

	if (GameController.isInGUI == false && GameController.gamePlaying) {
		var i : int = 0;

		// BONUSES
		var calculatedSpeed : float = speed;
		var calculatedStrength : float = pushStrength;
		var calculatedLife : float = playerInfo.life; // TODO: implement this

		// SPEED
		var bonusDef : BonusDefinition;
		for (i = 0; i < bonusSpeed.length;i++) {
			bonusDef = bonusSpeed[i];

			calculatedSpeed *= bonusDef.multiplier;
			calculatedSpeed += bonusDef.flatValue * Time.deltaTime;
			calculatedSpeed /= 3;

			calculatedSpeed = Mathf.Min(calculatedSpeed, 30.0);

			if (bonusDef.duration > 0) {
				bonusDef.duration -= Time.deltaTime;
				if (bonusDef.duration <= 0) {
					bonusSpeed.RemoveAt(i);
					i--;
				}
			}
		}
		// Strength
		for (i = 0; i < bonusStrength.length;i++) {
			bonusDef = bonusStrength[i];

			calculatedStrength = DamageLevel() * bonusDef.multiplier;
			calculatedStrength += bonusDef.flatValue;

			if (bonusDef.duration > 0) {
				bonusDef.duration -= Time.deltaTime;
				if (bonusDef.duration <= 0) {
					bonusStrength.RemoveAt(i);
					i--;
				}
			}
		}

		// Life
		for (i = 0; i < bonusLife.length;i++) {
			bonusDef = bonusLife[i];

			playerInfo.AddLife(bonusDef.flatValue);
			bonusLife.RemoveAt(i);
		}


		// END BONUSES

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

		if (cooldownAttack > 0) {
			cooldownAttack -= Time.deltaTime;
		} else if (isHitting) {
			if (cooldownAttack > 0) {

			} else {
				activeAnim = "MobKick 1";
				// ATTACK !
				cooldownAttack = 0;
				for (i = 0; i < touchedUnits.length; i++) {
					var objectToHit : GameObject = touchedUnits[i] as GameObject;
					if (!objectToHit) {
						touchedUnits.RemoveAt(i);
					} else {
						if (objectToHit.tag == "Player") {
							this.Push(objectToHit, calculatedStrength);
							activeAnim = "MobKick 1";
							Animate(activeAnim, true);
						} else if (objectToHit.tag == "Building") {
							this.AttackBuilding(objectToHit, calculatedStrength);
							activeAnim = "MobEat";
							if (cooldownAttack < eatCooldownDef)
								cooldownAttack = eatCooldownDef;
						}
					}
				}
				if (cooldownAttack == 0)
					cooldownAttack = attackCooldownDef;
				Animate(activeAnim, true);
			}
		}

	var rb : Rigidbody2D = GetComponent.<Rigidbody2D>();
	rb.angularVelocity = 0;

	// FIXME: this velocity might be set to 0 if we don't enter this conditionnal statement
	rb.velocity = Vector2 (moveX * calculatedSpeed, moveY * calculatedSpeed) + pushedVector;
	}

	if (activeAnim == "MobIdle") {
		if (moveX != 0 || moveY != 0) activeAnim = "MobWalk";
		Animate(activeAnim, false);
	}
}



function OnCollisionEnter2D(collision : Collision2D) {
	if (collision.gameObject.tag.Equals("PNJScared")) {
		collision.gameObject.GetComponent.<PNJScaredAI>().startPanicking(0.1);

		var dieingAudio : AudioClip [] = collision.gameObject.GetComponent.<PNJScaredAI>().dieingSounds;

		SoundManager.instance.PlaySfx(dieingAudio[Random.Range(0,dieingAudio.length)]);
		collision.gameObject.GetComponent.<Hittable>().Die();

		playerInfo.points += playerInfo.pointsPerNPC;
		ShouldPointsScale();

		Destroy(collision.gameObject);
	} else if (collision.gameObject.tag.Equals("Tree")) {
		collision.gameObject.GetComponent.<Hittable>().Die();
		Destroy(collision.gameObject);
	} else if (playerInfo.isRampage) {
		if (collision.gameObject.tag.Equals("Building"))
		{
			this.AttackBuilding(collision.gameObject, pushStrength);
		}
	}
}

function ShouldPointsScale () {
	var rampageScale = 0.0f;

	if (playerInfo.points >= 100)
	{
		playerInfo.points = 100;
		if (playerInfo.isRampage == false)
		{
			rampageScale = 1.5f;
			this.pushStrength *= 3;
			playerInfo.TriggerRampage();
		}
	}
	transform.localScale = Vector3(1, 1, 1) * (1 + playerInfo.points / 40f + rampageScale);
}

function DamageLevel () {
	return (playerInfo.hitDamage + 3 * Mathf.Log(playerInfo.points));
}

function Push(playerToPush:GameObject, strength:float) {

	var direction:Vector3 = (playerToPush.transform.position - this.gameObject.transform.position);
	direction.Normalize();
	direction *= strength;

	var player : PlayerController = playerToPush.GetComponent.<PlayerController>();
	player.pushedVector = direction;
	player.initialPushVector = direction;
	player.numberOfPushesLeft = player.weakness;

	//	var dmg : int = strength; // FIXME: shouldn't dmg scale with pushstrength ?
	var dmg : int = DamageLevel();
	var pointsToSteal : int = dmg / 4;
	var pointStealed : int = 0;

	if (playerInfo.isRampage)
		dmg = playerInfo.rampageDamage;
	if (!playerInfo.isRampage && player.playerInfo.isRampage)
		return ;

	if (player.playerInfo.isAlive == false) {
		playerInfo.kills++;
		playerInfo.roundKills++;

		if(player.soundDead && player.soundDead.length > 0)
			SoundManager.instance.PlaySfx(player.soundDead[Random.Range(0,player.soundDead.length)]);

		//Si on porte le coup fatal, on vole plus de points
		pointsToSteal = 1.5 * pointsToSteal;

		pointStealed = player.playerInfo.GetPoints(pointsToSteal);

		playerInfo.points += pointStealed;
	}

	else {
		//joue le son de dmg du jouer
		if(player.soundHit && player.soundHit.length > 0)
			SoundManager.instance.PlaySfx(player.soundHit[Random.Range(0,player.soundHit.length)]);

		if (!player.playerInfo.isRampage)
			pointStealed = player.playerInfo.GetPoints(pointsToSteal);

		playerInfo.points += pointStealed;
	}
	
	player.playerInfo.GetDamaged(dmg);

	ShouldPointsScale();
	player.ShouldPointsScale();
}

function AttackBuilding(buildingToHit:GameObject, strength:float) {
	if(soundEat && soundEat.length > 0)
		SoundManager.instance.PlaySfx(soundEat[Random.Range(0,soundEat.length)]);

	buildingToHit.GetComponent.<Building>().GetDamaged(strength);
}

function ApplyBonus (mode : String, bonus : BonusDefinition) {
	/*if (mode == 'speed') ApplyBonusSpeed(bonus);*/
	if (mode == 'strength') ApplyBonusStrength(bonus);
	else ApplyBonusLife(bonus);
}

function ApplyBonusSpeed(bonus:BonusDefinition) {;
	this.bonusSpeed.Add(new BonusDefinition(bonus.multiplier, bonus.flatValue, bonus.duration));
}

function ApplyBonusLife(bonus:BonusDefinition) {
	this.bonusLife.Add(new BonusDefinition(bonus.multiplier, bonus.flatValue, bonus.duration));
}

function ApplyBonusStrength(bonus:BonusDefinition) {
	this.bonusStrength.Add(new BonusDefinition(bonus.multiplier, bonus.flatValue, bonus.duration));
}
