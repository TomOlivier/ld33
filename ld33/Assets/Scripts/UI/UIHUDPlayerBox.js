#pragma strict

var player : Player;
var displayObj : GameObject;
var charIcon : UI.Image;

var visibleHP : float;
var visiblePwr : float;

var stateAlive : boolean;
var linkedOverlayBox : GameObject;
var overlayPickupsEffects : GameObject;

var overlayPickupsEffectsHP : GameObject;
var overlayPickupsEffectsSPEED : GameObject;
var overlayPickupsEffectsDMG : GameObject;

function Start () {

}

function UIEventGameStart() {
	if (player.isActive) {
		displayObj.SetActive(true);
		charIcon.sprite = player.character.logoMini;
		displayObj.transform.Find("PName/Image").GetComponent(UI.Image).color = player.color;
		displayObj.transform.Find("PName/Image/Text").GetComponent(UI.Text).text = "P"+ (player.uid).ToString();
		displayObj.transform.Find("TorusInfos").gameObject.SetActive(true);
		displayObj.transform.Find("DeadInfo").gameObject.SetActive(false);
	} else {
		displayObj.SetActive(false);		
	}
	visibleHP = 0.0f;
	visiblePwr = 0.0f;
	stateAlive = true;
	linkedOverlayBox.SetActive(true);
}

function Update () {
	if (player.isActive)
	{
		if (player.isAlive)
		{			
			visiblePwr = Mathf.Lerp(visiblePwr, player.points, 0.1);
			if (visiblePwr + 0.1f > player.points)
				visiblePwr = player.points;
			visibleHP = Mathf.Lerp(visibleHP, player.life, 0.1);
			if (visibleHP + 0.1f > player.life)
				visibleHP = player.life;

			displayObj.transform.Find("TorusInfos/PwrValue").GetComponent(UI.Text).text = 
				Mathf.Floor(visiblePwr).ToString() + "%";
			displayObj.transform.Find("TorusInfos/HPValue").GetComponent(UI.Text).text = 
				Mathf.Floor(visibleHP).ToString();
			displayObj.transform.Find("TorusInfos/PwrTorusBG/PwrTorus").GetComponent(UI.Image).fillAmount = 
				Mathf.Clamp(visiblePwr / 100.0f, 0.0f, 1.0f);
			displayObj.transform.Find("TorusInfos/HPTorus").GetComponent(UI.Image).fillAmount = 
				Mathf.Clamp(visibleHP / player.maxLife, 0.0f, 1.0f);
		}
		else if (stateAlive == true)
		{
			stateAlive = false;
			displayObj.transform.Find("TorusInfos").gameObject.SetActive(false);
			displayObj.transform.Find("DeadInfo").gameObject.SetActive(true);
		}
	}

	// Render player overlay
	if (player.isActive && player.isAlive)
	{
		var pli : GameObject = player.playerInstance;
		var pos : Vector3 = GameObject.Find("Main Camera").GetComponent(Camera).
			WorldToScreenPoint(pli.transform.position + Vector3(0.0f, 0.0f, 3.0f * pli.transform.localScale.x));
        
		linkedOverlayBox.transform.Find("PName/Image").GetComponent(UI.Image).color = player.color;
		if (player.isIA) {
			linkedOverlayBox.transform.Find("PName/Text").GetComponent(UI.Text).text = "BOT";
		} else {
			linkedOverlayBox.transform.Find("PName/Text").GetComponent(UI.Text).text = "P" + player.uid;			
		}
		linkedOverlayBox.transform.position = pos;
	}
	else
	{
		linkedOverlayBox.SetActive(false);
	}

}