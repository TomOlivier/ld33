#pragma strict

var player : Player;
var displayObj : GameObject;

function Start () {

}

function UIEventGameStart() {
	if (player != null && player.isActive) {
		displayObj.SetActive(true);
		displayObj.transform.Find("PName/Image").GetComponent(UI.Image).color = player.color;
		displayObj.transform.Find("PName/Image/Text").GetComponent(UI.Text).text = "P"+ (player.uid).ToString();
	} else {
		displayObj.SetActive(false);		
	}
}

function Update () {
	if (player.isActive)
	{

	}
}