#pragma strict

public var efxSource : AudioSource;
public var musicSource : AudioSource;

public static var instance : SoundManager = null;

public var titleMusic : AudioClip;
public var characterMusic : AudioClip;
public var gameMusic : AudioClip;
public var rampageMusic : AudioClip;

private var currentMusic : String;

function Awake () {

    if (instance == null)
        instance = this;
    else if (instance != this)
        Destroy (gameObject);
    
    DontDestroyOnLoad (gameObject);
}

public function PlaySfx(clip : AudioClip){
    
    efxSource.clip = clip;
    efxSource.Play ();
}

public function PlayMusic(musicName : String){

	if(currentMusic == musicName)
		return;

	if(musicName == "titleMusic"){
    	musicSource.clip = titleMusic;
	}
	else if(musicName == "characterMusic") {
		musicSource.clip = characterMusic;
	}
	else if(musicName == "gameMusic") {
		musicSource.clip = gameMusic;
	}
	else if(musicName == "rampageMusic") {
		musicSource.clip = rampageMusic;
	}
	else
		return;
    
    musicSource.Play ();
}

function Start () {

}

function Update () {

}