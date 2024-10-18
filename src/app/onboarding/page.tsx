"use client";

import { AutoCompleteInput } from "@/components/onboarding/autocomplete-input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import discomData from "@/data/electricity-providers.json";
import { ChevronLeft, ChevronRight, Sun } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [discoms, setDiscoms] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    electricityProvider: "",
    monthlyBill: "",
    hasSolarPanels: false,
    solarCapacity: "",
    installationDate: "",
    hasBatteryStorage: false,
    storageCapacity: "",
    smartDevices: {
      thermostat: false,
      washingMachine: false,
      dishwasher: false,
      evCharger: false,
      other: "",
    },
    primaryGoal: "",
    notificationMethod: "",
    reportFrequency: "",
  });

  useEffect(() => {
    discomData.DISCOMs.forEach((discom) => {
      setDiscoms((prevDiscoms) => [...prevDiscoms, discom?.DISCOM!]);
    });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSmartDeviceChange = (
    device: keyof typeof formData.smartDevices,
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      smartDevices: {
        ...prevData.smartDevices,
        [device]: !prevData.smartDevices[device],
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Here you would typically send the data to your backend
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  const router = useRouter();

  const handleFormSubmit = () => {
    console.log("Form submitted:", formData);
    router.push("/dashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-[92vh] bg-gray-100">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Welcome to PrabhaWatt</CardTitle>
          <CardDescription>
            {"Let's set up your energy profile"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Energy Profile</h2>
                <div>
                  <Label htmlFor="electricityProvider">
                    Current electricity provider
                  </Label>
                  <AutoCompleteInput data={discoms} className="w-full" />
                </div>
                <div>
                  <Label htmlFor="monthlyBill">
                    Average monthly electricity bill (₹)
                  </Label>
                  <Input
                    id="monthlyBill"
                    name="monthlyBill"
                    type="number"
                    value={formData.monthlyBill}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label>Do you have solar panels?</Label>
                  <RadioGroup
                    name="hasSolarPanels"
                    value={formData.hasSolarPanels.toString()}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        hasSolarPanels: value === "true",
                      }))
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="true" id="solar-yes" />
                      <Label htmlFor="solar-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="false" id="solar-no" />
                      <Label htmlFor="solar-no">No</Label>
                    </div>
                  </RadioGroup>
                </div>
                {formData.hasSolarPanels && (
                  <>
                    <div>
                      <Label htmlFor="solarCapacity">
                        Solar system capacity (kW)
                      </Label>
                      <Input
                        id="solarCapacity"
                        name="solarCapacity"
                        type="number"
                        value={formData.solarCapacity}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="installationDate">
                        Installation date
                      </Label>
                      <Input
                        id="installationDate"
                        name="installationDate"
                        type="date"
                        value={formData.installationDate}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label>Do you have battery storage?</Label>
                      <RadioGroup
                        name="hasBatteryStorage"
                        value={formData.hasBatteryStorage.toString()}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            hasBatteryStorage: value === "true",
                          }))
                        }
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="true" id="battery-yes" />
                          <Label htmlFor="battery-yes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="false" id="battery-no" />
                          <Label htmlFor="battery-no">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    {formData.hasBatteryStorage && (
                      <div>
                        <Label htmlFor="storageCapacity">
                          Storage capacity (kWh)
                        </Label>
                        <Input
                          id="storageCapacity"
                          name="storageCapacity"
                          type="number"
                          value={formData.storageCapacity}
                          onChange={handleInputChange}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">
                  Smart Home Integration
                </h2>
                <p>Select the smart devices you own:</p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="thermostat"
                      checked={formData.smartDevices.thermostat}
                      onCheckedChange={() =>
                        handleSmartDeviceChange("thermostat")
                      }
                    />
                    <Label htmlFor="thermostat">Smart thermostat</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="washingMachine"
                      checked={formData.smartDevices.washingMachine}
                      onCheckedChange={() =>
                        handleSmartDeviceChange("washingMachine")
                      }
                    />
                    <Label htmlFor="washingMachine">
                      Smart washing machine
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="dishwasher"
                      checked={formData.smartDevices.dishwasher}
                      onCheckedChange={() =>
                        handleSmartDeviceChange("dishwasher")
                      }
                    />
                    <Label htmlFor="dishwasher">Smart dishwasher</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="evCharger"
                      checked={formData.smartDevices.evCharger}
                      onCheckedChange={() =>
                        handleSmartDeviceChange("evCharger")
                      }
                    />
                    <Label htmlFor="evCharger">EV charger</Label>
                  </div>
                  <div>
                    <Label htmlFor="otherDevices">
                      Other devices (please specify)
                    </Label>
                    <Input
                      id="otherDevices"
                      name="smartDevices.other"
                      value={formData.smartDevices.other}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Energy Goals</h2>
                <div>
                  <Label>Select your primary energy goal:</Label>
                  <RadioGroup
                    name="primaryGoal"
                    value={formData.primaryGoal}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, primaryGoal: value }))
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="reduceBills" id="reduce-bills" />
                      <Label htmlFor="reduce-bills">Reduce energy bills</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="maximizeSolar"
                        id="maximize-solar"
                      />
                      <Label htmlFor="maximize-solar">
                        Maximize use of solar energy
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="reduceCarbon" id="reduce-carbon" />
                      <Label htmlFor="reduce-carbon">
                        Reduce carbon footprint
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="gridStability"
                        id="grid-stability"
                      />
                      <Label htmlFor="grid-stability">
                        Optimize for grid stability
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Preferences</h2>
                <div>
                  <Label htmlFor="notificationMethod">
                    Preferred notification method
                  </Label>
                  <Select
                    name="notificationMethod"
                    value={formData.notificationMethod}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        notificationMethod: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select notification method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="push">Push notification</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="reportFrequency">Frequency of reports</Label>
                  <Select
                    name="reportFrequency"
                    value={formData.reportFrequency}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        reportFrequency: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select report frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          {step > 1 && (
            <Button onClick={prevStep} variant="outline">
              <ChevronLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
          )}
          {step < 4 ? (
            <Button onClick={nextStep} className="ml-auto">
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleFormSubmit}
              className="ml-auto bg-green-600 hover:bg-green-700"
            >
              Complete Setup <Sun className="ml-2 h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}