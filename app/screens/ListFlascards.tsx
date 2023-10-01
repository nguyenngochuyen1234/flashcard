import { View, StyleSheet, Image, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Button, Avatar, Text, Card, IconButton } from 'react-native-paper';
import AddCard from '../../components/AddCard';
import { useSelector, useDispatch } from 'react-redux'
import { openModalCategory, closeModalCategory } from '../../redux/categorySlice';
import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { FIREBASE_DB } from '../../firebaseConfig';

export interface Card {
  id: string
  description: string
  terminology: string
}

export default function ListFlascards({ navigation, route }) {
  const [visibleAddCard, setVisibleAddCard] = useState(false)
  const [collectionId, setCollectionId] = useState("none")
  const [cards, setCards] = useState<Card[]>([])
  const [countCards, setCountCards] = useState(0)
  useEffect(() => {
    if (route.params?.collectionId) {
      console.log(route.params?.collectionId)
      setCollectionId(route.params?.collectionId)
    }
  }, [route.params?.collectionId]);
  useEffect(() => {
    const cardsRef = collection(FIREBASE_DB, `collections/${collectionId}/cards`)

    const fetchCards = onSnapshot(cardsRef, {
      next: (snapshot) => {
        const cardsApi: any[] = [];
        snapshot.docs.forEach(doc => {
          console.log(doc.data())
          cardsApi.push({
            id: doc.id,
            ...doc.data()
          } as Card)
        })
        setCards(cardsApi)
        setCountCards(cardsApi.length || 0)
      }
    });

    return () => fetchCards();
  }, [collectionId])
  const renderCard = ({ item }: any) => {
    console.log({ item })
    return (
      <View style={styles.card}>
        {<Image source={{ uri: "https://tse1.mm.bing.net/th?id=OIP.iMG3CK7nCkVlcLXGG5dqXwHaJ4&pid=Api&rs=1&c=1&qlt=95&w=88&h=117" }} style={{ width: 80, height: 80}} />}
        <View style={{justifyContent:'center', alignItems:'center', width:300}}>
          <Text style={styles.cardTitle}>{item.terminology}</Text>
          <Text style={styles.cardSubtitle}>{item.description}</Text>
        </View>
        <View style={styles.iconGroup}>
          <IconButton 
            icon="check-circle-outline"
            size={30}
            onPress={()=>console.log()}
          />
          <IconButton 
            icon="dots-vertical"
            size={20}
            onPress={()=>console.log()}
          />
        </View>
      </View>
    )
  }
  return (
    <View style={styles.containerHome}>
      <View style={{ alignItems: 'flex-start' }}>
        <Button mode="contained" onPress={() => console.log("btn")}>
          Tất cả: {countCards}
        </Button>

      </View>
      <View style={styles.bodyHome}>
        {cards.length > 0 ? (
          <View>
            <FlatList
              data={cards}
              renderItem={(item) => renderCard(item)}
              keyExtractor={(card: Card) => card.id}
            />
          </View>
        ) : <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Avatar.Icon size={80} icon="credit-card-edit-outline" />
          <Text style={{ marginTop: 10, fontSize: 22 }} variant="headlineMedium">Thêm thẻ đầu tiên để bắt đầu học</Text>
        </View>}


      </View>
      <View style={styles.footerHome}>
        <Button mode="contained" onPress={() => setVisibleAddCard(true)} icon="plus">
          Thêm thẻ
        </Button>
        <AddCard visibleAddCard={visibleAddCard} setVisibleAddCard={setVisibleAddCard} collectionId={collectionId} />
      </View>

    </View>
  )
}
const styles = StyleSheet.create({
  containerHome: {
    flex: 1,
    backgroundColor: '#e5e5ef',
    padding: 10,
  },
  footerHome: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  bodyHome: {
    height: 850,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  card: {
    width:'100%',
    backgroundColor:"#fff",
    flex:1,
    flexDirection:'row',
    justifyContent:'space-between',
    padding:8,
    marginVertical:10,

  },
  cardTitle:{
    fontSize:25,
    fontWeight:"400",
  },
  cardSubtitle:{
    marginTop:5,
  },
  iconGroup:{
    height:80,
    alignItems:"center",
    justifyContent:'center'
  }
  

})