#pragma strict

import System.Collections.Generic;

var currentDirection : Vector3;
var currentMove : int;
var movesInARow : int = 5;

// Modes: "attack", "building", "chill"
var modes : String [] = ["attack", "building", "chill"];
var currentMode : String = "attack";

var getPlayerMode : String [] = ['best', 'closest', 'random'];


private var isMoving : boolean = false;
private var isAttacking : boolean = false;

private var chaseTimer : float;
private var otherPlayers : List.<GameObject>;

private var remainingBuildings : GameObject [];

private var currentlyChasingPlayer : GameObject = null;
private var currentlyChasingBuilding : GameObject = null;


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

    remainingBuildings = GameObject.FindGameObjectsWithTag('Building');
}

function WhatShouldIDo () {
    // Let's find the best other player

    var newMode : String;
    var rM : int = Random.Range(0, 100);

    // If best player, go eat (50%)
    // If worst player, also (50%)
    // Else fight (90%)
    var ourPoints : int = getPlayerObjectPoints(gameObject);
    var bestPlayer : GameObject = GetBestPlayer();
    if (null != bestPlayer && getPlayerObjectPoints(bestPlayer) < ourPoints) {
        // I'm the best player
        if (rM <= 70) newMode = "building";
        else newMode = "attack";

    } else {
        var worstPlayer : GameObject = GetWorstPlayer();

        if (null != worstPlayer && getPlayerObjectPoints(worstPlayer) > ourPoints) {
            // I'm the worst player
            if (rM <= 30) newMode = "building";
            else newMode = "attack";
        }

        else {
            // Just within the range
            if (rM <= 50) newMode = "attack";
            else newMode = "building";
        }
    }

    currentMode = newMode;

    var move : Vector3 = Vector3(0, 0, 0);
    var target : GameObject;

    if (currentMode == 'attack') {
        currentlyChasingBuilding = null;

        var rP : int = Random.Range(0, getPlayerMode.length);

        target = GetPlayerTarget(getPlayerMode[rP]);
        currentlyChasingPlayer = target;

    }

    else if (currentMode == 'building') {
        currentlyChasingPlayer = null;

        if (currentlyChasingBuilding == null) {
            target = GetClosestBuilding();
            currentlyChasingBuilding = target;
        } else {
            target = currentlyChasingBuilding;
        }
    }

    if (target != null) move = MoveTowardsTarget(target);

    return move;
}

function CanHit () : boolean {

    var distance : float;

    if (currentMode == "attack" && currentlyChasingPlayer != null) {
        distance = Vector3.Distance(gameObject.transform.position, currentlyChasingPlayer.transform.position);
        if (distance - 3 < Mathf.Epsilon) return true;
    }

    else if (currentMode == "building" && currentlyChasingBuilding != null) {
        distance = Vector3.Distance(gameObject.transform.position, currentlyChasingBuilding.transform.position);
        if (distance - 3 < Mathf.Epsilon) return true;
    }

    return false;
}

function GetClosestBuilding () {

    var retBuilding : GameObject;
    var bestDistance : float = Mathf.Infinity;

    for (var building in remainingBuildings) {
        if ('undefined' != building && null != building) {
            var newDist : float = Vector3.Distance(gameObject.transform.position, building.transform.position);
            if (bestDistance > newDist) {
                bestDistance = newDist;
                retBuilding = building;
            }
        }
    }

    return retBuilding;
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
        var r : int = Random.Range(0, otherPlayers.Count-1);
        target = otherPlayers[r];
    }

    return target;
}

function GetClosestPlayer () : GameObject {
    var currentClosestPlayer : GameObject = null;
    var dist = Mathf.Infinity;
    otherPlayers.ForEach(function(elem) {
        if (isPlayerAlive(elem)) {
            if (Vector3.Distance(elem.transform.position, gameObject.transform.position) < dist) {
                dist = Vector3.Distance(elem.transform.position, gameObject.transform.position);
                currentClosestPlayer = elem;
            }
        } else {
            otherPlayers.Remove(elem);
        }
    });

    return currentClosestPlayer;
}

function GetBestPlayer () : GameObject {
    var currentBestPlayer : GameObject = null;
    var bestScore : int = -1;

    otherPlayers.ForEach (function(elem){
        if (isPlayerAlive(elem)) {
            if (currentBestPlayer == null) currentBestPlayer = elem;
            else {
                var tempScore = getPlayerObjectPoints(elem);
                if (bestScore < tempScore) {
                    bestScore = tempScore;
                    currentBestPlayer = elem;
                }
            }
        } else {
            otherPlayers.Remove(elem);
        }
    });

    return currentBestPlayer;
}

function GetWorstPlayer () : GameObject {
    var currentWorstPlayer : GameObject = null;
    var worstScore : int = Mathf.Infinity;

    otherPlayers.ForEach (function(elem){
        if (isPlayerAlive(elem)) {
            if (currentWorstPlayer == null) currentWorstPlayer = elem;
            else {
                var tempScore = getPlayerObjectPoints(elem);
                if (worstScore > tempScore) {
                    worstScore = tempScore;
                    currentWorstPlayer = elem;
                }
            }
        } else {
            otherPlayers.Remove(elem);
        }
    });

    return currentWorstPlayer;
}

function getPlayerObjectPoints (playerObject : GameObject) : int {
    return playerObject.GetComponent.<PlayerController>().playerInfo.points;
}

function isPlayerAlive (playerObject : GameObject) : boolean {
    return playerObject != null;
}
