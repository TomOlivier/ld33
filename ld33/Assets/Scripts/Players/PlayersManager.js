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

function GetRandomCharacter() : Character {
	return characters[Random.Range(0, characters.length)];
}

function AreAllPlayersReady() : boolean {
	Debug.Log("All ready ?");
	for (var pl in players)
	{
		if (pl.isActive)
		{
			if (pl.character == null)
				return (false);
			if (!pl.isIA && pl.device == null)
				return (false);
		}
	}
	Debug.Log("Yes they are");
	return (true);	
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
		if (pl.playerInstance)
		{
			Destroy(pl.playerInstance);
			pl.playerInstance = null;
		}
		if (pl.isActive && pl.playerInstance == null) {
			pl.GameReset();	
			Debug.Log("new Player");
			var randomIndex : int = Random.Range(0, spawnPositionsCopy.Count);
			var randomSpawn : Vector2 = spawnPositionsCopy[randomIndex];
			spawnPositionsCopy.RemoveAt(randomIndex);
			pl.playerInstance = Instantiate(pl.character.prefab, Vector3(randomSpawn.x,randomSpawn.y,0), Quaternion.identity);
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
	var cnt : int = 0;
	var topScore : int = 0;

	leaderboard.Clear();
	for (var it = 0; it < players.length; it++)
	{
		players[it].rank = -1;
	}	
	while (cnt < players.length)
	{
		var selectedPl : Player = null;
		
		for (var i = 0; i < players.length; i++)
		{
			var activePl = players[i];

			if (selectedPl == null && activePl.rank == -1)
				selectedPl = activePl;
			else if (selectedPl && selectedPl.score < activePl.score && activePl.rank == -1)
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

function PlayerDied(pl : Player)
{
	var alive : int = 0;
	var plAlive : Player;
	
	pl.deaths++;

	for (var apl in players)
	{
		if (apl.isAlive && apl.isActive) {
			alive++;
			plAlive = apl;
		}
	}

	pl.roundDeathId = alive;

	for (var i = 0; i < players.length; i++)
	{
		if (i < alive)
		{
			if (gameLeaderboard[i] == pl) {
				gameLeaderboard[i] = gameLeaderboard[i + 1];
				gameLeaderboard[i + 1] = pl;
			}
		}
	}

	// Force end game before timer
	if (alive <= 1)
	{
		if (plAlive) {
			plAlive.wins++;
			for (var apl in players)
			{
				if (apl != plAlive)
					apl.loses++;
			}
		}
		GameObject.Find("Game").GetComponent(GameController).gamePlaying = false;
		GameObject.Find("Game").BroadcastMessage("GameTimeOver");
	} else {
		
		
	}
}