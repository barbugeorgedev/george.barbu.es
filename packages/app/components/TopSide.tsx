import React from "react";
import { View, Text } from "react-native";
import { Image } from "ui/image";
import { useResumeData } from "app/context/ResumeContext";
import { useSettings } from "app/hooks/useSettings";

const TopSide: React.FC = () => {
  const settings = useSettings();
  const resumeData = useResumeData();
  const data = resumeData?.header[0];

  return (
    <View
      className="h-44 mt-48  flex flex-col content-center justify-center relative pb-0 z-50 sm:h-32 sm:top-0 sm:w-full sm:justify-center sm:mt-14 sm:absolute  print:pb-0 print:absolute print:justify-center print:h-32 print:mt-0 "
      style={{
        backgroundColor: settings?.headerBackground,
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
                    color: settings?.headerTextColor,
                  }}
                >
                  {String(data?.fullname ?? "")}
                </Text>
              )}

              {field === "role" && (
                <Text
                  className="text-[1.2rem] font-semibold font-['MontserratSemiBold'] tracking-widest text-center mb-1 sm:text-left"
                  style={{
                    color: settings.headerTextColor,
                  }}
                >
                  {String(data?.role ?? "")}
                </Text>
              )}
              {field === "slogan" && (
                <Text
                  className="text-sm leading-2 font-['MontserratSemiBold'] tracking-wide text-center sm:font-['MontserratLight'] sm:text-left"
                  style={{
                    color: settings.headerTextColor,
                  }}
                >
                  {String(data?.slogan ?? "")}
                </Text>
              )}
            </View>
          ))}
      </View>
    </View>
  );
};

export default TopSide;
