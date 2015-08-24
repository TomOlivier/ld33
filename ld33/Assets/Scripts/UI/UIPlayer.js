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

var devices : List.<CompatibleDevice>;

function Start () {

}

function Update () {

}

function RefreshCharacter() 
{
	pCImage.SetActive(false);
	pInput.SetActive(false);
	devices = InputDevicesController.GetInstance().devices; 
	
	if (player.isIA || player.isActive)
	{
		transform.Find("BGImgBt").GetComponent(UI.Image).color = player.color;
		if (player.character != null) {
			pCImage.SetActive(true);
			pCImage.GetComponent(UI.Image).sprite = player.character.logoMedium;			
			//pCImage.GetComponent(UI.Image).color = player.color;
			pCName.GetComponent(UI.Text).text = player.character.name;			
		}
		else {
			pCName.GetComponent(UI.Text).text = "SELECT";
		}

		if (player.isIA)
		{
			pType.transform.Find("Text").GetComponent(UI.Text).text = "IA";
			pType.transform.Find("Text").GetComponent(UI.Text).color = new Color(0, 0, 0, 255);	
			transform.Find("BGImgBt").GetComponent(UI.Image).color = new Color(1.0f, 1.0f, 1.0f, 1.0f);
		}
		else if (player.isActive)
		{
			pInput.SetActive(true);
			pType.transform.Find("Text").GetComponent(UI.Text).text = "P" + player.uid;
			pType.transform.Find("Text").GetComponent(UI.Text).color = new Color(0, 0, 0, 255);
		}
	}
	else
	{
		pType.transform.Find("Text").GetComponent(UI.Text).text = "--";
		pType.transform.Find("Text").GetComponent(UI.Text).color = new Color(0, 0, 0, 255);
		transform.Find("BGImgBt").GetComponent(UI.Image).color = new Color(0.7f, 0.7f, 0.7f, 1.0f);
		pCName.GetComponent(UI.Text).text = "--";
	}

	// Refresh boxes

	pInputKB.SetActive(false);
	pInputJS.SetActive(false);
	pInputUnknown.SetActive(false);

	if (player.device == null) {
		pInputUnknown.SetActive(true);
	} else {
		if (player.device.isJoystick) {
			pInputJS.SetActive(true);
			pInputJS.transform.Find("Image/Text").GetComponent(UI.Text).text = (player.device.joystickId).ToString();
		} else {
			pInputKB.SetActive(true);
		}
	}
}

function OnPlayerTypeClick() {
	if (GameController.guiLock)
		return ;

	Debug.Log("Type change");
	if (!player.isIA)
	{
		ClearPlayerControllerDevice();
		if (!player.isActive)
		{
			player.isIA = false;
			player.isActive = true;
			OnPlayerInputTypeClick();
		}
		else
		{
			player.isActive = true;
			player.isIA = true;
			uiCharacter.SelectCharacterForPlayer(
				gameObject.Find("Game/Players").GetComponent(PlayersManager).GetRandomCharacter(),
				player);
		}
	}
	else
	{
		player.isActive = false;
		player.isIA = false;
	}
	RefreshCharacter();
	uiCharacter.gameSetupUpdated = true;

}

function RefreshInput() {

}

function ClearPlayerControllerDevice()
{
	var idc : InputDevicesController = InputDevicesController.GetInstance();
	idc.UnassignDeviceFromPlayer(player.device, player);
}

function OnPlayerInputTypeClick() {
	if (GameController.guiLock)
		return ;

	var idc : InputDevicesController = InputDevicesController.GetInstance();
	//var getkb = (player.device == null || player.device.isJoystick);
	//var getjoy = (player.device == null || player.device.isKeyboard);
	var nextDev : CompatibleDevice = idc.GetNextAvailableDevice(player.device);

	idc.UnassignDeviceFromPlayer(player.device, player);

	// var dev : CompatibleDevice = idc.GetAvailableDevice(getkb, getjoy);

	// if (dev == null && getkb == false) {
	// 	dev = idc.GetAvailableKeyboard();
	// } else if (dev == null) {
	// 	dev = idc.GetAvailableJoypad();
	// }

	if (nextDev == null) {
	} else {
		idc.AssignDeviceToPlayer(nextDev, player);
	}
	RefreshCharacter();
	uiCharacter.gameSetupUpdated = true;
}