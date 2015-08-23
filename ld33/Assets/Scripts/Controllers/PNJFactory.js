#pragma strict

public var prefabPNJScared : GameObject [];

private var holder : Transform;


function Awake () {

	//holder = new GameObject ("PNJs").transform;
}

function Clear() {
	if (holder)
	{
		Destroy(holder.gameObject);
		holder = null;
	}
}

function generatePNJScared(x : float, y : float) : GameObject {
	if (!holder) {
		holder = new GameObject ("PNJs").transform;
	}

	var pnjScared : GameObject;

	pnjScared = Instantiate (getRandomPNJ(), new Vector3 (x, y, 0f), Quaternion.identity) as GameObject;

	pnjScared.transform.SetParent(holder);

    return pnjScared;
}

function getRandomPNJ () {
	var r : int = Random.Range(0, prefabPNJScared.length);
	return prefabPNJScared[r];
}