#pragma strict

class Character
{
	public var name: String = "Unknown";
	public var uid: int = -1;

	public var prefab: GameObject;
	public var logoMini: Sprite;
	public var logoMedium: Sprite;

	public var selectSound : AudioClip;
}