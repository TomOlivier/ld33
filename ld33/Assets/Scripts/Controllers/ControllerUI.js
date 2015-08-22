﻿#pragma strict

var panelMainMenu: GameObject;
var panelPlay: GameObject;
var panelPlayingHUD: GameObject;
var panelGameover: GameObject;

var characterSelection: UICharacterSelection;

function Start () {

}

function Update () {

}

function HideAll() {
	panelMainMenu.SetActive(false);
	panelPlay.SetActive(false);
	panelPlayingHUD.SetActive(false);
	panelGameover.SetActive(false);
}

// Event callbacks
function OnPlayBtn()
{
	
}

function OnExitBtn()
{
	#if UNITY_EDITOR
    UnityEditor.EditorApplication.isPlaying = false;
	#else
	Application.Quit();
	#endif
}