#pragma strict

var timer: GameObject;

var gc: GameController;
var pboxHUD: UIHUDPlayerBox[];

private var anim : Animator;

function Start () 
{
	anim = GetComponent(Animator);

	for (var i = 0; i < 4; i++)
	{
		pboxHUD[i].player = gc.playersManager.players[i];
	}
}

function Update () 
{

	var tm: float = gc.timeLeft;
	var sec: int = Mathf.Floor(tm);
	var fraction: int = Mathf.Floor((tm - sec) * 100);
	var tx: String = String.Format("{0:00}:{1:00}",sec,fraction);

	timer.GetComponent(UI.Text).text = tx;

	if (anim.GetCurrentAnimatorStateInfo(0).IsName("FadeoutComplete"))
	{
		gameObject.Find("Game").BroadcastMessage("ChangeState", GameState.GAME_OVER);
	}

	if (anim.GetCurrentAnimatorStateInfo(0).IsName("ReadyStateFinished"))
	{
		gameObject.Find("Game").GetComponent(GameController).GameTrueBegin();
		anim.Play("Idle");
	}
}

function TimeOverAnimate()
{
	anim.Play("TimeEnd");
}

