#pragma strict
@script RequireComponent(Renderer)

public var delay : float = 0f;
public var duration : float = 1f;
public var killOnFaded : boolean = true;
public var endColor: Color; // color to fade to
public var rendererToFade: Renderer;

private var elapsedTime : float;
private var startColor : Color;

function Start () {
	startColor = rendererToFade.material.color;
	// ?
	//endColor = Color(startColor.r, startColor.g, startColor.b, 0.0);
}

function Update () {
	if (elapsedTime < delay + duration) {
		elapsedTime += Time.deltaTime;
		if (elapsedTime >= delay) {
			var t : float = (elapsedTime - delay) / duration;
	 
	        var currentColor : Color = Color.Lerp(startColor, endColor, t);  
			rendererToFade.material.color = currentColor;         
	 			
	            /*if ( currentColor == endColor )
	            {
	                shouldFade = false;
	                startTime = 0.0f;
	                endTime = 0.0f;
	                t= 0.0f;
	            }*/
		}
	} else {
		Destroy(this.gameObject);
	}
	
}

function fadeAgainNow(endColor) {
	elapsedTime = duration - elapsedTime;
	delay = 0;
	endColor = startColor;
	startColor = rendererToFade.material.color;
}