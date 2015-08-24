#pragma strict

import System.Collections.Generic;

private var isMoving : boolean = false;
private var isAttacking : boolean = false;

private var chaseTimer : float;
private var otherPlayers : List.<GameObject>;

private var currentlyChasingPlayer : GameObject = null;

function init () {

    otherPlayers = new List.<GameObject>();
    var objs = GameObject.FindGameObjectsWithTag('Player');

    for (var player : GameObject in objs) {
        if (player != gameObject) {
            otherPlayers.Add(player);
        }
    };
}

// Return a Float [] with the new direction of the player
function GetMove () {
    // body...
}

function WhatShouldIDo (speed : float) {
    // Let's find the best other player
    var currentBestPlayer : GameObject = GetBestPlayer();

    currentlyChasingPlayer = currentBestPlayer;

    var newPos = currentlyChasingPlayer.transform.position - gameObject.transform.position;

    var ret = Vector3(0,0,0);
    if (newPos.x < Mathf.Epsilon) {
        ret.x = 1;
    } else if (newPos.x > Mathf.Epsilon) {
        ret.x = -1;
    }

    if (newPos.y < Mathf.Epsilon) {
        ret.y = 1;
    } else if (newPos.y > Mathf.Epsilon) {
        ret.y = -1;
    }

    return ret;
}

function GetBestPlayer () {
    var currentBestPlayer : GameObject = null;

    otherPlayers.ForEach (function(elem){
        if (currentBestPlayer == null) currentBestPlayer = elem;
        else {
            if (currentBestPlayer.GetComponent.<PlayerController>().playerInfo.points 
                < elem.GetComponent.<PlayerController>().playerInfo.points) {
                currentBestPlayer = elem;

            }
        }
    });

    return currentBestPlayer;
}
