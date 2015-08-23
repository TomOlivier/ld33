#pragma strict


function Start () {

	var gameManager : GameManager;

	gameManager = this.GetComponent.<GameManager>();

	gameManager.Generate();
}

function Update () {

}