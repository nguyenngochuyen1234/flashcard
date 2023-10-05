import { View, StyleSheet, Image, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Button, Avatar, Text, Card, IconButton, Menu, Divider } from 'react-native-paper';
import AddCard from '../../components/AddCard';
import { useSelector, useDispatch } from 'react-redux'
import DialogDelete from '../../components/DialogDelete';
import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { FIREBASE_DB } from '../../firebaseConfig';

export interface Card {
  id: string
  description: string
  terminology: string
  descriptionImage: string
  terminologyImage: string
}

export default function ListFlascards({ navigation, route }) {
  const [visibleAddCard, setVisibleAddCard] = useState(false)
  const [collectionId, setCollectionId] = useState("none")
  const [categoryName, setCategoryName] = useState("none")
  const [description, setDescription] = useState("none")
  const [visibleMenu, setVisibleMenu] = useState(false)
  const [openDialogDelete, setOpenDialogDelete] = useState(false)
  const [cards, setCards] = useState<Card[]>([])
  const [countCards, setCountCards] = useState(0)
  useEffect(() => {
    if (route.params?.collectionId) {
      console.log(route.params?.collectionId)
      setCollectionId(route.params?.collectionId)
      setCategoryName(route.params?.categoryName)
      setDescription(route.params?.description)
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
        <View style={{ justifyContent: 'center', width: '100%' }}>
          <View>
            {item.terminology && <Text style={styles.cardTitle}>{item.terminology}</Text>}
            {item.description&&<Text style={styles.cardSubtitle}>{item.description}</Text>}
          </View>
          {item.terminologyImage && <Image source={{ uri: item.terminologyImage }} style={{ width: 100, height: 100 }} />}
          {!item.terminologyImage && item.descriptionImage && <Image source={{ uri: item.descriptionImage }} style={{ width: 200, height: 200 }} />}
        </View>
        <View style={{position:'absolute', top:0, right:0}}>
          <IconButton
            icon="check-circle-outline"
            size={25}
            onPress={() => console.log()}
          />

        </View>
        <View style={{position:'absolute', bottom:0, right:0}}>
        <Menu
              visible={visibleMenu == item.id}
              onDismiss={() => { setVisibleMenu(false) }}
              style={{ marginTop: -100 }}
              anchor={<IconButton
                icon="dots-vertical"
                size={25}
                onPress={() => console.log(setVisibleMenu(item.id))}
              />}>
              <Menu.Item leadingIcon="delete" onPress={() => { setOpenDialogDelete(true) ; setVisibleMenu(false) }} title="Xóa" />
              <Divider />
              <Menu.Item leadingIcon="pencil" onPress={() => { setVisibleMenu(false)}} title="Chỉnh sửa" />
            </Menu>
          

        </View>
        <DialogDelete
          title="Xóa thẻ"
          content="Bạn có chắc chắn muốn xóa thẻ này"
          id={item.id}
          collection={`collections/${collectionId}/cards`}
          openDialogDelete={openDialogDelete}
          setOpenDialogDelete={setOpenDialogDelete}
        />
      </View>
    )
  }
  return (
    <View style={styles.containerHome}>
      <View style={{ alignItems: 'flex-start', marginBottom: 10 }}>
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
        <Button mode="contained" style={{ width: 160 }} onPress={() => navigation.navigate('Practice', { collectionId, cards, categoryName, description })} icon="book">
          THỰC HÀNH
        </Button>
        <Button mode="contained" style={{ width: 160 }} onPress={() => setVisibleAddCard(true)} icon="plus">
          THÊM THẺ
        </Button>
      </View>
      <AddCard visibleAddCard={visibleAddCard} setVisibleAddCard={setVisibleAddCard} collectionId={collectionId} />

    </View>
  )
}
const styles = StyleSheet.create({
  containerHome: {
    flex: 1,
    backgroundColor: '#e5e5ef',
    padding: 15,
  },
  footerHome: {
    flex: 1,
    height:"100%",
    justifyContent: 'space-around',
    flexDirection: 'row',
    alignItems: 'center'
  },
  bodyHome: {
    height: "83%",
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: "#fff",
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingLeft:10,
    marginVertical: 7,
    borderRadius: 10,
    paddingRight:25,
  },
  cardTitle: {
    fontSize: 25,
    fontWeight: "600",
    lineHeight: 30,
  },
  cardSubtitle: {
    marginBottom: 5,
  },
  iconGroup: {
    height: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    marginRight: 5,
  }


})