#pragma strict

public var roadsEnd : GameObject [];
public var roads : GameObject [];
public var roadsTurning : GameObject [];
public var roadsTri : GameObject [];
public var roadsCross : GameObject [];

public var nbBuildings : int;
public var grass : GameObject [];

public var startPosX : int;
public var startPosY : int;

public var nbCol : int;
public var nbRow : int;

public var buildingFactory : BuildingFactory;
private var boardHolder : Transform;

private var roadList : int[,];
private var tmpRotate : int;

function Start() {

}

function Generate () {

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

	cleanRoads();
	buildRoads();


	for (i = 0; i < nbBuildings; i++) {
		var evenNumber : int = Random.Range(0,6)/2 +1;

		buildingFactory.generateBuilding(Random.Range(startPosX, nbCol + startPosX), Random.Range(startPosY, nbRow + startPosY), evenNumber, Random.Range(2,5));
	};

}

function getTileRoad(x : int, y : int) : GameObject{

	var resRef : GameObject [];


	var xShift : int = x - startPosX;
	var yShift : int = y - startPosY;

	var count : int = countRoad(x,y);

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
	else if (count == 1){
		resRef = roadsEnd;
		if(roadList[xShift, yShift - 1]){
			tmpRotate = 0;
		}
		else if(roadList[xShift , yShift +1]){
			tmpRotate = 180;
		}
		else if(roadList[xShift +1, yShift])
		{
			tmpRotate = 90;
		}
		else{
			tmpRotate = 270;
		}
	}
	else {
		//on remove la road
		return null;
	}
	//si on est à un tournan simple, on utilise un tournan


	return resRef[Random.Range(0,resRef.Length)];
}

function pushTileRoad(x: float, y: float){

	var toInstantiate : GameObject;
	var instance : GameObject;

	tmpRotate = 0;
	toInstantiate = getTileRoad(x,y);

	if(toInstantiate == null)
		return;



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


function countRoad(rawX : int, rawY: int){

	var xShift : int = rawX - startPosX;
	var yShift : int = rawY - startPosY;

	var count : int = 0;

	if(xShift == 0 || yShift == 0 || xShift >= nbCol -1 || yShift >= nbRow -1)
		return 0;

	if(roadList[xShift - 1, yShift] > 0)
		count++;
	if(roadList[xShift + 1, yShift] > 0)
		count++;
	if(roadList[xShift, yShift - 1] > 0)
		count++;
	if(roadList[xShift, yShift + 1] > 0)
		count++;

	return count;

}


function cleanRoads() {
	var i : int;
	var j : int;

	for ( i = startPosX; i < nbCol + startPosX; i++) {
		for (j = startPosY; j < nbRow + startPosY; j++){
			
			if(countRoad(i,j) == 4)
			{

				if(countRoad(i+1 ,j) == 4 || countRoad(i-1 ,j) == 4 ||
					countRoad(i ,j+1) == 4 ||	countRoad(i ,j-1) == 4)
					roadList[i - startPosX, j- startPosY] = 0;
				
			}
		}
	}


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