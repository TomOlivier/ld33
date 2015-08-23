#pragma strict

import System.Collections.Generic;

var playersCtrl : PlayersManager;
var scoresContainer : GameObject;
var roundNumber : UI.Text;
var winnerStr : UI.Text;

function Start () {

}

function Update () {

}

function OnShow() {
	roundNumber.text = "Round " + GameController.roundCount;
	winnerStr.text = "Player " + playersCtrl.leaderboard[0].uid + " WIN";
	
	for (var i = 0; i < 4; i++)
	{
		var obj = scoresContainer.transform.Find("PlayerScoreEntry" + i.ToString());

		if (playersCtrl.leaderboard[i].isActive)
		{
			obj.gameObject.SetActive(true);
			obj.Find("PScoreEntryContent/RankIco/Text").GetComponent(UI.Text).text = playersCtrl.leaderboard[i].rank.ToString();
			obj.Find("PScoreEntryContent/UserInfo/Name").GetComponent(UI.Text).text = "Player " + playersCtrl.leaderboard[i].uid.ToString();
			obj.Find("PScoreEntryContent/UserInfo/Points").GetComponent(UI.Text).text = playersCtrl.leaderboard[i].score.ToString() + " PTS";			
		} 
		else 
		{
			obj.gameObject.SetActive(false);
		}
	}
}