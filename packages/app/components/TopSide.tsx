import React from "react";
import { View, Text } from "react-native";
import { Image } from "ui/image";
import { useResumeData } from "app/context/ResumeContext";
import { useSettings } from "app/hooks/useSettings";

/**
 * One line of header text. The line is split on " | " / " · " and only the parts
 * that fit are shown; the rest wrap to a second, clipped line, so a part is
 * dropped whole instead of being cut mid-word or running off the page.
 */
const FitLine: React.FC<{
  text: string;
  lineHeight: number;
  className: string;
  wrapperClassName?: string;
  color?: string;
}> = ({ text, lineHeight, className, wrapperClassName, color }) => {
  const [first, ...rest] = text.trim().split(/(\s+[|·•]\s+)/);
  const parts = [first ?? ""];
  for (let i = 0; i < rest.length; i += 2) {
    // keep the separator glued to the part after it, with non-breaking spaces
    parts.push(`${(rest[i] ?? "").replace(/\s/g, "\u00A0")}${rest[i + 1] ?? ""}`);
  }

  return (
    <View
      className={wrapperClassName}
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        height: lineHeight,
        overflow: "hidden",
        width: "100%",
      }}
    >
      {parts.map((part, index) => (
        <Text
          key={index}
          className={className}
          style={{ color, lineHeight, whiteSpace: "pre" } as object}
        >
          {part}
        </Text>
      ))}
    </View>
  );
};

const TopSide: React.FC = () => {
  const settings = useSettings();
  const resumeData = useResumeData();
  const data = resumeData?.header[0];

  return (
    <View
      className="resume-pdf-topside h-44 mt-48  flex flex-col content-center justify-center relative pb-0 z-50 sm:h-32 sm:top-0 sm:w-full sm:justify-center sm:mt-14 sm:absolute  print:pb-0 print:absolute print:justify-center print:h-32 print:mt-0 "
      style={{
        backgroundColor: settings?.headerBackground?.hex,
      }}
    >
      <View className="flex relative w-full">
        <Image
          src="https://res.cloudinary.com/barbu-es/image/upload/v1732977429/george.barbu.es/profile-picture.jpg"
          alt="George Barbu Picture"
          className="w-[180px] h-[197px] !relative -translate-y-24  left-0 mx-auto z-10 sm:!absolute sm:-translate-y-12 sm:left-8 print:!absolute print:-translate-y-12 print:left-8 "
        />
      </View>
      <View
        className="flex !relative -translate-y-24 flex-col content-center text-center w-full mx-auto
                  sm:w-full sm:-translate-y-0 sm:left-1/3 sm:ml-2 sm:text-left sm:relative sm:justify-center  sm:max-w-[66.6667%]
                  print:w-4/6 print:left-1/3 print:text-left print:relative print:justify-center
                  "
      >
        {data &&
          Object.keys(data).map((field, index) => (
            <View key={index}>
              {field === "fullname" && (
                <Text
                  className="font-normal text-3xl mb-3 font-['Norwester'] tracking-wider text-center sm:text-left"
                  style={{
                    color: settings?.headerTextColor?.hex,
                  }}
                >
                  {String(data?.fullname ?? "")}
                </Text>
              )}

              {field === "role" &&
                // The CMS role may hold several lines (title, then stack); each is its own FitLine.
                String(data?.role ?? "")
                  .split(/\r?\n/)
                  .map((line) => line.trim())
                  .filter(Boolean)
                  .map((line, idx, lines) => (
                    <FitLine
                      key={idx}
                      text={line}
                      lineHeight={24}
                      className="text-[1rem] font-semibold font-['MontserratSemiBold'] tracking-wide"
                      wrapperClassName={`${idx === lines.length - 1 ? "mb-1" : ""} justify-center sm:justify-start print:justify-start`}
                      color={settings.headerTextColor?.hex}
                    />
                  ))}
              {field === "slogan" && (
                <FitLine
                  text={String(data?.slogan ?? "")}
                  lineHeight={20}
                  className="text-sm font-['MontserratSemiBold'] tracking-wide sm:font-['MontserratLight']"
                  wrapperClassName="justify-center sm:justify-start print:justify-start"
                  color={settings.headerTextColor?.hex}
                />
              )}
            </View>
          ))}
      </View>
    </View>
  );
};

export default TopSide;
