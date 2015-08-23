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

function Start () {
}

function Update () {
	var inputDevicesController : InputDevicesController = InputDevicesController.GetInstance();
	
	var moveX : float = inputDevicesController.GetAxisForDevice("Horizontal", playerInfo.device);
	var moveY : float = -inputDevicesController.GetAxisForDevice("Vertical", playerInfo.device);
	var rb : Rigidbody2D = GetComponent.<Rigidbody2D>();
	if (numberOfPushesLeft >= 0) {
		if (numberOfPushesLeft == 0) {
			pushedVector = Vector2(0,0);
			initialPushVector = Vector2(0,0);
		} else {
			pushedVector -= initialPushVector / weakness;
		}
		numberOfPushesLeft--;
	}
	//Debug.Log(rb.velocity);
	rb.velocity = Vector2 (moveX * speed, moveY * speed) + pushedVector;

	if ((moveX != 0 || moveY != 0) && true) { // TODO: check if there's no pause / gui display
		var rot_z:float = Mathf.Atan2(moveX, -moveY) * Mathf.Rad2Deg; // - moveY because we did shit with cameras
    	transform.rotation = Quaternion.Euler(transform.rotation.x, transform.rotation.y, rot_z - 90f);
	}
	rb.angularVelocity = 0;
	
	var isHitting : boolean = Input.GetMouseButtonDown (0);
	cooldownAttack -= Time.deltaTime;
	if (cooldownAttack > 0) {
		cooldownAttack -= Time.deltaTime;
	} else if (isHitting) {
		if (cooldownAttack > 0) {
			cooldownAttack -= Time.deltaTime;
			Debug.Log("can't attack !");
		} else { 
			// ATTACK !
			for (var i = 0; i < touchedUnits.length; i++) {
				var objectToHit : GameObject = touchedUnits[i] as GameObject;
				if (!objectToHit) {
					touchedUnits.RemoveAt(i);
				} else {
					if (objectToHit.tag == "Player") {
						this.Push(objectToHit);
					} else if (objectToHit.tag == "Building") {
						this.AttackBuilding(objectToHit);
					}
				}
			}
			cooldownAttack = attackCooldownDef;
		}
	}
}

function OnTriggerEnter2D(collider : Collider2D) {
	if (!collider.gameObject.tag.Equals("Building") && !collider.gameObject.tag.Equals("Player")) {
		return;
	}
	if (ArrayUtility.Contains(touchedUnits.ToBuiltin(GameObject), collider.gameObject)) {
		return;
	}
	touchedUnits.Add(collider.gameObject);
	//Debug.Log("canHit: " + collider.gameObject.tag);
	//Debug.Log("touchedUnits: " + touchedUnits);
}
function OnTriggerExit2D(collider : Collider2D) {
	if (!collider.gameObject.tag.Equals("Building") && !collider.gameObject.tag.Equals("Player")) {
		return;
	}
	//Debug.Log("cantHit: " + collider.gameObject.tag);
	for (var i = 0; i < touchedUnits.Count; i++) {
		if (touchedUnits[i] == collider.gameObject) {
			//Debug.Log("removed 1 at index: " + i);
			touchedUnits.RemoveAt(i);
			break;
		}
	}
	//Debug.Log(this.gameObject + "touchedUnits : " + touchedUnits);
}

function OnCollisionEnter2D(collision : Collision2D) {
	if (collision.gameObject.tag.Equals("PNJScared")) {
		collision.gameObject.GetComponent.<PNJScaredAI>().startPanicking(0);
		collision.gameObject.GetComponent.<Hittable>().Die();
		Destroy(collision.gameObject);
	} else if (collision.gameObject.tag.Equals("Tree")) {
		collision.gameObject.GetComponent.<Hittable>().Die();
		Destroy(collision.gameObject);
	}
}


function Push(playerToPush:GameObject) {
	
	var direction:Vector3 = (playerToPush.transform.position - this.gameObject.transform.position);
	direction.Normalize();
	direction *= pushStrength;

	var player : PlayerController = playerToPush.GetComponent.<PlayerController>();
	player.pushedVector = direction;
	player.initialPushVector = direction;
	player.numberOfPushesLeft = player.weakness;
	player.playerInfo.GetDamaged(25);
}

function AttackBuilding(buildingToHit:GameObject) {
	buildingToHit.GetComponent.<Building>().GetDamaged(this.pushStrength);
}