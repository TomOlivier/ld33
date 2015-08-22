#pragma strict

class CompatibleDevice
{
	public var isJoystick : boolean;
	public var joystickId : int;
	public var isUsed : boolean;
	public var isValid : boolean;
	public var isKeboard : boolean;
}

class InputDevicesController
{
    private static var Instance : InputDevicesController = new InputDevicesController();


    public var devices : CompatibleDevice[];
    public var devicesCount : int = 0;

    public static function GetInstance() : InputDevicesController
    {
        return Instance;
    }
   
    //though I don't know if in UnityScript if you can have a private constructor, guess we'll find out!
    //If not, just don't call it.
    private function InputDevicesController()
    {
        //if the constructor must be public, you can do this:
        if (Instance != null)
        {
            Debug.LogError("This is a singleton class!  Use InputDevicesController.GetInstance() instead!");
            return ;
        }
        LoadDevices();
    }

    public function GetAvailableKeyboard() : CompatibleDevice
    {
    	return GetAvailableDevice(true, false);
    }

    public function GetAvailableJoypad() : CompatibleDevice
    {
    	return GetAvailableDevice(false, true);
    }

    public function GetAvailableDevice(kb : boolean, jp : boolean) : CompatibleDevice
    {
    	
    }

    public function AssignDeviceToPlayer(dev : CompatibleDevice, player : Player)
    {
    	dev.isUsed = true;
    	player.device = dev;
    }

    public function LoadDevices()
    {
    	Debug.Log("Controller listing started");
    	for (var js in Input.GetJoystickNames())
        {
        	devicesCount++;
        	Debug.Log("Controller: " + js + " functionnal");
        }
    }
}