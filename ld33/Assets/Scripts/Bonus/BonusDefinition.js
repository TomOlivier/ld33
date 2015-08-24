#pragma strict

public class BonusDefinition {
	public var multiplier : float = 1;
	public var flatValue : float = 0;
	public var duration : float = 1; // 0 for infinite

	public function BonusDefinition(m:float,f:float,d:float) {
		multiplier = m;
		flatValue = f;
		duration = d;
	}
}