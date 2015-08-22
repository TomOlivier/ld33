#pragma strict

var panelMainMenu: GameObject;
var panelPlaySelect: GameObject;
var panelPlayingHUD: GameObject;
var panelGameover: GameObject;

var characterSelection: UICharacterSelection;

function Start () {

}

function Update () {

}

function HideAll() {
	panelMainMenu.SetActive(false);
	panelPlaySelect.SetActive(false);
	panelPlayingHUD.SetActive(false);
	panelGameover.SetActive(false);
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
			break;
		case GameState.CHARACTER_SELECT:
			panelPlaySelect.SetActive(true);
			break;
		case GameState.PLAYING:
			panelPlayingHUD.SetActive(true);
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

function OnExitBtn()
{
	#if UNITY_EDITOR
    UnityEditor.EditorApplication.isPlaying = false;
	#else
	Application.Quit();
	#endif
}