"use client";

import { useState, useEffect } from "react";
import {
  Phone,
  Navigation,
  Heart,
  AlertTriangle,
  Shield,
  Volume2,
  MessageCircle,
  Map,
  Bell,
  ArrowLeft,
  Siren,
  Flashlight,
  VolumeX,
  Vibrate,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

// Extend the Window interface to include sirenAudio
declare global {
  interface Window {
    sirenAudio: {
      oscillator: OscillatorNode;
      gainNode: GainNode;
      interval: NodeJS.Timeout;
    } | null;
  }
}

// Extend MediaTrackConstraintSet to include torch
interface MediaTrackConstraintSet {
  torch?: boolean;
}

export default function Home() {
  const router = useRouter();
  const [location, setLocation] = useState<{
    latitude: number | null;
    longitude: number | null;
  }>({
    latitude: null,
    longitude: null,
  });
  const [showFirstAid, setShowFirstAid] = useState(false);
  const [isFlashlightOn, setIsFlashlightOn] = useState(false);
  const [isSirenOn, setIsSirenOn] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [emergencyContacts] = useState([
    { name: "Police", number: "911" },
    { name: "Ambulance", number: "911" },
    { name: "Fire Department", number: "911" },
    { name: "Poison Control", number: "1-800-222-1222" },
  ]);

  const firstAidInstructions = {
    "Heart Attack": [
      "Call emergency services immediately",
      "Have the person sit down and rest",
      "Loosen any tight clothing",
      "If the person is not allergic to aspirin, have them chew and swallow an aspirin",
      "Monitor breathing and consciousness",
      "Be prepared to perform CPR if needed",
    ],
    "Severe Bleeding": [
      "Apply direct pressure to the wound with a clean cloth",
      "If blood soaks through, add more cloth without removing the first layer",
      "Keep the injured area elevated above the heart",
      "Apply a tourniquet only as a last resort",
      "Call emergency services immediately",
      "Keep the person warm and calm",
    ],
    Choking: [
      'Ask "Are you choking?" - If the person nods yes and cannot speak, act immediately',
      "Give 5 back blows between the shoulder blades with the heel of your hand",
      "Give 5 abdominal thrusts (Heimlich maneuver)",
      "Alternate between 5 back blows and 5 abdominal thrusts",
      "If the person becomes unconscious, start CPR",
      "Call emergency services if the obstruction doesn't clear",
    ],
    "Stroke (FAST)": [
      "Face: Ask the person to smile - check if one side droops",
      "Arms: Ask them to raise both arms - check if one arm drifts down",
      "Speech: Ask them to repeat a simple phrase - check for slurred speech",
      "Time: If any of these signs are present, call emergency services immediately",
      "Note the time symptoms first appeared",
      "Do not give them anything to eat or drink",
    ],
    Seizure: [
      "Clear the area around the person of any hazards",
      "Ease them to the floor if they're not already lying down",
      "Turn them onto their side to help breathing",
      "Cushion their head",
      "Do NOT put anything in their mouth",
      "Time the seizure - call emergency if it lasts more than 5 minutes",
    ],
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Unable to get your location");
        }
      );
    }

    // Set up emergency shake detection
    let shakeCount = 0;
    let lastTime = new Date().getTime();

    const handleShake = (event: DeviceMotionEvent) => {
      const currentTime = new Date().getTime();
      const timeDiff = currentTime - lastTime;

      if (timeDiff > 100) {
        const acceleration = event.accelerationIncludingGravity;
        if (acceleration) {
          const shakeMagnitude = Math.sqrt(
            Math.pow(acceleration.x || 0, 2) +
              Math.pow(acceleration.y || 0, 2) +
              Math.pow(acceleration.z || 0, 2)
          );

          if (shakeMagnitude > 15) {
            shakeCount++;
            if (shakeCount >= 3) {
              activateEmergencyMode();
              shakeCount = 0;
            }
          }
        }

        lastTime = currentTime;
      }
    };

    window.addEventListener("devicemotion", handleShake);

    return () => {
      window.removeEventListener("devicemotion", handleShake);
      if (isSirenOn) {
        stopSiren();
      }
      if (isFlashlightOn && cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isSirenOn, isFlashlightOn, cameraStream]);

  const handleEmergencyCall = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  const shareLocation = async () => {
    if (location.latitude && location.longitude) {
      const message = `Emergency! I need help! My current location: https://www.google.com/maps?q=${location.latitude},${location.longitude}`;

      try {
        // Share location through available sharing methods
        if (navigator.share) {
          await navigator.share({
            title: "Emergency Location",
            text: message,
            url: `https://www.google.com/maps?q=${location.latitude},${location.longitude}`,
          });
        } else if (navigator.clipboard) {
          await navigator.clipboard.writeText(message);
          toast.success("Location copied to clipboard");
        } else {
          toast.error("Sharing not supported on this device");
        }
      } catch (error) {
        console.error("Error sharing location:", error);
        toast.error("Error sharing location");
      }
    } else {
      toast.error("Location not available");
    }
  };

  const toggleFlashlight = async () => {
    try {
      if (isFlashlightOn && cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
        setIsFlashlightOn(false);
        toast.success("Flashlight off");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities();

      if ("torch" in capabilities) {
        setIsFlashlightOn(!isFlashlightOn);
        setCameraStream(stream);
        toast.success(isFlashlightOn ? "Flashlight off" : "Flashlight on");
      } else {
        toast.error("Flashlight not supported on this device");
      }
    } catch (error) {
      console.error("Error toggling flashlight:", error);
      toast.error("Unable to control flashlight");
    }
  };

  const startSiren = () => {
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);

    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(1, audioContext.currentTime + 0.1);

    oscillator.start();

    const sirenInterval = setInterval(() => {
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.linearRampToValueAtTime(
        1200,
        audioContext.currentTime + 0.5
      );
      setTimeout(() => {
        oscillator.frequency.linearRampToValueAtTime(
          800,
          audioContext.currentTime + 0.5
        );
      }, 500);
    }, 1000);

    setIsSirenOn(true);
    window.sirenAudio = { oscillator, gainNode, interval: sirenInterval };
  };

  const stopSiren = () => {
    if (window.sirenAudio) {
      window.sirenAudio.oscillator.stop();
      clearInterval(window.sirenAudio.interval);
      setIsSirenOn(false);
      window.sirenAudio = null;
    }
  };

  const activateEmergencyMode = () => {
    // Visual alert
    document.body.style.backgroundColor = "#ff0000";
    setTimeout(() => {
      document.body.style.backgroundColor = "";
    }, 500);

    // Activate all emergency features
    if (!isSirenOn) {
      startSiren();
    }
    if (!isFlashlightOn) {
      toggleFlashlight();
    }

    // Vibration pattern
    if ("vibrate" in navigator) {
      navigator.vibrate([1000, 500, 1000, 500, 1000]);
    }

    // Share location
    shareLocation();

    // Emergency notification
    toast.error("EMERGENCY MODE ACTIVATED", {
      duration: 5000,
    });
  };

  const goBack = () => {
    router.push("/");
  };

  const handleEmergencyChat = () => {
    toast.info("Emergency chat feature is under development.");
  };

  const handleEmergencyFacilities = () => {
    toast.info("Emergency facilities feature is under development.");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={goBack}
            className="rounded-full hover:bg-accent"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-bold text-primary">
            Emergency Assistance
          </h1>
          <div className="w-10" /> {/* Spacer for alignment */}
        </div>
      </div>

      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
        {/* Emergency Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card
            className="p-6 bg-destructive text-destructive-foreground hover:opacity-90 cursor-pointer transition-all transform hover:scale-105"
            onClick={() => handleEmergencyCall("911")}
          >
            <div className="flex items-center gap-4">
              <Phone className="w-8 h-8" />
              <div>
                <h2 className="text-xl font-bold">Emergency Call</h2>
                <p>One-tap call to 911</p>
              </div>
            </div>
          </Card>

          <Card
            className="p-6 bg-primary text-primary-foreground hover:opacity-90 cursor-pointer transition-all transform hover:scale-105"
            onClick={shareLocation}
          >
            <div className="flex items-center gap-4">
              <Navigation className="w-8 h-8" />
              <div>
                <h2 className="text-xl font-bold">Share Location</h2>
                <p>Send GPS coordinates</p>
              </div>
            </div>
          </Card>

          <Card
            className="p-6 bg-orange-600 text-white hover:opacity-90 cursor-pointer transition-all transform hover:scale-105"
            onClick={activateEmergencyMode}
          >
            <div className="flex items-center gap-4">
              <AlertTriangle className="w-8 h-8" />
              <div>
                <h2 className="text-xl font-bold">Emergency Mode</h2>
                <p>Activate all alerts</p>
              </div>
            </div>
          </Card>

          <Card
            className={`p-6 ${
              isSirenOn ? "bg-red-500" : "bg-green-500"
            } text-white hover:opacity-90 cursor-pointer transition-all transform hover:scale-105`}
            onClick={() => (isSirenOn ? stopSiren() : startSiren())}
          >
            <div className="flex items-center gap-4">
              {isSirenOn ? (
                <VolumeX className="w-8 h-8" />
              ) : (
                <Siren className="w-8 h-8" />
              )}
              <div>
                <h2 className="text-xl font-bold">Emergency Siren</h2>
                <p>{isSirenOn ? "Stop Siren" : "Activate Siren"}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Tools */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            variant="outline"
            className="h-auto py-4 flex flex-col items-center gap-2"
            onClick={toggleFlashlight}
          >
            <Flashlight
              className={`w-6 h-6 ${isFlashlightOn ? "text-yellow-500" : ""}`}
            />
            <span>{isFlashlightOn ? "Turn Off Light" : "Turn On Light"}</span>
          </Button>

          <Button
            variant="outline"
            className="h-auto py-4 flex flex-col items-center gap-2"
            onClick={() => navigator.vibrate(1000)}
          >
            <Vibrate className="w-6 h-6" />
            <span>Test Vibration</span>
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="p-6 hover:shadow-lg transition-all transform hover:scale-105">
            <Heart className="w-6 h-6 text-red-500 mb-4" />
            <h3 className="font-bold mb-2">First Aid Guide</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Step-by-step emergency medical instructions
            </p>
            <Button
              onClick={() => setShowFirstAid(true)}
              variant="outline"
              className="w-full"
            >
              View Guide
            </Button>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all transform hover:scale-105">
            <Shield className="w-6 h-6 text-blue-500 mb-4" />
            <h3 className="font-bold mb-2">Emergency Contacts</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Quick access to important numbers
            </p>
            <Button variant="outline" className="w-full">
              View Contacts
            </Button>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all transform hover:scale-105">
            <Volume2 className="w-6 h-6 text-yellow-500 mb-4" />
            <h3 className="font-bold mb-2">Emergency Alerts</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Local emergency notifications
            </p>
            <Button variant="outline" className="w-full">
              Enable Alerts
            </Button>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all transform hover:scale-105">
            <MessageCircle className="w-6 h-6 text-green-500 mb-4" />
            <h3 className="font-bold mb-2">Emergency Chat</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Connect with emergency responders
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleEmergencyChat}
            >
              Start Chat
            </Button>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all transform hover:scale-105">
            <Map className="w-6 h-6 text-indigo-500 mb-4" />
            <h3 className="font-bold mb-2">Emergency Facilities</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Find nearby hospitals & shelters
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleEmergencyFacilities}
            >
              View Map
            </Button>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all transform hover:scale-105">
            <Bell className="w-6 h-6 text-rose-500 mb-4" />
            <h3 className="font-bold mb-2">SOS Signal</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Send distress signals
            </p>
            <Button variant="outline" className="w-full">
              Activate SOS
            </Button>
          </Card>
        </div>

        {/* First Aid Instructions Dialog */}
        <Dialog open={showFirstAid} onOpenChange={setShowFirstAid}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                First Aid Instructions
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {Object.entries(firstAidInstructions).map(
                ([condition, steps]) => (
                  <div
                    key={condition}
                    className="border rounded-lg p-6 bg-card"
                  >
                    <h3 className="font-bold text-xl mb-4 text-primary">
                      {condition}
                    </h3>
                    <ul className="list-disc pl-5 space-y-3">
                      {steps.map((step, index) => (
                        <li key={index} className="text-foreground">
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowFirstAid(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
