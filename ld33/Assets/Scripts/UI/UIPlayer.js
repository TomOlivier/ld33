#pragma strict

var player : Player;
var uiCharacter : UICharacterSelection;

var pType : GameObject;
var pInput : GameObject;
var pCName : GameObject;

var pInputKB : GameObject;
var pInputJS : GameObject;
var pInputUnknown : GameObject;

function Start () {

}

function Update () {

}

function RefreshCharacter() 
{
	if (player.isIA)
	{
		pInput.SetActive(false);
		pType.transform.Find("Text").GetComponent(UI.Text).text = "IA";
		pType.transform.Find("Text").GetComponent(UI.Text).color = new Color(0, 0, 0, 255);
		transform.Find("Image").GetComponent(UI.Image).color = new Color(1.0f, 1.0f, 1.0f, 1.0f);
		pCName.GetComponent(UI.Text).text = "Random";
	}
	else if (player.isActive)
	{
		pInput.SetActive(true);
		pType.transform.Find("Text").GetComponent(UI.Text).text = "P" + player.uid;
		pType.transform.Find("Text").GetComponent(UI.Text).color = new Color(0, 0, 0, 255);
		transform.Find("Image").GetComponent(UI.Image).color = player.color;
		if (player.character)
			pCName.GetComponent(UI.Text).text = player.character.name;
		else
			pCName.GetComponent(UI.Text).text = "SELECT";
	}
	else
	{
		pInput.SetActive(false);
		pType.transform.Find("Text").GetComponent(UI.Text).text = "--";
		pType.transform.Find("Text").GetComponent(UI.Text).color = new Color(0, 0, 0, 255);
		transform.Find("Image").GetComponent(UI.Image).color = new Color(0.7f, 0.7f, 0.7f, 1.0f);
		pCName.GetComponent(UI.Text).text = "--";
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

function RefreshInput() {
	
}

function OnPlayerInputTypeClick() {
	Debug.Log("Input Change");

}