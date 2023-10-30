import { View, StyleSheet, Image, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { Text, TextInput, Button, Snackbar } from 'react-native-paper'
import { FIREBASE_AUTH } from '../../firebaseConfig'
import { createUserWithEmailAndPassword } from 'firebase/auth'
export default function Register({ navigation }) {
  const auth = FIREBASE_AUTH
  const [visible, setVisible] = React.useState(false);
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [reEnterPassword, setReEnterPassword] = useState('')
  const [showReEnterPassword, setShowReEnterPassword] = useState(false)
  const [isLoading, setIsloading] = useState(false)
  const [showPassword, setShowPassword] = useState(false);
  const singUp = async () => {
    setIsloading(true)
    try {
      if (email && password && password === reEnterPassword) {
        await createUserWithEmailAndPassword(auth, email, password)
        setVisible(true)
      }
    } catch (err) {
      console.log({ err })
    } finally {
      setIsloading(false)
    }
  }

  return (
    <ScrollView>
    <View style={styles.containerHome}>
      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(!visible)}
        action={{
          label: 'Xong',
          onPress: () => {
            // Xử lý khi người dùng nhấn vào nút Xong
            setVisible(false);
          },
        }}
        style={styles.snackbar} // Thêm kiểu CSS để đặt Snackbar ở đầu
      >
        Đây là nội dung của Snackbar.
      </Snackbar>
      <Image source={require('../../assets/images/singup.png')} style={{ height: 300, width: 300 }} />
      <Text style={styles.title}>Đăng ký</Text>
      <View style={styles.form}>
        <TextInput disabled={isLoading} label="Email" autoCorrect={false} defaultValue={''} onChangeText={(text) => setEmail(text)} mode='outlined' />
        <TextInput disabled={isLoading} secureTextEntry={!showPassword} right={<TextInput.Icon icon={showPassword?"eye":"eye-off"} onPress={()=>setShowPassword(!showPassword)}/>} label="Mật khẩu" autoCorrect={false} style={{ marginVertical: 5 }} defaultValue={''} onChangeText={(text) => setPassword(text)} mode='outlined' />
        <TextInput disabled={isLoading} secureTextEntry={!showReEnterPassword} right={<TextInput.Icon icon={showReEnterPassword?"eye":"eye-off"} onPress={()=>setShowReEnterPassword(!showReEnterPassword)}/>} label="Nhập lại mật khẩu" autoCorrect={false} defaultValue={''} onChangeText={(text) => setReEnterPassword(text)} mode='outlined' />
      </View>
      <Button mode="contained" disabled={isLoading} style={{ width: '100%', borderRadius: 10, marginVertical: 30 }} onPress={singUp}>Đăng ký</Button>
      <Text style={{}}>Bạn đã có tài khoản? <Text style={{ color: '#6750a4', fontWeight: "700" }} onPress={() => navigation.navigate('Login')}>Đăng nhập</Text></Text>
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
  },
  snackbar: {
    left: 0,
    margin: 10,
  }
})