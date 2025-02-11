import React, { useState, useEffect } from "react";
import Home from "@screens/Home";
import Offline from "@screens/Offline";
import { StatusBar, View, ActivityIndicator } from "react-native";
import NetInfo from "@react-native-community/netinfo";

import { ApolloProvider } from "@apollo/client";
import client from "libs/graphql/apolloClient";

const HomePage: React.FC = () => {
  // State to hold network connection status
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected ?? false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Loading state while checking network
  if (isConnected === null) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View className="flex-1">
      <StatusBar barStyle="dark-content" backgroundColor="#525659" />
      {isConnected ? (
        <ApolloProvider client={client}>
          <Home />
        </ApolloProvider>
      ) : (
        <Offline />
      )}
    </View>
  );
};

export default HomePage;
