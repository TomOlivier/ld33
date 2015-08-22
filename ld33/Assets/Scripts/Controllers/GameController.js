#pragma strict

static var activeState: GameState = GameState.LOAD;
var nextState: GameState = GameState.NONE;

function Start () {

}

function Update () {

	// Local impl.
	switch (activeState)
	{
		case GameState.LOAD:
			Debug.Log("Game state PLAY_LOADING started");

			var idc : InputDevicesController = InputDevicesController.GetInstance();
			nextState = GameState.MAIN_MENU;

			Debug.Log("Game state PLAY_LOADING completed");
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
