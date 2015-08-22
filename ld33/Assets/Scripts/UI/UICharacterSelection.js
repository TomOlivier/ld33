﻿#pragma strict

//var playersManager: PlayersManager;
var uiPlayersList: GameObject;
var uiCharactersList: GameObject;

var charEntryPrefab: GameObject;
var playerEntryPrefab: GameObject;

private var charOffset: Vector2;
private var playerXOffset: float = 0.0f;

function Start () 
{

}

function Update () {

}

function UpdateCharactersList()
{

}

function InsertCharacter()
{
	var obj: GameObject = Instantiate(charEntryPrefab);

	obj.transform.parent = uiCharactersList.transform;
	obj.transform.localPosition = charOffset;
	charOffset.x += charEntryPrefab.GetComponent(RectTransform).rect.width;
}

function InsertPlayer(player: Player)
{
	var obj: GameObject = Instantiate(playerEntryPrefab);

	obj.transform.parent = uiPlayersList.transform;
	obj.transform.GetComponent(RectTransform).offsetMin = new Vector2(0.0f, 0.0f);
	obj.transform.GetComponent(RectTransform).offsetMax = new Vector2(0.0f, 0.0f);
	obj.transform.GetComponent(RectTransform).anchorMin.x = playerXOffset;
	obj.transform.GetComponent(RectTransform).anchorMax.x = playerXOffset + 0.25f;
	obj.GetComponent(UIPlayer).player = player;
	obj.GetComponent(UIPlayer).uiCharacter = this;
	playerXOffset += 0.25f;
}