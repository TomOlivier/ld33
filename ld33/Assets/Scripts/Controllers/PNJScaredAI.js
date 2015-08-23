#pragma strict
//@script RequireComponent(Rigidbody2D)

import Physics2D;

public var maxSpeed : int = 3;
public var panicSpeedBoost : int = 3;
public var panicDuration : float = 1.5;
public var timeBeforeChangeDecision : float = 2;
public var pnjRenderers : Renderer[];

private var localTargetPosition : Vector3;
private var targetPosition : Vector3;
private var currentSpeed : float;

private var distanceDone : float = 0;
private var distanceToRun : float = 0;

private var wantsToEnterBuilding : boolean = false;
private var decisionTimer : float = 0;

private var panicTimeLeft : float = 0;
private var delayBeforePanic : float = 0;

private var isPanicking : boolean = false;

public var dieingSounds : AudioClip [];


function Start () {
	// Debug.Log("start");
	currentSpeed = maxSpeed;
	AcquireNewTargetPosition();

	decisionTimer = timeBeforeChangeDecision;
}

function Update () {

	
	/*var randomVector : Vector2 = Vector2(Random.Range(-maxSpeed, maxSpeed), Random.Range(-maxSpeed, maxSpeed));
	randomVector.Normalize();
	rb.velocity = randomVector;
	*/
	//transform.position += direction * speed * Time.deltaTime;
	//rb.velocity = randomVector;
	//currentSpeed += Time.deltaTime * Random.Range(-speedVariability, speedVariability);
	
	CalculatePanic();
	
	//transform.localPosition.y += (Mathf.PingPong(-1, 1));
	//distanceDone += calculatedSpeed * Time.deltaTime;
	//transform.Translate(Vector3.forward * Time.deltaTime * (currentSpeed + (isPanicking ? panicSpeedBoost : 0)));
	//transform.localPosition += transform.up * Time.deltaTime * (currentSpeed + (isPanicking ? panicSpeedBoost : 0));
	if (Vector2.Distance(transform.position,targetPosition) <= 0.2) {
		AcquireNewTargetPosition();
	}
	
	
	//decisionTimer += Time.deltaTime;
}

function CalculatePanic() {
	if (delayBeforePanic > 0) {
		delayBeforePanic -= Time.deltaTime;
	}
	if (IsPanicking()) {
		panicTimeLeft -= Time.deltaTime;
		if (!isPanicking) {
			this.GetComponent.<Rigidbody2D>().velocity = (targetPosition - transform.position).normalized * (currentSpeed + panicSpeedBoost);
			isPanicking = true;
			for (var r : Renderer in pnjRenderers)
				r.material.color = Color.red;
				//Debug.Log("I know I panic");
		}
	} else if (isPanicking) {
		this.GetComponent.<Rigidbody2D>().velocity = (targetPosition - transform.position).normalized * currentSpeed;
		isPanicking = false;
		for (var r : Renderer in pnjRenderers)
			r.material.color = Color.white;
	}
}

function startPanicking(delayPanic:float) {
	Debug.Log("start Panicking");
	Debug.Log("relayPanic: " + delayPanic);
  	delayBeforePanic = delayPanic;
	panicTimeLeft = panicDuration;
  	var results : Collider2D[] = Physics2D.OverlapCircleAll(Vector2(this.transform.position.x, this.transform.position.y), 10);
 	// FIXME: layer collision shouldn't be hardcoded (line before)
	for (var rc : Collider2D in results) {
		if (rc.gameObject.tag == "PNJScared") {
			var realDistance : float = Vector3.Distance(rc.gameObject.transform.position, this.gameObject.transform.position);
//			Debug.Log(realDistance);
			var pnjScared : PNJScaredAI = rc.gameObject.GetComponent.<PNJScaredAI>();
			if (!pnjScared.IsPanicking()) {
				pnjScared.delayBeforePanic = delayPanic * realDistance;
			}
			
			rc.gameObject.GetComponent.<PNJScaredAI>().panicTimeLeft = panicDuration;
		}
	}
}

function IsPanicking() {
	return (panicTimeLeft > 0 && delayBeforePanic <= 0);
}

function AcquireNewTargetPosition() {
	setNewTargetLocalPosition(Vector3(Random.Range(-10,10), Random.Range(-10,10)));
}

function setNewTargetLocalPosition(localPTarget:Vector3) {
	localTargetPosition = localPTarget;
	targetPosition = transform.TransformPoint(localTargetPosition);
	this.GetComponent.<Rigidbody2D>().velocity = (targetPosition - transform.position).normalized * (currentSpeed + (isPanicking ? panicSpeedBoost : 0));
	
	var dir = targetPosition - transform.position;
 	var angle = Mathf.Atan2(dir.y, dir.x) * Mathf.Rad2Deg;
 	
 	transform.rotation = Quaternion.AngleAxis(angle, Vector3.forward);
	distanceToRun = Vector3.Distance(transform.position, targetPosition);
	distanceDone = 0;
	//var direction : Vector3 = (targetPosition - transform.position).normalized;
	//var rot_z:float = Mathf.Atan2(direction.x, direction.y) * Mathf.Rad2Deg;
	//transform.rotation = Quaternion.Euler(transform.rotation.x, transform.rotation.y, rot_z - 90f);
}

function OnTriggerEnter2D(collider : Collider2D) {
	if (collider.gameObject.tag.Equals("Building") || collider.gameObject.tag.Equals("Border")) {
		//print("PNJ: OnTriggerEnter2D building");
		if (decisionTimer >= timeBeforeChangeDecision) {
			if (this.IsPanicking()) { // not a lot of chance to reevaluate route when seeing a building
				AcquireNewTargetPosition();// TODO: straight to building
			} else {
				setNewTargetLocalPosition(-localTargetPosition);
			}
			//decisionTimer = 0;
		}
	}
}

function OnCollisionEnter2D(collision : Collision2D) {
	if (collision.gameObject.tag.Equals("Building")) {
		// TODO: add this guy to the building
		//print("PNJ: collision to building");
		Destroy(this.gameObject);
	} else {
		setNewTargetLocalPosition(-localTargetPosition);
	}
}
