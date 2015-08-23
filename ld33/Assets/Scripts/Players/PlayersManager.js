#pragma strict

import System.Collections.Generic;

public var characters: Character[];
public var players: Player[];
public var spawnPositions : Vector2[]; // needs to be as many as players
public var leaderboard: List.<Player>;
public var gameLeaderboard: List.<Player>;

function Start () 
{
	var ui : ControllerUI = GameObject.Find("Game").GetComponent(ControllerUI);

	for (var pl in players)
	{
		pl.character = null;
		ui.characterSelection.InsertPlayer(pl);
	}

	for (var pl in characters)
	{
		ui.characterSelection.InsertCharacter(pl);
	}
}

function ResetAll(hard: boolean) {
	for (var pl in players)
	{
		if (hard)
			pl.FullReset();
		else
			pl.GameReset();
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
	
	CreateGameLeaderboard();
	for (var pl:Player in players) {
		if (pl.isActive && pl.playerInstance == null) {
			pl.GameReset();	
			Debug.Log("new Player");
			var randomIndex : int = Random.Range(0, spawnPositionsCopy.Count);
			var randomSpawn : Vector2 = spawnPositionsCopy[randomIndex];
			spawnPositionsCopy.RemoveAt(randomIndex);
			pl.playerInstance = Instantiate(pl.playerPrefab, Vector3(randomSpawn.x,randomSpawn.y,0), Quaternion.identity);
			pl.playerInstance.GetComponent.<PlayerController>().playerInfo = pl;
		}
	}
}

function EndGame() 
{	
	ApplyScoring();
	CreateLeaderboard();
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

function ApplyScoring()
{
	var scoreInt : int = 4;
	var prevPlayer : Player;

	for (var i = 0; i < players.length; i++)
	{
		gameLeaderboard[i].score += Mathf.Floor(scoreInt);
		scoreInt /= 2;
	}
}

function CreateGameLeaderboard()
{
	gameLeaderboard.Clear();
	for (var i = 0; i < players.length; i++)
	{
		gameLeaderboard.Add(players[i]);
	}
}

function CreateLeaderboard()
{
	var cnt : float = 0.0f;

	leaderboard.Clear();
	while (cnt < players.length)
	{
		var selectedPl : Player = null;
		
		for (var i = cnt; i < players.length; i++)
		{
			var activePl = players[i];

			if (selectedPl == null)
				selectedPl = activePl;
			else if (selectedPl.score < activePl.score && selectedPl.isActive)
				selectedPl = activePl;
		}
		
		if (selectedPl)
		{
			selectedPl.rank = cnt + 1;
			leaderboard.Add(selectedPl);
		}
		cnt++;
	}
}