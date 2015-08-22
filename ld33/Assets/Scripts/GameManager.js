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

	var toInstantiate : GameObject;
	var instance : GameObject;
	var i : int;
	var j : int;
	boardHolder = new GameObject ("Board").transform;

	for ( i = startPosX; i < nbCol + startPosX; i++) {
		for (j = startPosY; j < nbRow + startPosY; j++){
			toInstantiate = grass[Random.Range (0,grass.Length)];
			instance = Instantiate (toInstantiate, new Vector3 (i , j, 0f), Quaternion.identity) as GameObject;
			instance.transform.Rotate(new Vector3(0, 0, Random.Range(0,4) * 90));
            instance.transform.SetParent (boardHolder);
		}
	}

	//Road initialization

	for (i = startPosX; i < nbCol + startPosX; i++) {
		toInstantiate = roads[Random.Range (0,roads.Length)];

		instance = Instantiate (toInstantiate, new Vector3 (i, -1f, 0f), Quaternion.identity) as GameObject;
		instance.transform.localScale = new Vector3 (0.8f, 1f, 1f);
		instance.transform.Rotate(new Vector3(0, 0, 90));
        instance.transform.SetParent (boardHolder);

        instance = Instantiate (toInstantiate, new Vector3 (i, 1f, 0f), Quaternion.identity) as GameObject;
		instance.transform.localScale = new Vector3 (0.8f, 1f, 1f);
		instance.transform.Rotate(new Vector3(0, 0, 90));
        instance.transform.SetParent (boardHolder); 
	}

	for (j = startPosY; j < nbRow + startPosY; j++) {
		toInstantiate = roads[Random.Range (0,roads.Length)];

		instance = Instantiate (toInstantiate, new Vector3 (1f, j, 0f), Quaternion.identity) as GameObject;
		instance.transform.localScale = new Vector3 (0.8f, 1f, 1f);
        instance.transform.SetParent (boardHolder);

        instance = Instantiate (toInstantiate, new Vector3 (-1f, j, 0f), Quaternion.identity) as GameObject;
		instance.transform.localScale = new Vector3 (0.8f, 1f, 1f);
        instance.transform.SetParent (boardHolder);
	}



}

function Update () {

}