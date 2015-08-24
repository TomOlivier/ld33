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

    // if (currentBestPlayer == currentlyChasingPlayer) {
    // }

    currentlyChasingPlayer = currentBestPlayer;

    var step = speed * Time.deltaTime;

    return Vector3.MoveTowards(transform.position, currentlyChasingPlayer.transform.position, step);
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
