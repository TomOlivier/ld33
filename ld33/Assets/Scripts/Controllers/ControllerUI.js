#pragma strict

// Menus and top renders
var panelMainMenu: GameObject;
var panelPlaySelect: GameObject;
var panelPlayingHUD: GameObject;
var panelGameover: GameObject;
var panelLoadingSplash : GameObject;

// Overlays
var panelPlayingHUDOverlay : GameObject;

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

	panelPlayingHUDOverlay.SetActive(false);
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
			SoundManager.instance.PlayMusic("titleMusic");
			panelMainMenu.SetActive(true);
			panelMainMenu.Find("PlayBtn").GetComponent(UI.Button).Select();
			break;
		case GameState.CHARACTER_SELECT:
			SoundManager.instance.PlayMusic("characterMusic");
			panelPlaySelect.SetActive(true);
			panelPlaySelect.Find("Characters/CharactersList/List/CharacterEntry(Clone)").GetComponent(UI.Button).Select();
			break;
		case GameState.PLAY_LOADING:
			panelLoadingSplash.SetActive(true);		
			break;
		case GameState.PLAYING:
			SoundManager.instance.PlayMusic("gameMusic");
			panelPlayingHUD.SetActive(true);
			panelPlayingHUDOverlay.SetActive(true);
			break;
		case GameState.GAME_OVER:
			SoundManager.instance.PlayMusic("titleMusic");
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

function PlayerRampage(pl: Player)
{
	hudController.Rampage(pl);
}