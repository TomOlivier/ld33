#pragma strict

public var pnjPrefab : GameObject;
public var bonusPrefab : GameObject;

public var bottomLeft : GameObject;
public var bottomMiddle : GameObject;
public var bottomInterMiddle : GameObject;
public var middleLeft : GameObject;
public var middleMiddle : GameObject;

public var buildingDamaged : GameObject;
public var buildingDecorator : GameObject;

public var height : int;
public var width : int;

public var soundExplosion : AudioClip [];

private var spriteRenderer : SpriteRenderer;
private var boxCollider : BoxCollider2D;
private var rb2D : Rigidbody2D;

public var subBuilding : GameObject;

public var lifeDef : float = 0; // if lifeDef == 0; lifeDef = height * 50;


public var pickupSpeed : AudioClip [];
public var pickupLife : AudioClip [];
public var pickupStr : AudioClip [];

private var currentLife : float = 10;

private var nbPNJScared : int = 5;

private var root_asset_building : GameObject;

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
	root_asset_building = GameObject();

	root_asset_building.transform.SetParent(this.transform);
	s_building = Instantiate (bottomLeft, new Vector3 (root_asset_building.transform.position.x, root_asset_building.transform.position.y, 0f), Quaternion.identity) as GameObject;
	s_building.transform.SetParent(root_asset_building.transform);
	root_asset_building.transform.localPosition = Vector3(0,0,0);

	//création des sprites du milieu
	var i : int;
	var j : int;

	var doorX : int = Mathf.Floor(width/2f);

	for(i = 1; i < width-1 ; i++){

		for(j = 1 ; j < height ; j++){
			s_building = Instantiate (middleMiddle, new Vector3 (root_asset_building.transform.position.x + i, root_asset_building.transform.position.y + j, 0f), Quaternion.identity) as GameObject;
			s_building.transform.SetParent(root_asset_building.transform);
		}


	}

	for (i = 1; i < width ; i++) {
		if(i == doorX)
			continue;
		s_building = Instantiate (bottomInterMiddle, new Vector3 (root_asset_building.transform.position.x + i, root_asset_building.transform.position.y, 0f), Quaternion.identity) as GameObject;
		s_building.transform.SetParent(root_asset_building.transform);
	};

	for(j = 1 ; j < height ; j++){

		s_building = Instantiate (middleLeft, new Vector3 (root_asset_building.transform.position.x, root_asset_building.transform.position.y + j, 0f), Quaternion.identity) as GameObject;
		s_building.transform.SetParent(root_asset_building.transform);

		if(width > 1){
			s_building = Instantiate (middleLeft, new Vector3 (root_asset_building.transform.position.x + width -1, root_asset_building.transform.position.y + j, 0f), Quaternion.identity) as GameObject;
			s_building.transform.SetParent(root_asset_building.transform);
		}


	}

	// for (i = 0; i < width; i++) {
	// 	s_building = Instantiate (top, new Vector3 (root_asset_building.transform.position.x + i, root_asset_building.transform.position.y + height - 0.49f, 0f), Quaternion.identity) as GameObject;
	// 	s_building.transform.SetParent(root_asset_building.transform);
	// 	s_building.transform.Rotate(new Vector3(90f,0f,0f));
	// }


	s_building = Instantiate (bottomMiddle, new Vector3 (root_asset_building.transform.position.x + doorX, root_asset_building.transform.position.y, 0f), Quaternion.identity) as GameObject;
	s_building.transform.SetParent(root_asset_building.transform);


	if(buildingDecorator)
	{
		s_building = Instantiate (buildingDecorator, new Vector3 (root_asset_building.transform.position.x + doorX, root_asset_building.transform.position.y + height, 0f), Quaternion.identity) as GameObject;
		s_building.transform.SetParent(root_asset_building.transform);
	}


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
//	Debug.Log("life : " + currentLife + " ; damage : " + damage);

	var curLifeIndex : int = currentLife/(height * width) + width;
	var nextLifeIndex : int = (currentLife-damage)/(height * width);


	currentLife -= damage;

	//si on doit perdre au moins un étage
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
		/*for (var i : int = 0; i < (curLifeIndex - nextLifeIndex); i++) {*/
		removeSubBuilding();
		/*};*/

	}

	if (currentLife < 0) {
		var r : int = Random.Range(0, 100);
		if (r < 200) {
			var posBonus = this.transform.TransformPoint(toSpawnLocalPosition);
			// posBonus.z = 1;
			var newBonus : CatchableBonus = Instantiate(bonusPrefab, posBonus, Quaternion.identity).GetComponent.<CatchableBonus>();
			var bonusType : String = newBonus.bonusType;

			if(bonusType == "speed"){
				newBonus.pickupAudio = pickupSpeed;
			}
			else if(bonusType == "life"){
				newBonus.pickupAudio = pickupLife;
			}
			else {
				newBonus.pickupAudio = pickupStr;
			}

		}
		this.gameObject.GetComponent.<Hittable>().Die();
	}
	else {
		this.gameObject.GetComponent.<Hittable>().GetHit(damage);
	}
}


function removeSubBuilding() {

	var i : int = 0;
	var destroyed_part : GameObject;
	var sub_child : Transform;
	var child : Transform;
	var yToRemove : int = 0;
	var objectToRemove : GameObject;
	for (child in transform) {
		for (sub_child in child) {
			// Debug.Log("tag : " + sub_child.tag + ", " + sub_child.localPosition.y);
			if(sub_child.tag == 'building_top' && sub_child.localPosition.y > yToRemove){
				yToRemove = sub_child.localPosition.y;
				objectToRemove = sub_child.gameObject;
			}

		}

		if(yToRemove){
			if(soundExplosion && soundExplosion.length > 0)
				SoundManager.instance.PlaySfx(soundExplosion[Random.Range(0,soundExplosion.length)]);

			/*Debug.Log("On remove un etage : local : " + objectToRemove.transform.localPosition.x + ", " +  objectToRemove.transform.localPosition.y + ' | global : ' + objectToRemove.transform.position.x + ", " +  objectToRemove.transform.position.y);
*/

			for (sub_child in child) {
				//destroy de tous les prefabs tag building_destroyed avec le meme Y

				if(sub_child.tag == 'building_damaged' && sub_child.localPosition.x == objectToRemove.transform.localPosition.x){
					Destroy(sub_child.gameObject);
					break;
				}
			}

			destroyed_part = Instantiate (buildingDamaged) as GameObject;
			destroyed_part.transform.SetParent(root_asset_building.transform);
			destroyed_part.transform.localPosition.x = objectToRemove.transform.localPosition.x;
			destroyed_part.transform.localPosition.y = yToRemove-1;
			destroyed_part.transform.localPosition.z = 0;
			destroyed_part.transform.localScale = new Vector3(1,1,1);
			destroyed_part.transform.rotation = objectToRemove.transform.rotation;

			/*destroyed_part.transform.position.y = objectToRemove.transform.position.y;*/

			Destroy(objectToRemove);

			// Debug.Log("Removing " + objectToRemove);
			break;
		}

		for (sub_child in child) {
			if(sub_child.tag == 'building_bot' && sub_child.localPosition.y > yToRemove){
				yToRemove = sub_child.localPosition.y;
				objectToRemove = sub_child.gameObject;
			}
		}

		if(yToRemove){
			if(soundExplosion && soundExplosion.length > 0)
				SoundManager.instance.PlaySfx(soundExplosion[Random.Range(0,soundExplosion.length)]);

			/*Debug.Log("On remove un etage : local : " + objectToRemove.transform.localPosition.x + ", " +  objectToRemove.transform.localPosition.y + ' | global : ' + objectToRemove.transform.position.x + ", " +  objectToRemove.transform.position.y);
*/

			for (sub_child in child) {
				//destroy de tous les prefabs tag building_destroyed avec le meme Y

				if(sub_child.tag == 'building_damaged' && sub_child.localPosition.x == objectToRemove.transform.localPosition.x){
					Destroy(sub_child.gameObject);
					break;
				}
			}

			destroyed_part = Instantiate (buildingDamaged) as GameObject;
			destroyed_part.transform.SetParent(root_asset_building.transform);
			destroyed_part.transform.localPosition.x = objectToRemove.transform.localPosition.x;
			destroyed_part.transform.localPosition.y = yToRemove-1;
			destroyed_part.transform.localPosition.z = 0;
			destroyed_part.transform.localScale = new Vector3(1,1,1);
			destroyed_part.transform.rotation = objectToRemove.transform.rotation;

			/*destroyed_part.transform.position.y = objectToRemove.transform.position.y;*/

			Destroy(objectToRemove);

			// Debug.Log("Removing " + objectToRemove);
			break;
		}
	}
}

function OnCollisionEnter2D(collision : Collision2D) {
	if (collision.gameObject.tag.Equals("PNJScared")) {
//		Debug.Log("npc entered");
		nbPNJScared++;
	}
}