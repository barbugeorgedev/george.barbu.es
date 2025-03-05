"use client";
import { useParams } from "next/navigation";
import { ResumeDataProvider } from "app/context/ResumeContext";
import { useQuery } from "@apollo/client";
import { Home } from "app/screens/Home";
import LoadingScreen from "app/screens/Loading";
import ErrorScreen from "app/screens/Error";
import dynamic from "next/dynamic";
import { TemplateProps } from "types/components";
import { ResumeData } from "types/graphql";
import { GET_RESUME } from "libs/graphql/queries/resume";
import { defaultResumeData } from "app/constants";

const Page = ({ slug }: { slug: string }) => {
  // Ensure slug is always a string
  let finalSlug = slug;
  if (Array.isArray(slug)) {
    finalSlug = slug.join("/");
  }

  const getResumeFilter = (slug: string) => {
    return slug === "/" ? { homepage: { eq: true } } : { slug: { eq: slug } };
  };

  const variables = {
    filter: getResumeFilter(finalSlug),
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
      <TemplateComponent>
        {loading ? (
          <LoadingScreen />
        ) : error ? (
          <ErrorScreen message={error.message} />
        ) : (
          <Home />
        )}
      </TemplateComponent>
    </ResumeDataProvider>
  );
};

export default Page;
