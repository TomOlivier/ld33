#pragma strict

var gameController: GameController;

function Start () {

}

function Update () {
	if (gameController.activeState == GameState.PLAYING) {
		var pos : Vector3;
		var pltp : Vector3;
		var cnt : float = 0.0f;
		var topScale : float = 1.0f;
		var zDist = 0.0f;
		
		for (var pl in gameController.playersManager.players)
		{
			if (pl.isActive && pl.isAlive)
			{
				var lc = pl.playerInstance.transform.localScale;

				pltp = pl.playerInstance.transform.position;
				pos += pltp;
				cnt++;
				if (lc.x > topScale)
					topScale = lc.x;
			}
		}
		pos = new Vector3(pos.x / cnt, pos.y / cnt, 0);
		pltp.z = 0;
		zDist = 10.0f + 2.0f * topScale + 1.50f * Mathf.Abs(Vector3.Distance(pos, pltp));
		pos.y += zDist * 0.1;

		this.transform.position = new Vector3(pos.x, pos.y, zDist);
	}
}