#pragma strict
@script RequireComponent(Rigidbody2D)

public var maxSpeed : int = 3;
public var panicSpeedBoost : int = 3;
public var panicDuration : float = 2;

private var panicTimeLeft : float = 0;
private var targetPosition : Vector3;
private var currentSpeed : float;

private var distanceDone : float = 0;
private var distanceToRun : float = 0;

function Start () {
	Debug.Log("start");
	AcquireNewTargetPosition();
	currentSpeed = maxSpeed;
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
	//Debug.Log(panicTimeLeft);
	if (panicTimeLeft > 0) {
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
	
	if (Input.GetMouseButton(0)) {
		panicTimeLeft = panicDuration;
	}
}

function AcquireNewTargetPosition() {
	targetPosition = transform.TransformPoint(Vector3(Random.Range(-10,10), Random.Range(-10,10)));
	var dir = targetPosition - transform.position;
 	var angle = Mathf.Atan2(dir.y, dir.x) * Mathf.Rad2Deg;
 	
 	transform.rotation = Quaternion.AngleAxis(angle, Vector3.forward);
 	//transform.Rotate(0,180,0);
	distanceToRun = Vector3.Distance(transform.position, targetPosition);
	Debug.Log(distanceToRun);
	distanceDone = 0;
}
