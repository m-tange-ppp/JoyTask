import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";
import { TimerProvider } from "@/contexts/TimerContext";

function TabBarIcon({
  name,
  color,
}: {
  name: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
}) {
  return (
    <Ionicons size={24} style={{ marginBottom: -3 }} {...{ name, color }} />
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  return (
    <TimerProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colorScheme === "dark" ? "#000" : "#fff",
          },
          tabBarActiveTintColor: colors.text,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Timer",
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="time-outline" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="stats"
          options={{
            title: "Stats",
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="bar-chart" color={color} />
            ),
          }}
        />
      </Tabs>
    </TimerProvider>
  );
}
