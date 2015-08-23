#pragma strict

static var isInGUI : boolean = true;						// Is GUI visible and locking other controls
static var guiLock : boolean = false;						// Is GUI locking all controls
static var activeState: GameState = GameState.LOAD;			// FSM state
static var roundCount : int = 0;							// Total of rounds played

var nextState: GameState = GameState.NONE;
var playersManager : PlayersManager;
var generator : GameManager;

var timeLeft: float;
var timeLeftDef: float = 90.00f;

function Start () {

}

function ResetGameConditions() {
	timeLeft = timeLeftDef;
	playersManager.ResetAll(false);
	
}

function FullReset() {
	timeLeft = timeLeftDef;
	roundCount = 0;
	playersManager.ResetAll(true);
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
		case GameState.MAIN_MENU:
			break;	
		case GameState.PLAY_LOADING:
			roundCount++;
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
		ApplyStateSwitch();
		BroadcastMessage("OnStateChanged", activeState);
		nextState = GameState.NONE;
	}
}

function ApplyStateSwitch()
{
	switch (activeState)
	{
		case GameState.LOAD:
			isInGUI = true;
			break;
		case GameState.MAIN_MENU:
			FullReset();
			isInGUI = true;
			break;	
		case GameState.PLAY_LOADING:
			isInGUI = true;
			break;
		case GameState.PLAYING:
			isInGUI = false;
			break;
		case GameState.GAME_OVER:
			isInGUI = true;
			playersManager.EndGame();		
			break;	
		default:
			break;
	}
}

function ChangeState(state: GameState) {
	nextState = state;
}
