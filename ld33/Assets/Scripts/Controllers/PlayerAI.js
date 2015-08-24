#pragma strict

import System.Collections.Generic;

var currentDirection : Vector3;
var currentMove : int;
var movesInARow : int = 10;

// Modes: "attack", "building", "chill"
var modes : String [] = ["attack", "building", "chill"];
var currentMode : String = "attack";

var getPlayerMode : String [] = ['best', 'closest', 'random'];


private var isMoving : boolean = false;
private var isAttacking : boolean = false;

private var chaseTimer : float;
private var otherPlayers : List.<GameObject>;

private var currentlyChasingPlayer : GameObject = null;

function init () {
    currentMove = 0;
    currentDirection = Vector3(0,0,0);

    otherPlayers = new List.<GameObject>();
    var objs = GameObject.FindGameObjectsWithTag('Player');

    for (var player : GameObject in objs) {
        if (player != gameObject) {
            otherPlayers.Add(player);
        }
    };
}

function WhatShouldIDo () {
    // Let's find the best other player

    var move : Vector3 = Vector3(0, 0, 0);

    if (currentMode == 'attack') {
        var rP : int = Random.Range(0, getPlayerMode.length);

        var target : GameObject = GetPlayerTarget(getPlayerMode[rP]);
        currentlyChasingPlayer = target;

        move = MoveTowardsTarget(target);
    }

    return move;
}

function CanHit () : boolean {
    return false;
}

function MoveTowardsTarget (target : GameObject) : Vector3 {
    var ret = Vector3(0,0,0);

    if (currentMove < movesInARow && currentDirection != null) {
        ret = currentDirection;
        currentMove++;
    } else {
        currentMove = 0;

        var newPos = target.transform.position - gameObject.transform.position;

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

        currentDirection = ret;
    }

    return ret;
}

function GetPlayerTarget (mode : String) : GameObject {
    var target : GameObject;

    // Find the best player around
    if (mode == 'best') {
        target = GetBestPlayer();
    }

    else if (mode == 'closest') {
        target = GetClosestPlayer();
    }

    // Random
    else{
        var r : int = Random.Range(0, otherPlayers.Count);
        target = otherPlayers[r];
    }

    return target;
}

function GetClosestPlayer () {
    var currentClosestPlayer : GameObject = null;
    var dist = Mathf.Infinity;
    otherPlayers.ForEach(function(elem) {
        if (Vector3.Distance(elem.transform.position, gameObject.transform.position) < dist) {
            dist = Vector3.Distance(elem.transform.position, gameObject.transform.position);
            currentClosestPlayer = elem;
        }
    });

    return currentClosestPlayer;
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
