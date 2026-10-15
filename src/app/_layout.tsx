
import { Stack } from 'expo-router';
import { PlannerProvider } from '@/lib/store';
import { AppThemeProvider } from '@/lib/theme';

export default function RootLayout() {
  return <PlannerProvider><AppThemeProvider><Stack screenOptions={{ headerShown: false }}><Stack.Screen name="(tabs)" /><Stack.Screen name="task/[id]" options={{ presentation: 'modal' }} /><Stack.Screen name="class/[id]" options={{ presentation: 'modal' }} /></Stack></AppThemeProvider></PlannerProvider>;
}
