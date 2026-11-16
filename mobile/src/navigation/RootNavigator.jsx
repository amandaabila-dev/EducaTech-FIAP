import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BrandHeader from '../components/BrandHeader';
import ProtectedScreen from '../components/ProtectedScreen';
import { useAuth } from '../contexts/AuthContext';
import AdminPostsScreen from '../screens/AdminPostsScreen';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import PostFormScreen from '../screens/PostFormScreen';
import PostScreen from '../screens/PostScreen';
import StudentFormScreen from '../screens/StudentFormScreen';
import StudentsScreen from '../screens/StudentsScreen';
import TeacherFormScreen from '../screens/TeacherFormScreen';
import TeachersScreen from '../screens/TeachersScreen';
import theme from '../theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const headerStyle = {
  headerStyle: { backgroundColor: theme.colors.ink, elevation: 0, shadowOpacity: 0 },
  headerTintColor: theme.colors.textInverse,
  headerTitle: () => <BrandHeader />,
};

const tabIcons = {
  Home: { focused: 'book', outline: 'book-outline' },
  Admin: { focused: 'create', outline: 'create-outline' },
  Teachers: { focused: 'school', outline: 'school-outline' },
  Students: { focused: 'people', outline: 'people-outline' },
};

function HeaderAuthButton({ navigation }) {
  const { isAuthenticated, logout } = useAuth();

  return (
    <Pressable
      onPress={() => (isAuthenticated ? logout() : navigation.navigate('Login'))}
      style={{ paddingHorizontal: 12 }}
    >
      <Text style={{ color: theme.colors.textInverse, fontWeight: '700' }}>
        {isAuthenticated ? 'Sair' : 'Entrar'}
      </Text>
    </Pressable>
  );
}

function withAuth(Component) {
  return function GuardedScreen(props) {
    return (
      <ProtectedScreen navigation={props.navigation}>
        <Component {...props} />
      </ProtectedScreen>
    );
  };
}

const GuardedPostFormScreen = withAuth(PostFormScreen);
const GuardedTeacherFormScreen = withAuth(TeacherFormScreen);
const GuardedStudentFormScreen = withAuth(StudentFormScreen);

function MainTabs() {
  const { isAuthenticated } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={({ navigation, route }) => ({
        ...headerStyle,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          height: 62,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ focused, color, size }) => {
          const icons = tabIcons[route.name] || tabIcons.Home;
          return <Ionicons name={focused ? icons.focused : icons.outline} size={size} color={color} />;
        },
        headerRight: () => <HeaderAuthButton navigation={navigation.getParent()} />,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Postagens' }} />
      {isAuthenticated ? (
        <>
          <Tab.Screen name="Admin" component={AdminPostsScreen} options={{ tabBarLabel: 'Admin' }} />
          <Tab.Screen name="Teachers" component={TeachersScreen} options={{ tabBarLabel: 'Professores' }} />
          <Tab.Screen name="Students" component={StudentsScreen} options={{ tabBarLabel: 'Alunos' }} />
        </>
      ) : null}
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  const { ready } = useAuth();

  if (!ready) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={headerStyle}>
        <Stack.Screen name="Tabs" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="Post" component={PostScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="PostForm" component={GuardedPostFormScreen} />
        <Stack.Screen name="TeacherForm" component={GuardedTeacherFormScreen} />
        <Stack.Screen name="StudentForm" component={GuardedStudentFormScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
