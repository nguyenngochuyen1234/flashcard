import { View, StyleSheet, Image, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Text, ProgressBar, Dialog, Portal, IconButton } from 'react-native-paper'
import Carousel from 'react-native-snap-carousel';
import FlipCard from 'react-native-flip-card'
import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { FIREBASE_DB } from '../../firebaseConfig';
export interface Collection {
  categoryName: string;
  id: string;
  description: string;
  name: string
  cards: any[]
}
export default function Practice({ navigation, route }) {
  const [collectionId, setCollectionId] = useState("none")
  const isCarousel = React.useRef(null)
  const [collectionApi, setCollectionApi] = useState<Collection | null>()
  const [description, setDescription] = useState("none")
  const [indexCard, setIndexCard] = useState(0)
  const [cards, setCards] = useState([])
  const [idCurrent, setIdCurrent] = useState('')
  const [visibleNote, setVisibleNote] = React.useState(false);

  const hideDialog = () => setVisibleNote(false);
  useEffect(() => {
    if (route.params?.collectionApi.id) {
      setCollectionId(route.params?.collectionApi?.id)
      setCollectionApi(route.params?.collectionApi)
      let cards = route.params?.cards
      setDescription(route.params?.collectionApi?.description)
      setCards([...cards, { finish: true }])
    }
  }, [route.params?.collectionId]);

  const MemorisedCard = async () => {
    let id = ''
    let newCard = cards.map((card, idx) => {
      if (idx === indexCard) {
        id = card.id
        return {
          ...card,
          isMemorised: true
        }
      }
      else {
        return card
      }

    })
    setCards(newCard)
    if (isCarousel.current) {
      const newIndex = indexCard + 1;
      isCarousel.current.snapToItem(newIndex);
      setIndexCard(newIndex);
    }
    if (id) {
      const cardDoc = doc(FIREBASE_DB, `collections/${collectionId}/cards`, id);
      await updateDoc(cardDoc, { isMemorised: true });
    }
  }
  const NotMemorisedCard = async () => {
    let id = ''
    let newCard = cards.map((card, idx) => {
      if (idx === indexCard) {
        id = card.id
        return {
          ...card,
          isMemorised: false
        }
      }
      else {
        return card
      }

    })
    setCards(newCard)
    if (isCarousel.current) {
      const newIndex = indexCard + 1;
      isCarousel.current.snapToItem(newIndex);
      setIndexCard(newIndex);
    }
    if (id) {
      const cardDoc = doc(FIREBASE_DB, `collections/${collectionId}/cards`, id);
      await updateDoc(cardDoc, { isMemorised: false });
    }
  }

  const renderCard = ({ item, index }) => {
    if (indexCard === cards.length - 1) {
      navigation.navigate('Summarize', { cards, collectionApi })
    }
    return (
      <FlipCard flipHorizontal={true}
        flipVertical={false}
        friction={12}
      >
        <View style={styles.card}>
          {!item.finish &&

            <View style={{ padding: 20, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              {item.note && <Portal>
                <Dialog visible={visibleNote && item.id == idCurrent} onDismiss={hideDialog}>
                  <Dialog.ScrollArea>
                    <ScrollView contentContainerStyle={{ paddingHorizontal: 24 }}>
                      <Text>{item.note}</Text>
                    </ScrollView>
                  </Dialog.ScrollArea>
                </Dialog>
              </Portal>}
              {item.note && <IconButton icon="eye" style={{ position: 'absolute', top: 0, right: 0 }} iconColor={"#6750a4"} onPress={() => { setVisibleNote(true), setIdCurrent(item.id) }} />}
              {item.terminologyImage && <View style={{ height: 270, minHeight: 270, width: "100%" }}>
                <Image source={{ uri: item.terminologyImage }} style={{ width: '100%', height: 230, marginTop: 30 }} />
              </View>}
              <ScrollView contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ textAlign: 'center', marginVertical: 10, fontSize: 32, lineHeight: 35 }}>{item.terminology}</Text>
              </ScrollView>
            </View>
          }
        </View>
        <View style={styles.card}>

          <View style={{ padding: 20, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {item.note && <IconButton icon="eye" style={{ position: 'absolute', top: 0, right: 0 }} iconColor={"#6750a4"} onPress={() => { setVisibleNote(true) }} />}
            {item.descriptionImage && <Image source={{ uri: item.descriptionImage }} style={{ width: '100%', height: 230, marginTop: 30 }} />}

            <ScrollView contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ textAlign: 'center', marginVertical: 10, fontSize: 32, lineHeight: 35 }}>{item.description}</Text>
            </ScrollView>
          </View>
        </View>
      </FlipCard>
    );
  }

  return (
    <View style={styles.containerHome}>

      <View style={{ position: 'relative', height: 600 }}>
        <View style={styles.head}>
          <Text style={{ color: '#fff', fontSize: 50, lineHeight: 50, marginBottom: 15 }} variant="displayLarge" >{collectionApi?.name}</Text>
          <Text style={{ color: '#fff', fontSize: 20, lineHeight: 25 }}>{description}</Text>
        </View>
        <View style={styles.containerCard}>
          <Carousel
            style={{ width: "100%", backgroundColor: "blue" }}
            ref={isCarousel}
            data={cards}
            renderItem={renderCard}
            sliderWidth={320}
            itemWidth={300} // Set it to be less than or equal to the width of a single card
            onSnapToItem={index => setIndexCard(index)}
          />

        </View>

      </View>
      <View style={styles.ProgressBar}>
        <ProgressBar style={{ height: 15, borderRadius: 20, backgroundColor: 'rgba(120, 111,218, 0.4)' }} progress={(indexCard) / (cards.length - 1)} color='#6750a4' />
      </View>
      <View style={{ flex: 1, justifyContent: 'space-around', alignContent: 'center', flexDirection: 'row', marginTop: 10 }}>
        <IconButton icon="close-circle-outline" size={70} iconColor={"#6750a4"} disabled={indexCard < 0 || indexCard >= cards.length - 1} onPress={NotMemorisedCard} />
        <IconButton icon="check-circle-outline" size={70} iconColor={"#6750a4"} disabled={indexCard < 0 || indexCard >= cards.length - 1} onPress={MemorisedCard} />
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
  },
  containerCard: {
    position: 'absolute',
    top: 170,
    left: '50%',
    transform: [{ translateX: -160 }],
    width: 300,

  },
  card: {
    flex: 1,
    height: 410,
    width: 300,
    borderRadius: 30,
    backgroundColor: '#FFF',
    marginLeft: "auto",
    marginRight: "auto",
    position: 'relative'
  },
  ProgressBar: {
    marginHorizontal: 60,
  }

})
