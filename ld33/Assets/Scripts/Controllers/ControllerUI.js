#pragma strict

var panelMainMenu: GameObject;
var panelPlaySelect: GameObject;
var panelPlayingHUD: GameObject;
var panelGameover: GameObject;
var panelLoadingSplash : GameObject;

var characterSelection: UICharacterSelection;
var hudController: UIHUDController;
var uiGameover : UIGameOver;

var uiSoundPlayer : AudioSource;

function Start () {

}

function Update () {

}

function HideAll() {
	panelMainMenu.SetActive(false);
	panelPlaySelect.SetActive(false);
	panelPlayingHUD.SetActive(false);
	panelGameover.SetActive(false);
	panelLoadingSplash.SetActive(false);
}

function OnStateChanged(state: GameState)
{
	Debug.Log("UI-State change to " + state);
	SwapUIState(state);
}

function SwapUIState(state: GameState)
{
	HideAll();
	switch (state)
	{
		case GameState.MAIN_MENU:
			panelMainMenu.SetActive(true);
			panelMainMenu.Find("PlayBtn").GetComponent(UI.Button).Select();
			break;
		case GameState.CHARACTER_SELECT:
			panelPlaySelect.SetActive(true);
			panelPlaySelect.Find("Characters/CharactersList/List/CharacterEntry(Clone)").GetComponent(UI.Button).Select();
			break;
		case GameState.PLAY_LOADING:
			panelLoadingSplash.SetActive(true);		
			break;
		case GameState.PLAYING:
			panelPlayingHUD.SetActive(true);
			break;
		case GameState.GAME_OVER:
			panelGameover.SetActive(true);
			uiGameover.OnShow();
			panelGameover.Find("Buttons/PlayBtn").GetComponent(UI.Button).Select();
			break;
		default:
			break;
	}
}

// Event callbacks
function OnPlayBtn()
{
	BroadcastMessage("ChangeState", GameState.CHARACTER_SELECT);
}

function OnPlayStartBtn()
{
	BroadcastMessage("ChangeState", GameState.PLAY_LOADING);
}

function OnBackBtn()
{
	BroadcastMessage("ChangeState", GameState.MAIN_MENU);	
}

function OnExitBtn()
{
	#if UNITY_EDITOR
    UnityEditor.EditorApplication.isPlaying = false;
	#else
	Application.Quit();
	#endif
}


function UIEventGameStart()
{
	for (var i = 0; i < 4; i++)
	{
		hudController.pboxHUD[i].UIEventGameStart();
	}
}

function GameTimeOver()
{
	hudController.TimeOverAnimate();
}