#pragma strict
@script RequireComponent(Rigidbody2D, Fading)

import Physics2D;

public var maxSpeed : int = 3;
public var panicSpeedBoost : int = 3;
public var panicDuration : float = 2;
public var timeBeforeChangeDecision : float = 2;

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
		panicTimeLeft -= Time.deltaTime;
		
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
		this.gameObject.GetComponent.<Fading>().fadeAgainNow(Color.red);
	} else if (isPanicking && !IsPanicking()) {
		isPanicking = false;
		this.gameObject.GetComponent.<Fading>().fadeAgainNow(Color.white);
	}
}

function startPanicking(delayPanic:float) {
	Debug.Log("start Panicking");
	if (IsPanicking() || delayBeforePanic > 0) {
		delayBeforePanic = 0;
		panicTimeLeft = panicDuration;
		return;
	}
  	delayBeforePanic = delayPanic;
	panicTimeLeft = panicDuration;
  	var results : RaycastHit2D[] = Physics2D.CircleCastAll(Vector2(this.transform.position.x, this.transform.position.y), 3, Vector2(0,0), 0); 
 	// FIXME: layer collision shouldn't be hardcoded (line before)
	for (var rc : RaycastHit2D in results) {
		if (rc.collider.gameObject.tag == "PNJScared")
			rc.collider.gameObject.GetComponent.<PNJScaredAI>().startPanicking(1 + delayPanic);
	}
}

function IsPanicking() {
	return (panicTimeLeft > 0 && delayBeforePanic <= 0);
}

function AcquireNewTargetPosition() {
	targetPosition = transform.TransformPoint(Vector3(Random.Range(-10,10), Random.Range(-10,10)));
	var dir = targetPosition - transform.position;
 	var angle = Mathf.Atan2(dir.y, dir.x) * Mathf.Rad2Deg;
 	
 	transform.rotation = Quaternion.AngleAxis(angle, Vector3.forward);
 	//transform.Rotate(0,180,0);
	distanceToRun = Vector3.Distance(transform.position, targetPosition);
	distanceDone = 0;
}

function OnTriggerEnter2D(collider : Collider2D) {
	if (collider.gameObject.tag.Equals("Building")) {
		//print("PNJ: OnTriggerEnter2D building");
		if (decisionTimer >= timeBeforeChangeDecision) {
			if (this.IsPanicking() || Random.value > 0.9) { // not a lot of chance to reevaluate route when seeing a building
				AcquireNewTargetPosition();// TODO: straight to building
			} else {
				AcquireNewTargetPosition(); // !TODO: go other way
			}
			//decisionTimer = 0;
		}
	}
}

function OnCollisionEnter2D(collision : Collision2D) {
	if (collision.gameObject.tag.Equals("Building")) {
		// TODO: add this guy to the building
		//print("PNJ: collision to building");
		//Destroy(this.gameObject);
	}
}
