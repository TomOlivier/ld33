#pragma strict

public var hitPrefab: GameObject;
public var deadPrefab: GameObject;

function Start () {

}

function Update () {

}

function GetHit(damage:int) {
	Debug.Log("get hit");
	Instantiate(hitPrefab, transform.position, Quaternion.identity);
	//GetComponent.<ParticleSystem>().Play();
}

function Die() {
	Instantiate(deadPrefab, transform.position, Quaternion.identity);
	Destroy(gameObject);
}