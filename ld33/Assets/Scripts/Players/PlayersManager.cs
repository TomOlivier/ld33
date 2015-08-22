using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class PlayersManager : MonoBehaviour {

	public List<PlayerController> playersControllers;
	public List<Vector2> spawnPositions;

	// Use this for initialization
	void Start (int numberOfPlayers) {
		while (numberOfPlayers > 0) {
			numberOfPlayers--;
		}
	}
	
	// Update is called once per frame
	void Update () {
	
	}
}
