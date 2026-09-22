import client from "libs/graphql/apolloClient";
import { GET_RESUME } from "libs/graphql/queries/resume";
import { parseAtsSlug } from "app/utils/atsRoutes";

type Props = { slug?: string };

/**
 * Server-rendered `Person` schema.
 *
 * The rendered CV is client-only (`dynamic(…, { ssr: false })` over
 * react-native-web), so the HTML a crawler receives carries no name, role or
 * employer. This puts those facts in the document as structured data without
 * touching the render path.
 */
export default async function JsonLd({ slug = "/" }: Props) {
  const { baseSlug } = parseAtsSlug(slug);
  const filter =
    baseSlug === "/"
      ? { homepage: { eq: true } }
      : { slug: { current: { eq: baseSlug } } };

  let data: any;
  try {
    ({ data } = await client.query({
      query: GET_RESUME,
      variables: { filter },
      fetchPolicy: "cache-first",
    }));
  } catch {
    return null;
  }

  const header = data?.header?.[0];
  const seo = data?.seo?.[0]?.seoSection;
  const contacts = data?.sidebar?.[0]?.contactSection?.items ?? [];
  const social = data?.footer?.[0]?.social ?? [];
  const experience = data?.content?.[0]?.experienceSection?.items ?? [];
  const skills = (data?.sidebar?.[0]?.skillsSections ?? []).flatMap(
    (section: any) =>
      (section?.items ?? []).map((item: any) => item?.title).filter(Boolean),
  );

  if (!header?.fullname) return null;

  const contact = (service: string) =>
    contacts.find((c: any) => c?.service === service)?.value;

  const current = experience.find(
    (e: any) => e?.experienceDates?.presentDate === true,
  );

  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: header.fullname,
    jobTitle: header.role,
    description: seo?.seoDescription || undefined,
    url: "https://george.barbu.es",
    email: contact("email") ? `mailto:${contact("email")}` : undefined,
    telephone: contact("phone"),
    address: { "@type": "PostalAddress", addressCountry: "ES" },
    knowsAbout: skills.length ? skills : undefined,
    sameAs: social.map((s: any) => s?.url).filter(Boolean),
    ...(current?.company
      ? {
          worksFor: { "@type": "Organization", name: current.company },
          hasOccupation: {
            "@type": "Occupation",
            name: current.role,
            occupationLocation: { "@type": "Country", name: "Spain" },
          },
        }
      : {}),
  };

  return (
    <script
      type="application/ld+json"
      // Values come from our own CMS, and JSON.stringify escapes the payload.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
    />
  );
}
