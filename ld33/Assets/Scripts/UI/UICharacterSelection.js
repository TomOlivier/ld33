#pragma strict

//var playersManager: PlayersManager;
var uiPlayersList: GameObject;
var uiCharactersList: GameObject;

var charEntryPrefab: GameObject;
var playerEntryPrefab: GameObject;

var startBtn : UI.Button;
var gameSetupUpdated : boolean = false;

private var charOffset: Vector3;
private var playerXOffset: float = 0.0f;

private var anim : Animator;

function Start () 
{
	anim = GetComponent(Animator);
}

function Update () 
{
	if (anim.GetCurrentAnimatorStateInfo(0).IsName("StartFinished"))
	{
		gameObject.Find("Game").GetComponent(ControllerUI).OnPlayStartBtn();
		gameObject.SetActive(false);
		GameController.guiLock = false;
	}
	if (anim.GetCurrentAnimatorStateInfo(0).IsName("BackFinished"))
	{
		gameObject.Find("Game").GetComponent(ControllerUI).OnBackBtn();
		gameObject.SetActive(false);
		GameController.guiLock = false;
	}
	if (gameSetupUpdated)
	{
		gameSetupUpdated = false;
		if (gameObject.Find("Game/Players").GetComponent(PlayersManager).AreAllPlayersReady())
		{
			startBtn.gameObject.active = true;
		}
		else 
		{
			startBtn.gameObject.active = false;
		}			
	}

}

function UpdateCharactersList()
{

}

function BeginBackAnim()
{
	if (GameController.guiLock)
		return ;
	anim.Play("Back");
	GameController.guiLock = true;
}

function BeginStartAnim()
{
	if (GameController.guiLock)
		return ;
	anim.Play("Start");	
	GameController.guiLock = true;
}

function SelectCharacterForPlayer(charc: Character, pl: Player)
{
	if (pl == null || charc == null)
		return ;
	pl.character = charc;
	pl.relatedSelectionBox.GetComponent(UIPlayer).RefreshCharacter();
	gameObject.Find("Game").GetComponent(ControllerUI).uiSoundPlayer.clip = pl.character.selectSound;
	gameObject.Find("Game").GetComponent(ControllerUI).uiSoundPlayer.Play(); 
}

function InsertCharacter(charc: Character)
{
	var obj: GameObject = Instantiate(charEntryPrefab);

	obj.transform.parent = uiCharactersList.transform;
	obj.transform.localPosition = charOffset + new Vector3(0, 80.0f, 0);
	obj.transform.localScale = new Vector3(1, 1, 1);
	obj.GetComponent(UICharacter).character = charc;
	obj.GetComponent(UICharacter).characterSelection = this;
	obj.GetComponent(UICharacter).RefreshCharacter();
	charOffset.x += charEntryPrefab.GetComponent(RectTransform).rect.width + 5;
}

function InsertPlayer(player: Player)
{
	var obj: GameObject = Instantiate(playerEntryPrefab);

	obj.transform.parent = uiPlayersList.transform;
	obj.transform.localPosition = new Vector3(0, 0, 0);
	obj.transform.GetComponent(RectTransform).offsetMin = new Vector2(0.0f, 0.0f);
	obj.transform.GetComponent(RectTransform).offsetMax = new Vector2(0.0f, 0.0f);
	obj.transform.GetComponent(RectTransform).anchorMin.x = playerXOffset;
	obj.transform.GetComponent(RectTransform).anchorMax.x = playerXOffset + 0.25f;
	obj.transform.localScale = new Vector3(1, 1, 1);
	obj.GetComponent(UIPlayer).player = player;
	obj.GetComponent(UIPlayer).uiCharacter = this;
	obj.GetComponent(UIPlayer).RefreshCharacter();
	player.relatedSelectionBox = obj;
	playerXOffset += 0.25f;
}