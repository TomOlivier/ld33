#pragma strict


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

function Start () {
	spriteRenderer = GetComponent.<SpriteRenderer> ();
	boxCollider = GetComponent.<BoxCollider2D> ();
	rb2D = GetComponent.<Rigidbody2D>();


	//Peuple les sprites
	var s_building : GameObject;

	s_building = Instantiate (bottomLeft, new Vector3 (this.transform.position.x, this.transform.position.y, 0f), Quaternion.identity) as GameObject;
	s_building.transform.SetParent(this.transform);

	//création des sprites du milieu
	var i : int;
	var j : int;

	for(i = 1; i < width - 1; i++){

		s_building = Instantiate (bottomInterMiddle, new Vector3 (this.transform.position.x + i, this.transform.position.y, 0f), Quaternion.identity) as GameObject;
		s_building.transform.SetParent(this.transform);

		s_building = Instantiate (bottomInterMiddle, new Vector3 (this.transform.position.x + i, this.transform.position.y + height, 0f), Quaternion.identity) as GameObject;
		s_building.transform.SetParent(this.transform);
	}

	s_building = Instantiate (bottomMiddle, new Vector3 (this.transform.position.x, this.transform.position.y, 0f), Quaternion.identity) as GameObject;
	s_building.transform.SetParent(this.transform);


}


function calculate() {


	// rb2D.

}

function Update () {

}