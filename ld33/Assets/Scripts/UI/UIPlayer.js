#pragma strict

var player : Player;
var uiCharacter : UICharacterSelection;

var pType : GameObject;
var pInput : GameObject;

function Start () {

}

function Update () {

}

function RefreshCharacter() {
	if (player.isIA)
	{
		pInput.SetActive(false);
		pType.transform.Find("Text").GetComponent(UI.Text).text = "IA";
		pType.transform.Find("Text").GetComponent(UI.Text).color = new Color(0, 0, 0, 255);
		transform.Find("Image").GetComponent(UI.Image).color = new Color(1.0f, 1.0f, 1.0f, 1.0f);
	}
	else if (player.isActive)
	{
		pInput.SetActive(true);
		pType.transform.Find("Text").GetComponent(UI.Text).text = "P" + player.uid;
		pType.transform.Find("Text").GetComponent(UI.Text).color = new Color(255, 255, 255, 255);
		transform.Find("Image").GetComponent(UI.Image).color = player.color;
	}
	else
	{
		pInput.SetActive(false);
		pType.transform.Find("Text").GetComponent(UI.Text).text = "--";
		pType.transform.Find("Text").GetComponent(UI.Text).color = new Color(0, 0, 0, 255);
		transform.Find("Image").GetComponent(UI.Image).color = new Color(0.7f, 0.7f, 0.7f, 1.0f);
	}
}

function OnPlayerTypeClick() {
	Debug.Log("Type change");
	if (!player.isIA)
	{
		if (player.isActive)
		{
			player.isActive = false;
			player.isIA = false;
		}
		else
		{
			player.isActive = true;
			player.isIA = true;
		}
	}
	else
	{
		player.isIA = false;
		player.isActive = true;
	}
	RefreshCharacter();
}

function OnPlayerInputTypeClick() {
	Debug.Log("Input Change");
}