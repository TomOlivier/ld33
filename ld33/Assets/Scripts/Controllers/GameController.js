#pragma strict

static var activeState: GameState = GameState.LOAD;
var nextState: GameState = GameState.NONE;
var playersManager : PlayersManager;
var generator : GameManager;

var timeLeft: float;
var timeLeftDef: float = 90.00f;

function Start () {

}

function ResetGameConditions() {
	timeLeft = timeLeftDef;
}

function Update () {

	// Local impl.
	switch (activeState)
	{
		case GameState.LOAD:
			Debug.Log("Game state LOAD started");

			var idc : InputDevicesController = InputDevicesController.GetInstance();
			nextState = GameState.MAIN_MENU;
			if (idc.AssignDeviceToPlayer(idc.GetAvailableKeyboard(), playersManager.GetPlayer(0)) == false)
			{
				Debug.LogError("Warning: No device available to be auto assigned to player 0");
			}

			Debug.Log("Game state LOAD completed");
			break;
		case GameState.PLAY_LOADING:
			ResetGameConditions();
			playersManager.StartGame();
			generator.Generate();
			BroadcastMessage("UIEventGameStart");
			nextState = GameState.PLAYING;
			break;
		case GameState.PLAYING:
			timeLeft -= Time.deltaTime;
			if (timeLeft <= 0.0f)
			{
				nextState = GameState.GAME_OVER;
			}
			break;
		default:
			break;
	}

	if (nextState != GameState.NONE) {
		Debug.Log("Game state change from " + activeState + " to " + nextState);
		activeState = nextState;
		BroadcastMessage("OnStateChanged", activeState);
		nextState = GameState.NONE;
	}
}

function ChangeState(state: GameState) {
	nextState = state;
}
