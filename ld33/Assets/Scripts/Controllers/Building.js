#pragma strict

public var pnjPrefab : GameObject;

public var bottomLeft : GameObject;
public var bottomMiddle : GameObject;
public var bottomInterMiddle : GameObject;
public var middleLeft : GameObject;
public var middleMiddle : GameObject;
public var top : GameObject;

public var height : int;
public var width : int;

private var spriteRenderer : SpriteRenderer;
private var boxCollider : BoxCollider2D;
private var rb2D : Rigidbody2D;

public var subBuilding : GameObject;

public var lifeDef : float = 0; // if lifeDef == 0; lifeDef = height * 50;

private var currentLife : float = 10;

private var nbPNJScared : int = 5;

function Start () {
	if (lifeDef == 0)
		lifeDef = height * 50;
	
	currentLife = lifeDef;
	spriteRenderer = GetComponent.<SpriteRenderer> ();
	boxCollider = GetComponent.<BoxCollider2D> ();
	rb2D = GetComponent.<Rigidbody2D>();


	boxCollider.offset = new Vector2((width-1)/2f, (height-1)/2f);
	boxCollider.size = new Vector2(width,height);
	
	boxCollider.offset = new Vector2(-(width-1)/2f, 0);
	boxCollider.size = new Vector2(width,1);


	//Peuple les sprites
	var s_building : GameObject;
	var root_asset_building = GameObject();
	root_asset_building.transform.SetParent(this.transform);
	s_building = Instantiate (bottomLeft, new Vector3 (root_asset_building.transform.position.x, root_asset_building.transform.position.y, 0f), Quaternion.identity) as GameObject;
	s_building.transform.SetParent(root_asset_building.transform);
	root_asset_building.transform.localPosition = Vector3(0,0,0);

	//création des sprites du milieu
	var i : int;
	var j : int;

	var doorX : int = Mathf.Floor(width/2f);

	for(i = 1; i < width ; i++){



		for(j = 1 ; j < height ; j++){

			s_building = Instantiate (middleMiddle, new Vector3 (root_asset_building.transform.position.x + i, root_asset_building.transform.position.y + j, 0f), Quaternion.identity) as GameObject;
			s_building.transform.SetParent(root_asset_building.transform);
		}

		if(i == doorX)
			continue;
		s_building = Instantiate (bottomInterMiddle, new Vector3 (root_asset_building.transform.position.x + i, root_asset_building.transform.position.y, 0f), Quaternion.identity) as GameObject;
		s_building.transform.SetParent(root_asset_building.transform);
	}

	for(j = 1 ; j < height ; j++){

		s_building = Instantiate (middleLeft, new Vector3 (root_asset_building.transform.position.x, root_asset_building.transform.position.y + j, 0f), Quaternion.identity) as GameObject;
		s_building.transform.SetParent(root_asset_building.transform);

		s_building = Instantiate (middleLeft, new Vector3 (root_asset_building.transform.position.x + width -1, root_asset_building.transform.position.y + j, 0f), Quaternion.identity) as GameObject;
		s_building.transform.SetParent(root_asset_building.transform);

	}

	// for (i = 0; i < width; i++) {
	// 	s_building = Instantiate (top, new Vector3 (root_asset_building.transform.position.x + i, root_asset_building.transform.position.y + height - 0.49f, 0f), Quaternion.identity) as GameObject;
	// 	s_building.transform.SetParent(root_asset_building.transform);
	// 	s_building.transform.Rotate(new Vector3(90f,0f,0f));
	// }


	s_building = Instantiate (bottomMiddle, new Vector3 (root_asset_building.transform.position.x + doorX, root_asset_building.transform.position.y, 0f), Quaternion.identity) as GameObject;
	s_building.transform.SetParent(root_asset_building.transform);

	root_asset_building.transform.Rotate(new Vector3(270f,180f,0f));
	root_asset_building.transform.position.z = 0.5f;


}

function OnDestroy() {
}

function calculate() {


	// rb2D.

}

function Update () {

}

function GetDamaged(damage:float) {
	Debug.Log("life : " + currentLife + " ; damage : " + damage);

	var curLifeIndex : int = currentLife/(height * width) + width;
	var nextLifeIndex : int = (currentLife-damage)/(height * width);

	
	currentLife -= damage;
	
	//si on doit perdre un étage
	if(nextLifeIndex < curLifeIndex)
	{
		var npcToSpawn = nbPNJScared * (1 - currentLife / lifeDef);
		//Debug.Log("nbPNJToSpawn : " + npcToSpawn);
		while (npcToSpawn > 0) {
			var toSpawnLocalPosition : Vector2 = Random.insideUnitCircle * width / 2;
			toSpawnLocalPosition.x += Random.value >= 0.5 ? 1.5 : -1.5;
			toSpawnLocalPosition.y += width / 2;
			Instantiate(pnjPrefab, this.transform.TransformPoint(toSpawnLocalPosition), Quaternion.identity);
			nbPNJScared--;
			npcToSpawn--;
		}

		// Debug.Log("idjfosdf : " + (curLifeIndex - nextLifeIndex));
		for (var i : int = 0; i < (curLifeIndex - nextLifeIndex); i++) {
			removeSubBuilding();
		};
		
	}

	if (currentLife < 0)
		this.gameObject.GetComponent.<Hittable>().Die();
	else {
		this.gameObject.GetComponent.<Hittable>().GetHit(damage);
	}
}


function removeSubBuilding() {
	var i : int = 0;
	var sub_child : Transform;
	var child : Transform;
	var shouldbreak : int = 0;
	var objectToRemove : GameObject;
	for (child in transform) {
		for (sub_child in child) {
			// Debug.Log("tag : " + sub_child.tag + ", " + sub_child.localPosition.y);
			if(sub_child.tag == 'building_top' && sub_child.localPosition.y > shouldbreak){
				shouldbreak = sub_child.localPosition.y;
				objectToRemove = sub_child.gameObject;
			}

		}

		if(shouldbreak){
			Destroy(objectToRemove);
			// Debug.Log("Removing " + objectToRemove);
			break;
		}

		for (sub_child in child) {
			if(sub_child.tag == 'building_bot' && sub_child.localPosition.y > shouldbreak){
				shouldbreak = sub_child.localPosition.y;
				objectToRemove = sub_child.gameObject;
			}
		}

		if(shouldbreak){
			Destroy(objectToRemove);
			// Debug.Log("Removing " + objectToRemove);
			break;
		}
	}
}

function OnCollisionEnter2D(collision : Collision2D) {
	if (collision.gameObject.tag.Equals("PNJScared")) {
		Debug.Log("npc entered");
		nbPNJScared++;
	}
}