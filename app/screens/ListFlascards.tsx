import { View, StyleSheet, Image, FlatList, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Button, Avatar, Text, Card, IconButton, Menu, Divider, SegmentedButtons } from 'react-native-paper';
import AddCard from '../../components/AddCard';
import DialogDelete from '../../components/DialogDelete';
import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { FIREBASE_DB } from '../../firebaseConfig';
import * as Speech from 'expo-speech';

import axios from 'axios';
export interface Card {
  id: string
  description: string
  terminology: string
  descriptionImage: string
  terminologyImage: string
  isMemorised: boolean
  pronouceTerm: any[]
  pronouceDes: any[]
  pronouceTextDes: any[]
  pronouceTextTerm: any[]
  errMessage: string
  note:string 
}
export interface Collection {
  categoryName: string;
  id: string;
  description: string;
  name: string
  languageTerminology: string
  langDescription: string
}

export default function ListFlascards({ navigation, route }) {
  const [currentId, setcurrentId] = useState('');
  const [value, setValue] = React.useState('all');
  const [visibleAddCard, setVisibleAddCard] = useState(false)
  const [collectionId, setCollectionId] = useState("none")
  const [categoryName, setCategoryName] = useState("none")
  const [description, setDescription] = useState("none")
  const [visibleMenu, setVisibleMenu] = useState(false)
  const [openDialogDelete, setOpenDialogDelete] = useState(false)
  const [cards, setCards] = useState<Card[]>([])
  const [cardsMemorised, setCardsMemorised] = useState<Card[]>([])
  const [cardsNotMemorised, setCardsNotMemorised] = useState<Card[]>([])
  const [countCards, setCountCards] = useState(0)
  const [viewCards, setViewCards] = useState<Card[]>([])
  const [collectionApi, setCollectionApi] = useState<Collection | null>()
  const getDataWord = async (word: string) => {
    const resp = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    let phonetics = (resp.data[0].phonetics)
    if (phonetics && phonetics.length > 0 && phonetics[0].text) {
      return { pronounce: phonetics[0].text }
    }
    else if (phonetics && phonetics.length > 1  && phonetics[1].text) {
      return { pronounce: phonetics[1].text }
    }
    else if (phonetics && phonetics.length > 2 && phonetics[2].text) {
      return { pronounce: phonetics[2].text }
    }
    return;
  }
  const listAllVoiceOptions = async () => {
    try {
      const voices = await Speech.getAvailableVoicesAsync();
      console.log({ voices });
    } catch (error) {
      console.error('Error getting available voices:', error);
    }
  }

  useEffect(() => { listAllVoiceOptions() }, [])
  useEffect(() => {
    if (route.params?.collectionId) {
      setCollectionId(route.params?.collectionId)
      setCategoryName("Vi du")
      setDescription(route.params?.description)
      setCollectionApi(route.params?.collection)
    }

  }, [route.params?.collectionId]);
  useEffect(() => {
    const cardsRef = collection(FIREBASE_DB, `collections/${collectionId}/cards`)

    const fetchCards = onSnapshot(cardsRef, {
      next: (snapshot) => {
        const cardsApi: any[] = [];
        const cardsMemorisedApi: any[] = [];
        const cardsNotMemorisedApi: any[] = [];
        snapshot.docs.forEach(doc => {
          let data = {
            id: doc.id,
            ...doc.data(),
          }
          cardsApi.push(data as Card)
          if (doc.data().isMemorised) {
            cardsMemorisedApi.push(data as Card)
          } else {
            cardsNotMemorisedApi.push(data as Card)
          }
        })
        setCards(cardsApi)
        setCardsMemorised(cardsMemorisedApi)
        setCardsNotMemorised(cardsNotMemorisedApi)
        setCountCards(cardsApi.length || 0)
        setViewCards(cardsApi)
      }
    });

    return () => fetchCards();
  }, [collectionId])

  useEffect(() => {
    if (value == "cardsMemorised") {
      setViewCards(cardsMemorised)
    } else if (value == "cardsNotMemorised") {
      setViewCards(cardsNotMemorised)
    } else {
      setViewCards(cards)
    }
  }, [value])

  const speakWord = (textToSpeak: string, lang:string) => {
    Speech.speak(textToSpeak,{
      language: lang,
    });
  }
  const renderCard = ({ item }: any) => {
    return (
      <View style={styles.card}>
        <View style={{ justifyContent: 'center', width: '100%' }}>
          <View>
            {item.terminology && <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.cardTitle}>{item.terminology}</Text>
              <IconButton
                icon="volume-medium"
                size={20}
                onPress={() => speakWord(item.terminology, collectionApi?.languageTerminology)}
              />
            </View>}
            {/* {item.pronouceTextTerm.length > 0 && <Text>{item.pronouceTextTerm.join(" ")}</Text>} */}
            {item.description && <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.cardSubtitle}>{item.description}</Text>
              <IconButton
                icon="volume-medium"
                size={20}
                onPress={() => speakWord(item.description, collectionApi?.langDescription)}
              />
            </View>}
            {/* {item.pronouceTextDes.length > 0 && <Text>{item.pronouceTextDes.join(" ")}</Text>} */}
            {item.note && <Text style={styles.textNote}>{item.note}</Text>}
          </View>
          {item.terminologyImage && <Image source={{ uri: item.terminologyImage }} style={{ width: 100, height: 100, marginTop: 10 }} />}
          {!item.terminologyImage && item.descriptionImage && <Image source={{ uri: item.descriptionImage }} style={{ width: 100, height: 100, marginTop: 10 }} />}
        </View>
        <View style={{ position: 'absolute', top: 0, right: 0 }}>
          <IconButton
            icon="cards-heart-outline"
            size={25}
            onPress={() => console.log()}
          />

        </View>
        <View style={{ position: 'absolute', bottom: 0, right: 0 }}>
          <Menu
            visible={visibleMenu == item.id}
            onDismiss={() => { setVisibleMenu(false) }}
            style={{ marginTop: -100 }}
            anchor={<IconButton
              icon="dots-vertical"
              size={25}
              onPress={() => console.log(setVisibleMenu(item.id))}
            />}>
            <Menu.Item leadingIcon="delete" onPress={() => { setcurrentId(item.id); setOpenDialogDelete(true); setVisibleMenu(false) }} title="Xóa" />
            <Divider />
            <Menu.Item leadingIcon="pencil" onPress={() => { setVisibleMenu(false) }} title="Chỉnh sửa" />
          </Menu>


        </View>
        <DialogDelete
          title="Xóa thẻ"
          content="Bạn có chắc chắn muốn xóa thẻ này"
          id={currentId}
          collection={`collections/${collectionId}/cards`}
          openDialogDelete={openDialogDelete}
          setOpenDialogDelete={setOpenDialogDelete}
        />
      </View>
    )
  }
  return (
    <View style={styles.containerHome}>
      <View style={{ marginBottom: 10 }}>
        <ScrollView horizontal={true}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}>
          <SegmentedButtons
            value={value}
            onValueChange={setValue}
            style={{ width: "auto" }}
            buttons={[
              {
                value: 'all',
                label: `Tất cả: ${countCards}`,
              },
              {
                value: 'cardsMemorised',
                label: ` Đã ghi nhớ: ${cardsMemorised.length || 0}`,
              },
              {
                value: 'cardsNotMemorised',
                label: `Chưa ghi nhớ: ${cardsNotMemorised.length || 0}`
              },
            ]}
          />
        </ScrollView>
      </View>
      <View style={styles.bodyHome}>
        {cards.length > 0 ? (
          <View>
            <FlatList
              data={viewCards}
              renderItem={(item) => renderCard(item)}
              keyExtractor={(card: Card) => card.id}
            />
          </View>
        ) : <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          {value == "all" && <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Avatar.Icon size={80} icon="credit-card-edit-outline" />
            <Text style={{ marginTop: 10, fontSize: 22 }} variant="headlineMedium">Thêm thẻ đầu tiên để bắt đầu học</Text>
          </View>}
        </View>}
      </View>
      <View style={styles.footerHome}>
        <Button mode="contained" style={{ width: 160 }} onPress={() => navigation.navigate('Practice', { cards: viewCards, collectionApi })} icon="book">
          THỰC HÀNH
        </Button>
        <Button mode="contained" style={{ width: 160 }} onPress={() => setVisibleAddCard(true)} icon="plus">
          THÊM THẺ
        </Button>
      </View>
      <AddCard visibleAddCard={visibleAddCard} setVisibleAddCard={setVisibleAddCard} collectionId={collectionId} collectionApi={collectionApi}/>

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
    height: "100%",
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
    paddingLeft: 10,
    marginVertical: 7,
    borderRadius: 10,
    paddingRight: 25,
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
  },
  textNote:{
    fontSize: 15,
    fontWeight: "500",
    lineHeight: 23,
    fontStyle: 'italic', 
    color:"#333"
  }


})