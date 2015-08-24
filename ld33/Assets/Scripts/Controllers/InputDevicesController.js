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

enum ActionButton
{
	ATTACK,
	BACK,
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
    	if (dev != null && player != null)
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
		devicesCount++;

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

    public function DebugDevices() 
    {
    	Debug.Log("Devstate--------------");
    	for (var dev : CompatibleDevice in devices)
    	{
    		Debug.Log(dev + " isused=" + dev.isUsed + " name=" + dev.name);
    	}
    }

	// Returns the last device that pressed submit key
    public function GetCurrentlySubmittingDevice()
    {
    	Debug.Log("GetCurrentlySubmittingDevice");
    	if (Input.GetKey("space") || Input.GetKey("enter") || Input.GetMouseButtonDown(0))
    	{
	    	Debug.Log("GetCurrentlySubmittingDevice:IsKeyboard");
    		return (devices[0]); // keyboard
    	}
    	for (var dev : CompatibleDevice in devices)
    	{
    		if (dev.isKeyboard)
    			continue ;
    		if (dev.isJoystick)
    		{
    			if (Input.GetKey("joystick "+ (dev.joystickId) +" button 0")) {
	    			Debug.Log("GetCurrentlySubmittingDevice:isJoystick " + dev.joystickId);
    				return (dev);
    			}
    		}
    	}
    	Debug.Log("GetCurrentlySubmittingDevice:NULL => Mouse click/KB");
    	return (devices[0]);
    }

    public function GetAxisForDevice(axisName: String, dev: CompatibleDevice) : float
    {
    	if (dev != null)
    	{
    		if (dev.isKeyboard) {
    			if (axisName == "Vertical") {
	    			return (Input.GetKey("up") ? 1 : (Input.GetKey("down") ? -1 : 0));
	    		}
    			if (axisName == "Horizontal") {
	    			return (Input.GetKey("right") ? 1 : (Input.GetKey("left") ? -1 : 0));
	    		}
    		}
    		if (dev.isJoystick) {
    			if (axisName == "Vertical") {
    				if (Input.GetKey("joystick "+ (dev.joystickId) +" button 5"))
    				{
						return (1);   
    				}
    				else if (Input.GetKey("joystick "+ (dev.joystickId) +" button 6"))
    				{
						return (-1);   
    				}
    				else 
    				{
	    				return (-Input.GetAxis("VJoy"+(dev.joystickId)+""));    					
    				}
    			} else if (axisName == "Horizontal") {
    				if (Input.GetKey("joystick "+ (dev.joystickId) +" button 7"))
    				{
						return (1);   
    				}
    				else if (Input.GetKey("joystick "+ (dev.joystickId) +" button 8"))
    				{
						return (-1);   
    				}
    				else 
    				{
    					return (Input.GetAxis("HJoy"+(dev.joystickId)+""));
	    			}
    			}
    		}
    	}
    	return (0);
    }

    public function GetButtonForDevice(btnId: ActionButton, dev: CompatibleDevice) : boolean
    {
    	var res : boolean = false;

    	if (dev != null)
    	{
    		if (dev.isKeyboard) 
            {
    			switch (btnId)
    			{
    				case ActionButton.ATTACK:
    					res = Input.GetKeyDown("space");
    					break;
    				default:
	    				break;
    			}
    		}
    		else if (dev.isJoystick) 
            {
    			switch (btnId)
    			{
    				case ActionButton.ATTACK:
    					res = Input.GetKeyDown("joystick "+ (dev.joystickId) +" button 0");
    					break;
    				default:
	    				break;
    			}
    		}
    	}
    	return (res);
    }
}