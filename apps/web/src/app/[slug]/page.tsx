"use client";
import { useParams } from "next/navigation";
import { ResumeDataProvider } from "app/context/ResumeContext";
import { useQuery } from "@apollo/client";
import { Home } from "app/screens/Home";
import { HomeATS } from "app/screens/HomeATS";
import LoadingScreen from "app/screens/Loading";
import ErrorScreen from "app/screens/Error";
import dynamic from "next/dynamic";
import { TemplateProps } from "types/components";
import { ResumeData } from "types/graphql";
import { GET_RESUME } from "libs/graphql/queries/resume";
import { defaultResumeData } from "app/constants";


const Page = () => {
  const params = useParams();
  
  let slug = params?.slug || "/";

  // Ensure slug is always a string
  if (Array.isArray(slug)) {
    slug = slug.join("/");
  }

  // Check if this is an ATS version route
  // Routes: /ats (homepage) or /{slug}-ats
  const isATS = slug === "ats" || slug.endsWith("-ats");
  
  // Extract the base slug for data fetching (remove -ats suffix)
  const baseSlug = isATS 
    ? (slug === "ats" ? "/" : slug.replace(/-ats$/, ""))
    : slug;

  const getResumeFilter = (slug: string) => {
    if (slug === "/") {
      return { homepage: { eq: true } };
    } else {
      return { slug: { current: { eq: slug } } };
    }
  };

  const variables = {
    filter: getResumeFilter(baseSlug),
  };

  const { loading, error, data } = useQuery<ResumeData>(GET_RESUME, {
    variables,
    fetchPolicy: "cache-first",
  });

  // Use fetched data or fallback to default
  const resumeData = data ?? defaultResumeData;

  const selectedTemplate =
    resumeData?.settings[0]?.settings?.template || "Default";

  const TemplateComponent = dynamic(
    () =>
      import(`@templates/${selectedTemplate}`).then(
        (template) => template.default,
      ),
    { ssr: false },
  ) as React.ComponentType<TemplateProps>;

  return (
    <ResumeDataProvider value={resumeData}>
      <TemplateComponent isATS={isATS}>
        {loading ? (
          <LoadingScreen />
        ) : error ? (
          <ErrorScreen message={error.message} />
        ) : isATS ? (
          <HomeATS />
        ) : (
          <Home />
        )}
      </TemplateComponent>
    </ResumeDataProvider>
  );
};

export default Page;
