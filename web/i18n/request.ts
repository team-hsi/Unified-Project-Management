import { getUserLocale } from "@/feature/shared/actions/locale";
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  const locale = await getUserLocale();
  return {
    locale,
    messages: (await import(`./${locale}.json`)).default,
  };
});
