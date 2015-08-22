#pragma strict

public var roads : GameObject [];
public var roadsTurning : GameObject [];
public var roadsTri : GameObject [];
public var roadsCross : GameObject [];

public var buildings : GameObject [];
public var grass : GameObject [];

public var startPosX : int;
public var startPosY : int;

public var nbCol : int;
public var nbRow : int;


private var boardHolder : Transform;

private var roadList : int[,];

function Start () {

	var toInstantiate : GameObject;
	var instance : GameObject;
	var i : int;
	var j : int;

	roadList = new int [nbCol, nbRow];
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

		pushTileRoad(i, -1f, 1);
		pushTileRoad(i, 1f, 1);

	}

	for (j = startPosY; j < nbRow + startPosY; j++) {
		toInstantiate = roads[Random.Range (0,roads.Length)];

		pushTileRoad(-1f, j, 0);
		pushTileRoad(1f, j, 0);
	}

}

function getTileRoad(x : int, y : int) : GameObject{

	var resRef : GameObject [];

	var xShift : int = x - startPosX;
	var yShift : int = y - startPosY;

	if(xShift == 0 || yShift == 0 || xShift >= nbCol -1 || yShift >= nbRow -1)
		return roads[Random.Range(0,roads.Length)];

	var count : int = 0;

	//si on est à un carrefour, on utilise une tuile de carrefour

	Debug.Log("coords : " +xShift);

	if(roadList[xShift - 1, yShift])
		count++;
	if(roadList[xShift + 1, yShift])
		count++;
	if(roadList[xShift, yShift - 1])
		count++;
	if(roadList[xShift, yShift + 1])
		count++;

	if(count > 2)
		resRef = roadsCross;
	else if (count > 1)
		resRef = roadsTri;
	else if(count == 1){
		//on regarde si on est en tournant ou ligne droite
		if((roadList[xShift - 1, yShift] && roadList[xShift + 1, yShift])
			|| (roadList[xShift, yShift - 1] && roadList[xShift, yShift + 1])){
			resRef = roads;
		}
		else{
			resRef = roadsTurning;
		}
	}
	else
		resRef = roads;
	//si on est à un tournan simple, on utilise un tournan


	return resRef[Random.Range(0,resRef.Length)];
}

function pushTileRoad(x: float, y: float, shouldRotate : int){

	var toInstantiate : GameObject;
	var instance : GameObject;

	toInstantiate = getTileRoad(x,y);

	instance = Instantiate (toInstantiate, new Vector3 (x, y, 0f), Quaternion.identity) as GameObject;
	instance.transform.localScale = new Vector3 (0.8f, 1f, 1f);
    instance.transform.SetParent (boardHolder);

    if(shouldRotate > 0)
    {
    	instance.transform.Rotate(new Vector3(0, 0, 90));
    }

    // Debug.Log("x : " + (x-startPosX) + ", y : " + (y-startPosY));
    roadList[x -startPosX, y -startPosY] = 1;
}


function Update () {

}