#pragma strict

var player : Player;
var displayObj : GameObject;

var visibleHP : float;
var visiblePwr : float;

var stateAlive : boolean;


function Start () {

}

function UIEventGameStart() {
	if (player != null && player.isActive) {
		displayObj.SetActive(true);
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
			displayObj.transform.Find("TorusInfos/PwrTorus").GetComponent(UI.Image).fillAmount = 
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
}