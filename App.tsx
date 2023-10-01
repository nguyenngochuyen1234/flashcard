import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './app/screens/Home';
import ListFlascards from './app/screens/ListFlascards';
import { MD3LightTheme as DefaultTheme, PaperProvider, configureFonts } from 'react-native-paper';
import { Provider } from 'react-redux';
import store from './redux/store';
const Stack = createNativeStackNavigator()

const theme = {
  ...DefaultTheme,
  fonts: configureFonts({
    config: {
      fontWeight: '300',
      letterSpacing: 0.5,
      lineHeight: 22,
      fontSize: 17,
    }
  }),
  colors: {
    ...DefaultTheme.colors,
  },
};


export default function App() {
  return (
    <PaperProvider theme={theme}>
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name='Flashcards' component={Home} />
            <Stack.Screen 
            name='ListFlashcards' 
            component={ListFlascards} 
            options={{title:''}}
             />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
