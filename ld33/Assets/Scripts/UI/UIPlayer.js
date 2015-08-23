#pragma strict

var player : Player;
var uiCharacter : UICharacterSelection;

var pType : GameObject;
var pInput : GameObject;
var pCName : GameObject;
var pCImage : GameObject;

var pInputKB : GameObject;
var pInputJS : GameObject;
var pInputUnknown : GameObject;

function Start () {

}

function Update () {

}

function RefreshCharacter() 
{
	pCImage.SetActive(false);
	pInput.SetActive(false);
	
	if (player.isIA)
	{
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
		if (player.character) {
			pCImage.SetActive(true);
			pCImage.GetComponent(UI.Image).sprite = player.character.logoMedium;			
			//pCImage.GetComponent(UI.Image).color = player.color;
			pCName.GetComponent(UI.Text).text = player.character.name;			
		}
		else {
			pCName.GetComponent(UI.Text).text = "SELECT";
		}
	}
	else
	{
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
		ClearPlayerControllerDevice();
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
		OnPlayerInputTypeClick();
	}
	RefreshCharacter();
}

function RefreshInput() {

}

function ClearPlayerControllerDevice()
{
	var idc : InputDevicesController = InputDevicesController.GetInstance();
	idc.UnassignDeviceFromPlayer(player.device, player);
}

function OnPlayerInputTypeClick() {

	var idc : InputDevicesController = InputDevicesController.GetInstance();
	var getkb = (player.device == null || player.device.isJoystick);
	var getjoy = (player.device == null || player.device.isKeyboard);

	idc.UnassignDeviceFromPlayer(player.device, player);

	var dev : CompatibleDevice = idc.GetAvailableDevice(getkb, getjoy);

	if (dev == null && getkb == false) {
		dev = idc.GetAvailableKeyboard();
	} else if (dev == null) {
		dev = idc.GetAvailableJoypad();
	}

	pInputKB.SetActive(false);
	pInputJS.SetActive(false);
	pInputUnknown.SetActive(false);

	if (dev == null) {
		pInputUnknown.SetActive(true);
	} else {
		idc.AssignDeviceToPlayer(dev, player);
		if (player.device.isJoystick) {
			pInputJS.SetActive(true);
			//pInputJS.Find("Image/Text").GetComponent(UI.Text).text = "";//(player.device.joystickId + 1).ToString();
		} else {
			pInputKB.SetActive(true);
		}
	}

}