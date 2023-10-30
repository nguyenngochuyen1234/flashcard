import { View, StyleSheet } from 'react-native'
import React, {useEffect, useState} from 'react'
import { Text, IconButton, Button } from 'react-native-paper'
import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { FIREBASE_DB } from '../../firebaseConfig';
export interface Collection {
  categoryName: string;
  id: string;
  description: string;
  name: string
  cards: any[]
}
export default function Summarize({ navigation, route }) {
  const [cardMemmoried,setCardMemmoried] = useState([])
  const [collectionApi, setCollectionApi] = useState<Collection | null>()
  const [cards, setCards] = useState([])

  useEffect(() => {
    if (route.params?.cards) {
      let cardsParams = route.params?.cards
      if(cardsParams){
        console.log({cardsParams})
        setCards(cardsParams)
        let cardMemmoriedParams = cardsParams.filter((card:any)=>card.isMemorised)
        setCardMemmoried(cardMemmoriedParams)
        setCollectionApi(route.params?.collectionApi)
      }
    }
  }, [route.params?.cards]);

  return (
    <View style={styles.containerHome}>
      <View style={{ position: 'relative', height: 600 }}>
        <View style={styles.head}>
          <IconButton
            icon="check-circle"
            size={50}
            containerColor='#fff'
            style={{ borderWidth: 7 }}
            iconColor="green"
            mode='outlined'
          />

          <Text style={{ color: '#fff', fontSize: 35, lineHeight: 50, marginBottom: 15, fontWeight: "600" }} variant="displayLarge" >Thực hành hoàn tất</Text>

        </View>
        <View style={styles.containerCard}>
          <View style={styles.card}>
            <Text style={{ color: '#000', fontSize: 30, lineHeight: 35, marginBottom: 15, fontWeight: "600" }} variant="displayLarge" >Tổng kết</Text>
            <Text style={{ color: 'green', fontSize: 24, lineHeight: 25, marginBottom: 15, fontWeight: "600" }} variant="displayLarge" >Số từ đã học được: {cardMemmoried.length}</Text>
            <Text style={{ color: 'red', fontSize: 24, lineHeight: 25, marginBottom: 15, fontWeight: "600" }} variant="displayLarge" >Số từ còn lại:{cards.length - cardMemmoried.length - 1}</Text>
            <Button mode="outlined" onPress={() => console.log('Pressed')}>
              Xem kết quả
            </Button>
          </View>
        </View>

      </View>

      <View style={styles.groupIcon}>
        <Button mode="outlined" onPress={() => navigation.goBack({ cards, collectionApi })}>
          Lặp lại thẻ
        </Button>
        <Button mode="contained" onPress={() => navigation.navigate('Flashcards')}>
          Hoàn thành
        </Button>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  containerHome: {
    flex: 1,
    backgroundColor: '#e5e5ef'
  },
  head: {
    height: 280,
    backgroundColor: '#6750a4',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    padding: 30,
    alignItems: "center",
  },
  containerCard: {
    position: 'absolute',
    top: 170,
    left: '50%',
    transform: [{ translateX: -150 }],
    width: 300,

  },
  card: {
    flex: 1,
    borderRadius: 30,
    backgroundColor: '#FFF',
    marginLeft: "auto",
    marginRight: "auto",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingVertical: 15,
  },
  ProgressBar: {
    marginHorizontal: 60,
  },
  groupIcon:{
    justifyContent: 'space-around', 
    alignContent: 'center', 
    flexDirection: 'row', 
    position:'absolute', 
    bottom:0, 
    width:'100%',
    paddingVertical:20,
  }

})
