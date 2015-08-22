#pragma strict

import System.Collections.Generic;

@System.Serializable
class CompatibleDevice
{
	public var isJoystick : boolean = false;
	public var joystickId : int = -1;
	public var isUsed : boolean = false;
	public var isValid : boolean = true;
	public var isKeyboard : boolean = false;
	public var name : String = "Unknown Device";
}

class InputDevicesController
{
    private static var Instance : InputDevicesController = new InputDevicesController();


    public var devices : List.<CompatibleDevice>;
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
        devices = new List.<CompatibleDevice>();
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
    	for (var dev : CompatibleDevice in devices)
    	{
    		if (dev.isUsed)
    			continue;
    		if ((kb && dev.isKeyboard) || (jp && dev.isJoystick)) 
    			return (dev);
    	}
    	return (null);
    }

    public function AssignDeviceToPlayer(dev : CompatibleDevice, player : Player)
    {
    	if (dev != null)
		{
			dev.isUsed = true;
    		player.device = dev;
    		return (true);
    	}
    	return (false);
    }

    public function UnassignDeviceFromPlayer(dev : CompatibleDevice, player : Player)
    {
    	if (dev != null)
    	{
    		dev.isUsed = false;
    		player.device = null;
    		return (true);
    	}
    	return (false);
    }

    public function LoadDevices()
    {
    	devices.Clear();

		var res : CompatibleDevice = new CompatibleDevice();
		res.isKeyboard = true;
    	res.isUsed = false;
    	res.isJoystick = false;
    	res.isValid = true;
    	res.name = "Keyboard";
    	devices.Add(res);

    	Debug.Log("Controller listing started");
    	for (var js in Input.GetJoystickNames())
        {
        	res = new CompatibleDevice();
        	res.isKeyboard = false;
        	res.isUsed = false;
        	res.isJoystick = true;
        	res.joystickId = devicesCount;
        	res.isValid = true;
        	res.name = js;
        	devices.Add(res);

        	devicesCount++;
        	Debug.Log("Controller: " + js + " functionnal");
        }
    }
}