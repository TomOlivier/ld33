#pragma strict

public var roads : GameObject [];
public var turningRoads : GameObject [];

public var buildings : GameObject [];
public var grass : GameObject [];

public var startPosX : int;
public var startPosY : int;

public var nbCol : int;
public var nbRow : int;


private var boardHolder : Transform;

function Start () {


	boardHolder = new GameObject ("Board").transform;

	for (var i : int = 0; i < nbCol; i++) {
		for (var j : int = 0; j < nbRow; j++){
			var toInstantiate : GameObject = grass[Random.Range (0,grass.Length)];
			var instance : GameObject = Instantiate (toInstantiate, new Vector3 (i + startPosX, j + startPosY, 0f), Quaternion.identity) as GameObject;
            instance.transform.SetParent (boardHolder);
		}
	}



}

function Update () {

}