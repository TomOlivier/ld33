#pragma strict
@script RequireComponent(Rigidbody2D)

public var points : int = 0;
public var life : int = 10;
public var speed : float = 5;
public var spriteRenderer : SpriteRenderer = null;
public var pushStrength : float = 25;
public var weakness : float = 20; // the higher, the more it will the pushed

private var pushedVector : Vector2;
private var numberOfPushesLeft : int = 0; // number of time the push has to be applied
private var initialPushVector : Vector2;


private var touchedUnits : Array = Array();

function Start () {

}

function Update () {
	var moveX : float = Input.GetAxis ("Horizontal");
	var moveY : float = -Input.GetAxis ("Vertical");
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

		var rot_z:float = Mathf.Atan2(moveY, moveX) * Mathf.Rad2Deg;
         transform.rotation = Quaternion.Euler(0f, 0f, rot_z - 90f);
	
	var isHitting : boolean = Input.GetMouseButtonDown (0);
	if (isHitting) {
		for (var i = 0; i < touchedUnits.Count; i++) {
			var objectToHit : GameObject = touchedUnits[i];
			
			this.Push(objectToHit);
		}
		/*if (hitCollider.gameObject != this.gameObject)
			var direction:Vector3 = (this.gameObject.transform.position - hitColliders[i].gameObject.transform.position);
			direction.Normalize();
			direction *= pushStrength;
			Debug.Log(hitColliders[i]);
			this.Push(hitColliders[i].gameObject);
		}*/
	}
}

function OnTriggerEnter2D(collider : Collider2D) {
	if (collider.isTrigger) {
		return;
	}
	touchedUnits.Push(collider.gameObject);
	Debug.Log(this.gameObject + " canHit : " + touchedUnits);
}
function OnTriggerExit2D(collider : Collider2D) {
	Debug.Log("canHit");
	for (var i = 0; i < touchedUnits.Count; i++) {
		if (touchedUnits[i] == collider.gameObject) {
			touchedUnits.RemoveAt(i);
			break;
		}
	}
	Debug.Log(this.gameObject + " canHit : " + touchedUnits);
}


function Push(playerToPush:GameObject) {
	var direction:Vector3 = (playerToPush.transform.position - this.gameObject.transform.position);
	direction.Normalize();
	direction *= pushStrength;

	var player : PlayerController = playerToPush.GetComponent.<PlayerController>();
	player.pushedVector = direction;
	player.initialPushVector = direction;
	player.numberOfPushesLeft = player.weakness;
}