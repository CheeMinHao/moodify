import { Redirect } from 'expo-router';

// later check Supabase session here
// and redirect to (auth) if not logged in
export default function Index() {
  const isLoggedIn = false;         // swap with real auth check
  const hasOnboarded = false;       // swap with AsyncStorage check

  if (!isLoggedIn) return <Redirect href="/(auth)/login" />;
  if (!hasOnboarded) return <Redirect href="/(onboarding)/step-one" />;
  return <Redirect href="/(tabs)/dashboard" />;
}

// /(auth)/login
// /(auth)/register
// /(onboarding)/step-one
// /(onboarding)/step-two
// /(onboarding)/step-three
// /(tabs)/dashboard
// /(tabs)/library
// /(tabs)/player