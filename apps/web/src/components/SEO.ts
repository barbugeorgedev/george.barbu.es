import { Metadata } from "next";
import client from "libs/graphql/apolloClient";
import { GET_RESUME } from "libs/graphql/queries/resume";
import { defaultResumeData } from "app/constants";

export async function generateMetadata(): Promise<Metadata> {
  try {
    // Fetch data server-side
    const { data } = await client.query({
      query: GET_RESUME,
    });

    const resumeData = data ?? defaultResumeData;

    return {
      title: resumeData?.seo?.seoSection?.seoTitle || "George Barbu CV",
      description: resumeData?.seo?.seoSection?.seoDescription || "",
      keywords: resumeData?.seo?.seoSection?.seoKeywords?.join(", "),
      icons: {
        icon: "/favicon.ico",
      },
      openGraph: {
        title: resumeData?.seo?.seoSection?.seoTitle,
        description: resumeData?.seo?.seoSection?.seoDescription,
        images: [resumeData?.seo?.seoSection?.seoImage || "/default-image.jpg"],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: resumeData?.seo?.seoSection?.seoTitle,
        description: resumeData?.seo?.seoSection?.seoDescription,
        images: [resumeData?.seo?.seoSection?.seoImage || "/default-image.jpg"],
      },
    };
  } catch (error) {
    // Fallback to default metadata if fetch fails
    return {
      title: "George Barbu CV",
      description: "Default description",
      icons: {
        icon: "/favicon.ico",
      },
    };
  }
}
