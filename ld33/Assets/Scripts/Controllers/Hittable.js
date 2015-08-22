#pragma strict


public var hitParticleSystem: ParticleSystem;
public var dieParticleSystem: ParticleSystem;

function Start () {

}

function Update () {

}

function GetHit(damage:int) {
	hitParticleSystem.Play();
}

function die() {
	dieParticleSystem.Play();
}