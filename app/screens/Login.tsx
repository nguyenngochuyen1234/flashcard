import { View, StyleSheet, Image, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { Text, TextInput, Button } from 'react-native-paper'
import { FIREBASE_AUTH } from '../../firebaseConfig'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { showMessage, hideMessage } from 'react-native-flash-message'
export default function Login({ navigation }) {
  const auth = FIREBASE_AUTH
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false);
  const singIn = async () => {
    setLoading(true)
    try {
      const res = await signInWithEmailAndPassword(auth, email, password)
      if (res) {
        showMessage({
          message: "Bạn đã đăng nhập thành công",
          type: "success"
        })
      } else {
        showMessage({
          message: "Tên đăng nhập hoặc mật khẩu không chính xác",
          type: "danger"
        })
      }
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }
  return (
    <ScrollView>
      <View style={styles.containerHome}>
        <Image source={require('../../assets/images/pana.png')} style={{ height: 300, width: 300 }} />
        <Text style={styles.title}>Đăng nhập</Text>
        <View style={styles.form}>
          <TextInput disabled={isLoading} label="Email" autoCorrect={false} defaultValue={''} onChangeText={(text) => setEmail(text)} mode='outlined' />
          <TextInput disabled={isLoading} label="Mật khẩu" secureTextEntry={!showPassword}
            right={<TextInput.Icon icon={showPassword ? "eye" : "eye-off"} onPress={() => setShowPassword(!showPassword)} />} autoCorrect={false} style={{ marginVertical: 5 }} defaultValue={''} onChangeText={(text) => setPassword(text)} mode='outlined' />
        </View>
        <Button disabled={isLoading} mode="contained" style={{ width: '100%', borderRadius: 10, marginVertical: 30 }} onPress={singIn}>Đăng nhập</Button>
        <Text style={{ marginTop: 50 }}>Bạn chưa có tài khoản? <Text style={{ color: '#6750a4', fontWeight: "700", }} onPress={() => navigation.navigate('Register')}>Đăng ký</Text></Text>
      </View>
    </ScrollView>

  )
}
const styles = StyleSheet.create({
  containerHome: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    alignItems: 'center'
  },
  title: {
    fontSize: 25,
    fontWeight: "800",
    lineHeight: 30,
    color: '#6750a4',
    marginVertical: 10,
  },
  form: {
    width: '100%'
  }
})