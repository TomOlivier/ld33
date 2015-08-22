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


	boxCollider.offset = new Vector2((width-1)/2f, (height-1)/2f);
	boxCollider.size = new Vector2(width,height);


	//Peuple les sprites
	var s_building : GameObject;

	s_building = Instantiate (bottomLeft, new Vector3 (this.transform.position.x, this.transform.position.y, 0f), Quaternion.identity) as GameObject;
	s_building.transform.SetParent(this.transform);

	//création des sprites du milieu
	var i : int;
	var j : int;

	var doorX : int = Mathf.Floor(width/2f);

	for(i = 1; i < width ; i++){



		for(j = 1 ; j < height ; j++){

			s_building = Instantiate (middleMiddle, new Vector3 (this.transform.position.x + i, this.transform.position.y + j, 0f), Quaternion.identity) as GameObject;
			s_building.transform.SetParent(this.transform);
		}




		
		

		if(i == doorX)
			continue;
		s_building = Instantiate (bottomInterMiddle, new Vector3 (this.transform.position.x + i, this.transform.position.y, 0f), Quaternion.identity) as GameObject;
		s_building.transform.SetParent(this.transform);
	}

	for(j = 1 ; j < height ; j++){

		s_building = Instantiate (middleLeft, new Vector3 (this.transform.position.x, this.transform.position.y + j, 0f), Quaternion.identity) as GameObject;
		s_building.transform.SetParent(this.transform);

		s_building = Instantiate (middleLeft, new Vector3 (this.transform.position.x + width -1, this.transform.position.y + j, 0f), Quaternion.identity) as GameObject;
		s_building.transform.SetParent(this.transform);

	}

	for (i = 0; i < width; i++) {
		s_building = Instantiate (top, new Vector3 (this.transform.position.x + i, this.transform.position.y + height - 0.49f, 0f), Quaternion.identity) as GameObject;
		s_building.transform.SetParent(this.transform);
		s_building.transform.Rotate(new Vector3(90f,0f,0f));
	}


	s_building = Instantiate (bottomMiddle, new Vector3 (this.transform.position.x + doorX, this.transform.position.y, 0f), Quaternion.identity) as GameObject;
	s_building.transform.SetParent(this.transform);

	this.transform.Rotate(new Vector3(270f,0f,0f));
	this.transform.position.z = -0.5;


}


function calculate() {


	// rb2D.

}

function Update () {

}