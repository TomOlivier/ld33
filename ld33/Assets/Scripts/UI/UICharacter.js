#pragma strict

var character : Character;
var characterSelection : UICharacterSelection;

function Start () {

}

function Update () {

}

function RefreshCharacter() {
	transform.FindChild("ChName").GetComponent(UI.Text).text = character.name;
	transform.FindChild("ChImg").GetComponent(UI.Image).sprite = character.logoMini;
}

function OnSelected() {
	characterSelection.SelectCharacterForPlayer(character,
	 	GameObject.Find("Game/Players").GetComponent(PlayersManager).FindSubmittingPlayerFromDevice());
}