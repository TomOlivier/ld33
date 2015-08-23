#pragma strict

var timer: GameObject;

var gc: GameController;
var pboxHUD: UIHUDPlayerBox[];

function Start () {
	for (var i = 0; i < 4; i++)
	{
		pboxHUD[i].player = gc.playersManager.players[i];
	}
}

function Update () {

	var tm: float = gc.timeLeft;
	var sec: int = Mathf.Floor(tm);
	var fraction: int = Mathf.Floor((tm - sec) * 100);
	var tx: String = String.Format("{0:00}:{1:00}",sec,fraction);

	timer.GetComponent(UI.Text).text = tx;
}