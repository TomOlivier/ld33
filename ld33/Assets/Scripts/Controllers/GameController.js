#pragma strict

static var isInGUI : boolean = true;						// Is GUI visible and locking other controls
static var guiLock : boolean = false;						// Is GUI locking all controls
static var gamePlaying : boolean = false;					// If game is playing or over
static var activeState : GameState = GameState.LOAD;			// FSM state
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
			
			playersManager.players[0].device = idc.GetNextAvailableDevice(null);
			playersManager.players[0].isActive = true;
			playersManager.players[0].character = playersManager.characters[0];

			playersManager.players[1].isActive = true;
			playersManager.players[1].isIA = true;
			playersManager.players[1].character = playersManager.characters[1];

			playersManager.players[0].relatedSelectionBox.GetComponent(UIPlayer).RefreshCharacter();
			playersManager.players[1].relatedSelectionBox.GetComponent(UIPlayer).RefreshCharacter();

			Debug.Log("Game state LOAD completed");
			break;
		case GameState.MAIN_MENU:
			break;
		case GameState.PLAY_LOADING:
			if (generator.generationStateComplete)
			{
				nextState = GameState.PLAY_LOADING_FINISHED;
			}
			break;
		case GameState.PLAY_LOADING_FINISHED:
			roundCount++;
			ResetGameConditions();
			playersManager.StartGame();
			this.transform.BroadcastMessage("UIEventGameStart");
			nextState = GameState.PLAYING;
			break;
		case GameState.PLAYING:
			if (gamePlaying)
			{
				timeLeft -= Time.deltaTime;
				if (timeLeft <= 0.0f)
				{
					timeLeft = 0.0f;
					gamePlaying = false;
					BroadcastMessage("GameTimeOver");
				}
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

function GameTrueBegin()
{
	gamePlaying = true;
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
			var testCoroutineFunction : function():System.Collections.IEnumerator = generator.Generate;

			generator.Clear();
			isInGUI = true;
			generator.generationStateComplete = false;
			StartCoroutine(testCoroutineFunction());
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
