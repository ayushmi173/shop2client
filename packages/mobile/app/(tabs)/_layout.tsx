import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { useAuthStore } from '../../src/stores/auth';
import { spacing } from '../../src/theme/spacing';

// Custom tab bar icon with background highlight
const TabIcon = ({
  name,
  color,
  focused,
}: {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
  focused: boolean;
}) => {
  const iconName = focused ? name.replace('-outline', '') as keyof typeof Ionicons.glyphMap : name;
  
  return (
    <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
      <Ionicons name={iconName} size={22} color={color} />
    </View>
  );
};

export default function TabsLayout() {
  const { user } = useAuthStore();
  const isWorker = user?.role === 'WORKER';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary[600],
        tabBarInactiveTintColor: colors.secondary[400],
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.border.light,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingBottom: Platform.OS === 'ios' ? 25 : 10,
          paddingTop: 10,
          ...Platform.select({
            web: {
              boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.05)',
            },
            default: {
              elevation: 8,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.05,
              shadowRadius: 10,
            },
          }),
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
        headerStyle: {
          backgroundColor: colors.white,
        },
        headerTintColor: colors.text.primary,
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="home-outline" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="workers"
        options={{
          title: 'Explore',
          headerTitle: 'Find Workers',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="search-outline" color={color} focused={focused} />
          ),
        }}
      />
      {isWorker && (
        <Tabs.Screen
          name="dashboard"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color, focused }) => (
              <TabIcon name="stats-chart-outline" color={color} focused={focused} />
            ),
          }}
        />
      )}
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Saved',
          headerTitle: 'Saved Workers',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="bookmark-outline" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="person-outline" color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 44,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainerActive: {
    backgroundColor: colors.primary[50],
  },
});
