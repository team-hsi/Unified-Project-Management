"use client";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/feature/shared/ui/dialog";
import { Separator } from "@/feature/shared/ui/separator";
import { Switch } from "@/feature/shared/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/feature/shared/ui/select";
import { useTheme } from "next-themes";
import { useLocale, useTranslations } from "next-intl";
import { Locale } from "@/i18n/config";
import { useTransition } from "react";
import { cn } from "@/lib/utils";
import { setUserLocale } from "../../../../actions/core/locale";
import { Card } from "@/feature/shared/ui/card";
import { Moon, Sun, Monitor, Globe, Calendar, Clock } from "lucide-react";

export function PreferencesView() {
  const { theme, setTheme } = useTheme();
  const locale = useLocale();
  const t = useTranslations("Preferences");
  const [isPending, startTransition] = useTransition();

  const handleLocale = (lang: string) => {
    const locale = lang as Locale;
    startTransition(() => {
      setUserLocale(locale);
    });
  };

  return (
    <div className="p-6">
      <DialogHeader>
        <DialogTitle className="text-xl">{t("title")}</DialogTitle>
        <DialogDescription>{t("description")}</DialogDescription>
      </DialogHeader>

      <div className="mt-6 space-y-6">
        {/* Appearance section */}
        <Card className="p-6 bg-gradient-to-br from-accent/5 to-primary/5 border-accent/20">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Sun className="h-5 w-5 text-primary" />
            {t("appearance.title")}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {t("appearance.description")}
          </p>

          <div className="mt-4 flex items-center justify-between">
            <div>
              <h4 className="font-medium">{t("theme.title")}</h4>
            </div>
            <Select value={theme} onValueChange={(value) => setTheme(value)}>
              <SelectTrigger className="w-[180px] bg-background hover:bg-accent/5 transition-colors duration-200">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light" className="flex items-center gap-2">
                  <Sun className="h-4 w-4" />
                  {t("theme.light")}
                </SelectItem>
                <SelectItem value="dark" className="flex items-center gap-2">
                  <Moon className="h-4 w-4" />
                  {t("theme.dark")}
                </SelectItem>
                <SelectItem value="system" className="flex items-center gap-2">
                  <Monitor className="h-4 w-4" />
                  {t("theme.system")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        <Separator />

        {/* Language & Time section */}
        <Card className="p-6 bg-gradient-to-br from-accent/5 to-primary/5 border-accent/20">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            {t("language&time.title")}
          </h3>

          <div className="mt-4 space-y-4">
            <div>
              <h4 className="font-medium">
                {t("language&time.language.title")}
              </h4>
              <p className="text-sm text-muted-foreground">
                {t("language&time.language.description")}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <div />
                <Select value={locale} onValueChange={handleLocale}>
                  <SelectTrigger className="w-[180px] bg-background hover:bg-accent/5 transition-colors duration-200">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent className={cn(isPending && "opacity-50")}>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="am">Amharic</SelectItem>
                    <SelectItem value="om">Afan Oromo</SelectItem>
                    <SelectItem value="ti">Tigrinya</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    {t("language&time.weekStart.title")}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {t("language&time.weekStart.description")}
                  </p>
                </div>
                <Switch defaultChecked disabled />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    {t("language&time.automaticTimeZone.title")}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {t("language&time.automaticTimeZone.description")}
                  </p>
                </div>
                <Switch defaultChecked disabled />
              </div>
            </div>

            <div>
              <h4 className="font-medium">
                {t("language&time.timezone.title")}
              </h4>
              <p className="text-sm text-muted-foreground">
                {t("language&time.timezone.description")}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <div />
                <Select defaultValue="gmt" disabled>
                  <SelectTrigger className="w-[280px] bg-background hover:bg-accent/5 transition-colors duration-200">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gmt">(GMT+3:00) Addis Ababa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
