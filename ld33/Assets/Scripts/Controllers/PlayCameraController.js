#pragma strict

var gameController: GameController;

private var speed : float = 6.0f;
private var startPosition : Vector3;
private var endPosition: Vector3;
private var startTime: float;
private var journeyLength: float;

function Start () {
	startTime = Time.time;
	startPosition = transform.position;
	journeyLength = Vector3.Distance(startPosition, endPosition);
}

function Update () {
	if (gameController.activeState == GameState.PLAYING) {

		var distCovered = (Time.time - startTime) * speed;
		var fracJourney = distCovered / journeyLength;

		transform.position = Vector3.Lerp(startPosition, endPosition, fracJourney);

		if (journeyLength - distCovered < Mathf.Epsilon) {
			startTime = Time.time;
			startPosition = transform.position;
			endPosition = GetNewPos();
			journeyLength = Vector3.Distance(startPosition, endPosition);
		}
	}
}

function GetNewPos () {
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

	return new Vector3(pos.x, pos.y, zDist);
}