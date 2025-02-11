import React from "react";
import { View } from "react-native";
import Sidebar from "app/components/Sidebar";
import {
  Experience,
  EarlyCareer,
  NGOExperience,
} from "app/components/Experience";
import Education from "app/components/Education";
import TopSide from "app/components/TopSide";
import { useResumeData } from "app/context/ResumeContext";

export const Home: React.FC = () => {
  const resumeData = useResumeData() ?? {};

  // Ensure headerData, sidebarData, and contentData use default values if undefined
  const headerData = resumeData.header?.[0]?.text ?? {
    fullname: "",
    role: "",
    slogan: "",
  };

  const sidebarData = resumeData.sidebar ?? {
    skillsSections: [],
    summarySection: [{ label: "", summary: "" }],
    contactSection: { label: "", items: [] },
  };

  const contentData = resumeData.content ?? {
    experienceSection: { label: "", items: [] },
    earlyCareerExperienceSection: { label: "", items: [] },
    ngoExperienceSection: { label: "", items: [] },
    educationSection: { label: "", items: [] },
  };

  return (
    <View className="printColor max-w-screen-pdf w-full relative mx-auto lg:flex lg:flex-row">
      {/* Header Section */}
      <TopSide data={{ text: headerData }} />

      {/* Sidebar Section */}
      <View className="bg-gray px-8 lg:w-2/5">
        <Sidebar
          className="pb-10 pt-10 print:pt-44 sm:pt-56"
          skills={sidebarData.skillsSections ?? []} // Ensure it's always an array
          summary={
            Array.isArray(sidebarData.summarySection)
              ? (sidebarData.summarySection[0] ?? { label: "", summary: "" })
              : (sidebarData.summarySection ?? { label: "", summary: "" })
          } // Ensure it's always an object
          contacts={sidebarData.contactSection ?? { label: "", items: [] }} // Ensure it's always an object
        />
      </View>

      {/* Main Content Section */}
      <View className="printColor bg-white px-8 lg:w-3/5">
        <View className="py-10 print:pt-48 lg:pt-60 lg:mt-5">
          <Experience
            className="bi-avoid bb-always"
            data={contentData.experienceSection ?? { label: "", items: [] }}
          />

          <EarlyCareer
            className="bi-avoid bb-always"
            data={
              contentData.earlyCareerExperienceSection ?? {
                label: "",
                items: [],
              }
            }
          />
          <NGOExperience
            className="bi-avoid bb-always"
            data={{
              label: contentData.ngoExperienceSection?.label ?? "", // Ensure label is always a string
              items: (contentData.ngoExperienceSection?.items ?? []).map(
                ({ company, role, experienceDates, duties }) => ({
                  company: company ?? "",
                  role: role ?? "",
                  experienceDates: experienceDates
                    ? {
                        startDate: experienceDates.startDate ?? "",
                        endDate: experienceDates.endDate ?? "",
                        presentDate: experienceDates.presentDate ?? false,
                      }
                    : { startDate: "", endDate: "", presentDate: false }, // Ensure a valid object
                  duties: duties ?? [],
                }),
              ),
            }}
          />

          <Education
            className="bi-avoid bb-always mt-28 mb-11"
            data={{
              label: contentData.educationSection?.label ?? "", // Ensure label is always a string
              items: (contentData.educationSection?.items ?? []).map(
                ({ institution, degree, type, certifications }) => ({
                  institution: institution ?? "",
                  degree: degree ?? "",
                  type: type ?? "Degree", // Ensure type is always a string
                  certifications: certifications ?? [],
                }),
              ),
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default Home;
