import React from 'react';
import { View } from 'react-native';
import { Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { colors } from '../../src/styles/colors';
import { useLanguage } from '../../src/contexts/LanguageContext';
import { OfflineIndicator } from '../../src/components/common/OfflineIndicator';
import { HeaderLogo } from '../../src/components/common/HeaderLogo';
import { useApp } from '../../src/contexts/AppContext';

function TabBarIcon({ name, color }) {
  return <FontAwesome size={24} name={name} color={color} style={{ marginBottom: -3 }} />;
}

export default function TabLayout() {
  const { t } = useLanguage();
  const { draftCount } = useApp();
  const draftBadge = draftCount > 0 ? draftCount : undefined;

  return (
    <View style={{ flex: 1 }}>
      <OfflineIndicator />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.primaryLight,
          tabBarInactiveTintColor: colors.textLight,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            borderTopWidth: 1,
          },
          headerStyle: {
            backgroundColor: colors.backgroundSecondary,
            borderBottomColor: colors.border,
            borderBottomWidth: 1,
          },
          headerTintColor: colors.textDark,
          headerTitleStyle: {
            fontWeight: 'bold',
            color: colors.textDark,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: t('tabs.home'),
            tabBarIcon: ({ color }) => <TabBarIcon name="edit" color={color} />,
            headerTitle: () => <HeaderLogo title={t('submission.title')} />,
          }}
        />
        <Tabs.Screen
          name="track"
          options={{
            title: t('tabs.track'),
            tabBarIcon: ({ color }) => <TabBarIcon name="search" color={color} />,
            headerTitle: () => <HeaderLogo title={t('tracking.title')} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: t('tabs.settings'),
            tabBarIcon: ({ color }) => <TabBarIcon name="cog" color={color} />,
            headerTitle: () => <HeaderLogo title={t('settings.title')} />,
            tabBarBadge: draftBadge,
            tabBarBadgeStyle: draftBadge ? { backgroundColor: colors.primary, fontSize: 10 } : undefined,
          }}
        />
      </Tabs>
    </View>
  );
}
