#pragma strict

function Start () {

}

function Update () {

}


function OnTriggerEnter2D(collider : Collider2D) {

	var touchedUnits : Array = this.transform.parent.GetComponent.<PlayerController>().touchedUnits;

	if (!collider.gameObject.tag.Equals("Building") && !collider.gameObject.tag.Equals("Player")) {
		return;
	}
	for (var i = 0; i < touchedUnits.Count; i++) {
		if (touchedUnits[i] == collider.gameObject) {
			return ;
		}
	}
	touchedUnits.Add(collider.gameObject);
}
function OnTriggerExit2D(collider : Collider2D) {

	var touchedUnits : Array = this.transform.parent.GetComponent.<PlayerController>().touchedUnits;

	if (!collider.gameObject.tag.Equals("Building") && !collider.gameObject.tag.Equals("Player")) {
		return;
	}

	var cleared : boolean = false;
	while (cleared == false)
	{
		cleared = true;
		//Debug.Log("cantHit: " + collider.gameObject.tag);
		for (var i = 0; i < touchedUnits.Count; i++) {
			if (touchedUnits[i] == collider.gameObject) {
				//Debug.Log("removed 1 at index: " + i);
				touchedUnits.RemoveAt(i);
				cleared = false;
				break;
			}
		}
	}
}