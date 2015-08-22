#pragma strict

static var activeState: GameState = GameState.LOAD;
var nextState: GameState = GameState.NONE;
var playersManager : PlayersManager;

function Start () {

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
			nextState = GameState.PLAYING;
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
