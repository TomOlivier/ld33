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
private var tmpRotate : int;

function Start () {

	var toInstantiate : GameObject;
	var instance : GameObject;
	var i : int;
	var j : int;

	roadList = new int [nbCol, nbRow];
	//Init road list avec random
	for ( i = startPosX; i < nbCol + startPosX; i++) {
		for (j = startPosY; j < nbRow + startPosY; j++){
			if(Random.Range(0,5) > 2)
				roadList[i - startPosX,j -startPosY] = 1;
		}
	}


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
		// pushTileRoad(i, -1f, 1);
		// pushTileRoad(i, 1f, 1);
		roadList[i - startPosX, -1 - startPosY] = 1;
		roadList[i - startPosX, 1 - startPosY] = 1;
	}

	for (j = startPosY; j < nbRow + startPosY; j++) {
		roadList[1 - startPosX, j - startPosY] = 1;
		roadList[-1 - startPosX, j - startPosY] = 1;
	}

	buildRoads();

}

function getTileRoad(x : int, y : int) : GameObject{

	var resRef : GameObject [];

	var xShift : int = x - startPosX;
	var yShift : int = y - startPosY;

	if(xShift == 0 || yShift == 0 || xShift >= nbCol -1 || yShift >= nbRow -1)
		return roads[Random.Range(0,roads.Length)];

	var count : int = 0;



	if(roadList[xShift - 1, yShift] > 0)
		count++;
	if(roadList[xShift + 1, yShift] > 0)
		count++;
	if(roadList[xShift, yShift - 1] > 0)
		count++;
	if(roadList[xShift, yShift + 1] > 0)
		count++;

	// Debug.Log("--------------");
	// Debug.Log("coords : " +xShift + ", " + yShift);
	// Debug.Log(" - count : " + count);

	//si on est à un carrefour, on utilise une tuile de carrefour
	if(count > 3){
		resRef = roadsCross;
	}
	else if (count > 2){
		resRef = roadsTri;
		//on regarde quels sont les 3 en question, et on rotate en fonction
		if(roadList[xShift - 1, yShift]){
			if(roadList[xShift + 1, yShift]){
				if(roadList[xShift, yShift +1])
					tmpRotate = 180;
				else
					tmpRotate = 0;
			}
			else
			{
				tmpRotate = 270;
			}
		}
		else {
			tmpRotate = 90;
		}
	}
	else if(count == 2){
		//on regarde si on est en tournant ou ligne droite
		if (roadList[xShift - 1, yShift] && roadList[xShift + 1, yShift]){
			resRef = roads;
			tmpRotate = 90;
		}
		else if (roadList[xShift, yShift - 1] && roadList[xShift, yShift + 1]){
			resRef = roads;
		}
		else {
			//sinon on est en mode on tourne
			resRef = roadsTurning;

			if(roadList[xShift, yShift - 1] && roadList[xShift +1 , yShift]){
				tmpRotate = 0;
			}
			else if (roadList[xShift, yShift - 1] && roadList[xShift -1 , yShift]){
				tmpRotate = 270;
			}
			else if (roadList[xShift, yShift + 1] && roadList[xShift -1 , yShift]){
				tmpRotate = 180;
			}
			else
			{
				tmpRotate = 90;
			}

		}
	}
	else
		resRef = roads;
	//si on est à un tournan simple, on utilise un tournan


	return resRef[Random.Range(0,resRef.Length)];
}

function pushTileRoad(x: float, y: float){

	var toInstantiate : GameObject;
	var instance : GameObject;

	tmpRotate = 0;
	toInstantiate = getTileRoad(x,y);



	instance = Instantiate (toInstantiate, new Vector3 (x, y, 0f), Quaternion.identity) as GameObject;
	instance.transform.localScale = new Vector3 (1f, 1f, 1f);
    instance.transform.SetParent (boardHolder);

    if(tmpRotate != 0)
    {
    	instance.transform.Rotate(new Vector3(0, 0, tmpRotate));
    }

    // Debug.Log("x : " + (x-startPosX) + ", y : " + (y-startPosY));
    // roadList[x -startPosX, y -startPosY] = 1;
}



function buildRoads() {

	var i : int;
	var j : int;

	var str : String;

	for ( i = startPosX; i < nbCol + startPosX; i++) {
		for (j = startPosY; j < nbRow + startPosY; j++){
			str += roadList[i - startPosX,j -startPosY] + ",";
		}
		Debug.Log(str);
		str = "";
	}

	for ( i = startPosX; i < nbCol + startPosX; i++) {
		for (j = startPosY; j < nbRow + startPosY; j++){
			if(roadList[i - startPosX,j -startPosY] > 0)
				pushTileRoad(i,j);
		}
	}


}


function Update () {

}