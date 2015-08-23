#pragma strict


//Gameobject representant les parties d'un building
public var bottomLeft : GameObject;
public var bottomMiddle : GameObject;
public var bottomInterMiddle: GameObject;
public var middleLeft : GameObject;
public var middleMiddle : GameObject;
public var top : GameObject;


public var prefabBuilding : GameObject;

private var boardHolder : Transform;


function Awake () {

	// boardHolder = new GameObject ("Buildings").transform;

}

function Clear() {
	if (boardHolder)
	{
		Destroy(boardHolder.gameObject);
		boardHolder = null;
	}
}

function generateBuilding(x : int, y : int, width : int, height : int) : GameObject {
	if (!boardHolder) {
		boardHolder = new GameObject ("Buildings").transform;
	}
	
	var building : GameObject;

	building = Instantiate (prefabBuilding, new Vector3 (x, y, 0f), Quaternion.identity) as GameObject;
    building.transform.SetParent (boardHolder);

    var buildingScript = building.GetComponent.<Building>();

    buildingScript.bottomLeft = bottomLeft;
	buildingScript.bottomMiddle = bottomMiddle;
	buildingScript.bottomInterMiddle = bottomInterMiddle;
	buildingScript.middleLeft = middleLeft;
	buildingScript.middleMiddle = middleMiddle;
	buildingScript.top = top;

	buildingScript.width = width;
	buildingScript.height = height;

	building.transform.position.x = x;
	building.transform.position.y = y;

	buildingScript.calculate();
    return building;
}


function Update () {

}