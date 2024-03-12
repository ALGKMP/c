import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

// import { TRPCProvider } from "~/utils/api"; // todo: setup query client

import "../styles.css";

import { useColorScheme } from "nativewind";

import { PermissionsProvider } from "~/contexts/PermissionsContext";
import SessionProvider from "~/contexts/SessionsContext";

// This is the main layout of the app
// It wraps your pages with the providers they need
export default function RootLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <>
      {/* <TRPCProvider> */}
      {/*
          The Stack component displays the current page.
          It also allows you to configure your screens 
        */}
      <SessionProvider>
        <PermissionsProvider>
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: "#f472b6",
              },
              contentStyle: {
                backgroundColor: colorScheme == "dark" ? "#09090B" : "#FFFFFF",
              },
            }}
          />
          <StatusBar />
        </PermissionsProvider>
      </SessionProvider>
      {/* </TRPCProvider> */}
    </>
  );
}
