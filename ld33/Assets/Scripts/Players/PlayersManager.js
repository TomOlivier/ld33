#pragma strict

import System.Collections.Generic;

public var characters: Character[];
public var players: Player[];
public var spawnPositions : Vector2[]; // needs to be as many as players
	
function Start () 
{
	var ui : ControllerUI = GameObject.Find("Game").GetComponent(ControllerUI);

	for (var pl in players)
	{
		ui.characterSelection.InsertPlayer(pl);
	}

	for (var pl in characters)
	{
		ui.characterSelection.InsertCharacter(pl);
	}
}

function Update () {
	// debug purpose
	if (Input.GetMouseButtonDown(0)) {
		//StartGame();
	}
}

function StartGame() {
	var spawnPositionsCopy : List.<Vector2> = new List.<Vector2>(spawnPositions);
	
	for (var pl:Player in players) {
		if (pl.isActive && pl.playerInstance == null) {
			Debug.Log("new Player");
			var randomIndex : int = Random.Range(0, spawnPositionsCopy.Count);
			var randomSpawn : Vector2 = spawnPositionsCopy[randomIndex];
			spawnPositionsCopy.RemoveAt(randomIndex);
			pl.playerInstance = Instantiate(pl.playerPrefab, Vector3(randomSpawn.x,randomSpawn.y,0), Quaternion.identity);
			pl.playerInstance.GetComponent.<PlayerController>().playerInfo = pl;
		}
	}
}

function FindSubmittingPlayerFromDevice() : Player
{
	var idc : InputDevicesController = InputDevicesController.GetInstance();
	var dev : CompatibleDevice = idc.GetCurrentlySubmittingDevice();

	for (var pl:Player in players) {
		if (pl.device != null && pl.device == dev) {
			return (pl);
		}
	}
	return null;
}

function GetPlayer(id: int) : Player
{
	return (players[id]);
}
