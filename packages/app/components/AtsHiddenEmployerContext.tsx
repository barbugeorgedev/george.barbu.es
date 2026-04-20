import React from "react";
import { Text } from "react-native";

type Props = {
  employer: string;
  jobTitle: string;
  dateRange: string;
  /** e.g. from formatDurationLabel — " (2 ani)" */
  durationSuffix?: string;
};

/**
 * Visually hidden (sr-only); text stays in the DOM for ATS/HR parsers and screen readers
 * when several roles are grouped under one visible employer heading.
 */
export const AtsHiddenEmployerContext: React.FC<Props> = ({
  employer,
  jobTitle,
  dateRange,
  durationSuffix = "",
}) => {
  const emp = employer?.trim();
  if (!emp) return null;
  const dur = durationSuffix?.trim();
  return (
    <Text className="sr-only">
      {`Job title: ${jobTitle}. Employer: ${emp}. Dates: ${dateRange}.`}
      {dur ? ` ${dur}` : ""}
    </Text>
  );
};
