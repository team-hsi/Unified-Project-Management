"use client";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "next-themes";

export function PreferencesView() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="p-6">
      <DialogHeader>
        <DialogTitle className="text-xl">Preferences</DialogTitle>
        <DialogDescription>Customize your experience.</DialogDescription>
      </DialogHeader>

      <div className="mt-6 space-y-6">
        {/* Appearance section */}
        <div>
          <h3 className="text-lg font-medium">Appearance</h3>
          <p className="text-sm text-muted-foreground">
            Customize how the application looks on your device.
          </p>

          <div className="mt-4 flex items-center justify-between">
            <div>
              <h4 className="font-medium">Theme</h4>
            </div>
            <Select
              value={theme} // Bind the current theme
              onValueChange={(value) => setTheme(value)} // Update the theme
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        {/* Language & Time section */}
        <div>
          <h3 className="text-lg font-medium">Language & Time</h3>

          <div className="mt-4 space-y-4">
            <div>
              <h4 className="font-medium">Language</h4>
              <p className="text-sm text-muted-foreground">
                Change the language used in the user interface.
              </p>
              <div className="mt-2 flex items-center justify-between">
                <div />
                <Select defaultValue="english" disabled>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Start week on Monday</h4>
                  <p className="text-sm text-muted-foreground">
                    This will change how all calendars in your app look.
                  </p>
                </div>
                <Switch defaultChecked disabled />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">
                    Set timezone automatically using your location
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Reminders, notifications and emails are delivered based on
                    your time zone.
                  </p>
                </div>
                <Switch defaultChecked disabled />
              </div>
            </div>

            <div>
              <h4 className="font-medium">Timezone</h4>
              <p className="text-sm text-muted-foreground">
                Current timezone setting.
              </p>
              <div className="mt-2 flex items-center justify-between">
                <div />
                <Select defaultValue="gmt" disabled>
                  <SelectTrigger className="w-[280px]">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gmt">(GMT+3:00) Addis Ababa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
