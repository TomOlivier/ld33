#pragma strict

static var activeState: GameState = GameState.LOAD;
var nextState: GameState = GameState.NONE;

function Start () {
	nextState = GameState.MAIN_MENU;
}

function Update () {
	if (nextState != GameState.NONE) {
		activeState = nextState;
		BroadcastMessage("OnStateChanged", activeState);
		nextState = GameState.NONE;
	}

	// Local impl.
	switch (activeState)
	{
		case GameState.PLAY_LOADING:
			nextState = GameState.PLAYING;
			break;
		default:
			break;
	}
}

function ChangeState(state: GameState) {
	nextState = state;
}
