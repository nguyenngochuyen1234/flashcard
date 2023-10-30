
import { StyleSheet, View, TouchableOpacity,  } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './app/screens/Home';
import ListFlascards from './app/screens/ListFlascards';
import Practice from './app/screens/Practice';
import Summarize from './app/screens/Summarize';
import Register from './app/screens/Register';
import Login from './app/screens/Login';
import MatchCards from './app/screens/MatchCards';
import WritingReviewCards from './app/screens/WritingReviewCards';
import { MD3LightTheme as DefaultTheme, PaperProvider, Button, configureFonts, Avatar, Text, IconButton, Dialog, Portal,  } from 'react-native-paper';
import { Provider } from 'react-redux';
import store from './redux/store';
import React, { useState, useEffect } from 'react'
import { FIREBASE_AUTH } from './firebaseConfig';
import { User, onAuthStateChanged } from 'firebase/auth';
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
  const [logOut, setLogOut] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user)
      // dispatch(saveUserData(user))
    })
  }, [])
  const handleLogOut = async () => {
    setIsLoading(true)
    try {
      FIREBASE_AUTH.signOut()

    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <PaperProvider theme={theme}>
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator>
            {user ?
              <Stack.Screen name='Flashcards' component={Home} options={{
                headerTitle: (props) => <TouchableOpacity {...props} style={{ flex: 1, alignItems: "center", flexDirection: 'row' }}>
                  <Avatar.Text
                    size={30}
                    label={user.email[0]}
                    style={{ borderRadius: 5, width: 30, height: 30, marginRight: 5 }} // Đặt borderRadius thành 0 để biến thành hình vuông
                  />
                  <Text style={{ color: "#333" }}>{user.email}</Text>
                </TouchableOpacity>,
                headerRight: (props) => <View>
                  <IconButton
                    icon="exit-to-app"
                    size={30}
                    onPress={() => setLogOut(true)}
                  />
                  <Portal>
                    <Dialog visible={logOut} onDismiss={() => setLogOut(false)}>
                      <Dialog.Content>
                        <Text>Bạn có chắc chắn muốn đăng xuất</Text>
                      </Dialog.Content>
                      <Dialog.Actions>
                        <Button disabled={isLoading} onPress={() => setLogOut(false)}>Cancel</Button>
                        <Button disabled={isLoading} onPress={handleLogOut}>Ok</Button>
                      </Dialog.Actions>
                    </Dialog>
                  </Portal>
                </View>
              }} /> :
              <>
                <Stack.Screen name='Login' component={Login} options={{ title: '' }} />
                <Stack.Screen name='Register' component={Register} options={{ title: '' }} />
              </>
            }
            <Stack.Screen
              name='ListFlashcards'
              component={ListFlascards}
              options={{ title: '' }}
            />
            <Stack.Screen name='Practice' component={Practice} options={{ title: '' }} />
            <Stack.Screen name='Summarize' component={Summarize} options={{ title: '' }} />
            <Stack.Screen name='MatchCards' component={MatchCards} options={{ title: '' }} />
            <Stack.Screen name='WritingReviewCards' component={WritingReviewCards} options={{ title: '' }} />
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
