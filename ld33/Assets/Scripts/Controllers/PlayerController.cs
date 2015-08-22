using UnityEngine;
using System.Collections;

[RequireComponent(typeof(Rigidbody2D))]
public class PlayerController : MonoBehaviour {
	public int points = 0;
	public int life = 10;
	public float speed = 0f;


	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
		float moveX = Input.GetAxis ("Horizontal");
		float moveY = Input.GetAxis ("Vertical");
		this.GetComponent<Rigidbody2D>().velocity = new Vector2 (moveX * speed, -moveY * speed);
		bool randomForce = Input.GetMouseButtonDown (0);
	}
}
