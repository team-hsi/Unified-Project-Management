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
import { setUserLocale } from "@/actions/locale";
import { useTransition } from "react";
import { cn } from "@/lib/utils";

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
        <div>
          <h3 className="text-lg font-medium">{t("appearance.title")}</h3>
          <p className="text-sm text-muted-foreground">
            {t("appearance.description")}
          </p>

          <div className="mt-4 flex items-center justify-between">
            <div>
              <h4 className="font-medium">{t("theme.title")}</h4>
            </div>
            <Select
              value={theme} // Bind the current theme
              onValueChange={(value) => setTheme(value)} // Update the theme
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">{t("theme.light")}</SelectItem>
                <SelectItem value="dark">{t("theme.dark")}</SelectItem>
                <SelectItem value="system">{t("theme.system")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        {/* Language & Time section */}
        <div>
          <h3 className="text-lg font-medium">{t("language&time.title")}</h3>

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
                <Select
                  value={locale}
                  onValueChange={handleLocale}
                  // disabled={isPending}
                >
                  <SelectTrigger className="w-[180px]">
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
                  <h4 className="font-medium">
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
                  <h4 className="font-medium">
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
