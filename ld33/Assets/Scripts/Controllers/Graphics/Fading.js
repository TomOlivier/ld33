#pragma strict

public var delay : float = 0f;
public var duration : float = 1f;
public var killOnFaded : boolean = true;
public var endColor: Color; // color to fade to
public var renderersToFade: Renderer[];
public var playOnStart : boolean;

private var elapsedTime : float;
private var startColor : Color;

private var isFading : boolean = true;

function Start () {
	isFading = playOnStart;
	startColor = renderersToFade[0].material.color;
	// ?
	//endColor = Color(startColor.r, startColor.g, startColor.b, 0.0);
}

function Update () {
	if (isFading) {
		if (elapsedTime < delay + duration) {
			elapsedTime += Time.deltaTime;
			if (elapsedTime >= delay) {
				var t : float = (elapsedTime - delay) / duration;
		 
		        var currentColor : Color = Color.Lerp(startColor, endColor, t);
		        for (var r in renderersToFade) {
					r.material.color = currentColor;
		 		}
		            /*if ( currentColor == endColor )
		            {
		                shouldFade = false;
		                startTime = 0.0f;
		                endTime = 0.0f;
		                t= 0.0f;
		            }*/
			}
		} else if (killOnFaded) {
			Destroy(this.gameObject);
		} else { // TODO: loop here ?
			isFading = false;
		}
	}
}

function fadeAgainNow(endColor) {
	elapsedTime = 0;
	delay = 0;
	duration = 10;
	endColor = endColor;
	startColor = renderersToFade[0].material.color;
	isFading = true;
}