#pragma strict

public var sfxPrefab : GameObject;
public var musicSource : AudioSource;

public static var instance : SoundManager = null;

public var titleMusic : AudioClip;
public var characterMusic : AudioClip;
public var gameMusic : AudioClip;
public var rampageMusic : AudioClip;

private var currentMusic : String;

public var maxSfx : int;
private var sfxPlayers : GameObject[];

function Awake () {

    if (instance == null){
        instance = this;
        sfxPlayers = new GameObject[maxSfx];
        for (var i : int = 0; i < maxSfx; i++) {
        	var newSfx : GameObject = Instantiate(sfxPrefab, Vector3.zero, Quaternion.identity);
        	sfxPlayers[i] = newSfx;
        }
    }
    else if (instance != this)
        Destroy (gameObject);
    
    DontDestroyOnLoad (gameObject);
}

public function PlaySfx(clip : AudioClip){
    
    for (var i = 0; i < sfxPlayers.length; i++) {
    	var currentSfxPlayer : AudioSource = sfxPlayers[i].GetComponent.<AudioSource>();
    	if(currentSfxPlayer.isPlaying)
    		continue;
	    currentSfxPlayer.clip = clip;
	    currentSfxPlayer.Play ();
	    break;
    };
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