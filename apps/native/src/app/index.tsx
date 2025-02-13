import React, { useState, useEffect } from "react";
import { StatusBar, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NetInfo from "@react-native-community/netinfo";
import { ApolloProvider } from "@apollo/client";
import Home from "@screens/Home";
import Offline from "@screens/Offline";
import client from "libs/graphql/apolloClient";

const HomePage: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected ?? false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (isConnected === null) {
    return (
      <SafeAreaView className="flex-1">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <StatusBar barStyle="dark-content" backgroundColor="#525659" />
      {isConnected ? (
        <ApolloProvider client={client}>
          <Home />
        </ApolloProvider>
      ) : (
        <Offline />
      )}
    </SafeAreaView>
  );
};

export default HomePage;