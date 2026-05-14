import HomePageClient from "@/components/HomePageClient";
import { isDevPaymentBypassBuildtime } from "@/lib/dev-payment-bypass";
import { resolvePublicWhopUrl } from "@/lib/whop-links";
import { resolveWhopKitAppUrl } from "@/lib/whop-site-url";

export default function Home() {
  const starterWhopLink = resolvePublicWhopUrl(
    process.env.NEXT_PUBLIC_WHOP_STARTER_URL,
  );
  const proWhopLink = resolvePublicWhopUrl(process.env.NEXT_PUBLIC_WHOP_PRO_URL);

  const whopExperienceId = process.env.NEXT_PUBLIC_WHOP_EXPERIENCE_ID?.trim() ?? "";
  const whopKitAppUrl = resolveWhopKitAppUrl(whopExperienceId) ?? undefined;

  const experienceIdForDevSkip =
    process.env.NEXT_PUBLIC_DEV_BYPASS_EXPERIENCE_ID?.trim() ||
    whopExperienceId ||
    "dev-local-experience";
  const bypass = isDevPaymentBypassBuildtime();
  const devBypassStarterHref = bypass
    ? `/experiences/${encodeURIComponent(experienceIdForDevSkip)}/document?dev_kit_tier=starter`
    : undefined;
  const devBypassProHref = bypass
    ? `/experiences/${encodeURIComponent(experienceIdForDevSkip)}/document?dev_kit_tier=pro`
    : undefined;

  return (
    <HomePageClient
      starterWhopLink={starterWhopLink}
      proWhopLink={proWhopLink}
      devBypassStarterHref={devBypassStarterHref}
      devBypassProHref={devBypassProHref}
      whopKitAppUrl={whopKitAppUrl}
    />
  );
}
