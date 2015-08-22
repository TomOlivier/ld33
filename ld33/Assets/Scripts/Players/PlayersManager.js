#pragma strict

public var players: Player[];
//public var playersControllers : PlayerController[];
public var spawnPositions : Vector2[];
//public var selectedPlayers : PlayerController[];
	
function Start () 
{
	var ui : ControllerUI = GameObject.Find("Game").GetComponent(ControllerUI);

	for (var pl in players)
	{
		ui.characterSelection.InsertPlayer(pl);
	}
}

function Update () {
	
}