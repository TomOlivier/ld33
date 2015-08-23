#pragma strict
@script RequireComponent(Rigidbody2D)

import Physics2D;

public var maxSpeed : int = 3;
public var panicSpeedBoost : int = 3;
public var panicDuration : float = 2;
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


function Start () {
	// Debug.Log("start");
	AcquireNewTargetPosition();
	currentSpeed = maxSpeed;
	decisionTimer = timeBeforeChangeDecision;
}

function Update () {

	var rb : Rigidbody2D = GetComponent.<Rigidbody2D>();
	
	/*var randomVector : Vector2 = Vector2(Random.Range(-maxSpeed, maxSpeed), Random.Range(-maxSpeed, maxSpeed));
	randomVector.Normalize();
	rb.velocity = randomVector;
	*/
	//var direction : Vector3 = (targetPosition - transform.position).Normalize();
	//transform.position += direction * speed * Time.deltaTime;
	//rb.velocity = randomVector;
	//currentSpeed += Time.deltaTime * Random.Range(-speedVariability, speedVariability);
	currentSpeed = Mathf.Clamp(currentSpeed, 0, maxSpeed);
	
	var calculatedSpeed = currentSpeed;
	
	CalculatePanic();
	//Debug.Log(panicTimeLeft);
	if (this.IsPanicking()) {
		calculatedSpeed += panicSpeedBoost;
	}
	
	transform.position += (targetPosition - transform.position).normalized * Time.deltaTime * calculatedSpeed;
	//transform.localPosition.y += (Mathf.PingPong(-1, 1));
	//distanceDone += calculatedSpeed * Time.deltaTime;
	//transform.Translate(Vector3.forward * Time.deltaTime * calculatedSpeed);
	//transform.localPosition += transform.forward * Time.deltaTime * calculatedSpeed;
	if (Vector2.Distance(transform.position,targetPosition) <= calculatedSpeed) {
		AcquireNewTargetPosition();
		//targetPosition = Vector3(Random.Range(0,10), Random.Range(0,10));
	}
	
	//if (Input.GetMouseButton(0)) {
	//	panicTimeLeft = panicDuration;
	//}
	decisionTimer += Time.deltaTime;
}

function CalculatePanic() {
	if (delayBeforePanic > 0) {
		delayBeforePanic -= Time.deltaTime;
	}
	if (IsPanicking()) {
		panicTimeLeft -= Time.deltaTime;
	}
	if (!isPanicking && IsPanicking()) {
		isPanicking = true;
		for (var r : Renderer in pnjRenderers)
			r.material.color = Color.red;
		//Debug.Log("I know I panic");
	} else if (isPanicking && !IsPanicking()) {
		//Debug.Log("I know I don't panic");
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
  	var results : RaycastHit2D[] = Physics2D.CircleCastAll(Vector2(this.transform.position.x, this.transform.position.y), 10, Vector2(0,0), 0); 
 	// FIXME: layer collision shouldn't be hardcoded (line before)
	for (var rc : RaycastHit2D in results) {
		if (rc.collider.gameObject.tag == "PNJScared") {
			var realDistance : float = Vector3.Distance(rc.collider.gameObject.transform.position, this.gameObject.transform.position);
			Debug.Log(realDistance);
			var pnjScared : PNJScaredAI = rc.collider.gameObject.GetComponent.<PNJScaredAI>();
			if (!pnjScared.IsPanicking()) {
				rc.collider.gameObject.GetComponent.<PNJScaredAI>().delayBeforePanic = delayPanic * realDistance;
			}
			
			rc.collider.gameObject.GetComponent.<PNJScaredAI>().panicTimeLeft = 3;
		}
	}
}

function IsPanicking() {
	return (panicTimeLeft > 0 && delayBeforePanic <= 0);
}

function AcquireNewTargetPosition() {
	localTargetPosition = Vector3(Random.Range(-10,10), Random.Range(-10,10));
	targetPosition = transform.TransformPoint(localTargetPosition);
	var dir = targetPosition - transform.position;
 	var angle = Mathf.Atan2(dir.y, dir.x) * Mathf.Rad2Deg;
 	
 	transform.rotation = Quaternion.AngleAxis(angle, Vector3.forward);
 	//transform.Rotate(0,180,0);
	distanceToRun = Vector3.Distance(transform.position, targetPosition);
	distanceDone = 0;
}

function OnTriggerEnter2D(collider : Collider2D) {
	if (collider.gameObject.tag.Equals("Building") || collider.gameObject.tag.Equals("Border")) {
		//print("PNJ: OnTriggerEnter2D building");
		if (decisionTimer >= timeBeforeChangeDecision) {
			if (this.IsPanicking() || Random.value > 0.9) { // not a lot of chance to reevaluate route when seeing a building
				AcquireNewTargetPosition();// TODO: straight to building
			} else {
				localTargetPosition = -localTargetPosition;
				targetPosition = transform.TransformPoint(localTargetPosition);
				//targetPosition = -targetPosition; // !TODO: go other way
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
	}
}
