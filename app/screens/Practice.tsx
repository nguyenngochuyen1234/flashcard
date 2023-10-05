import { View, StyleSheet, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Text, ProgressBar, Button, IconButton } from 'react-native-paper'
import Carousel from 'react-native-snap-carousel';
import FlipCard from 'react-native-flip-card'
import { flattenDiagnosticMessageText } from 'typescript';
export default function Practice({ navigation, route }) {
  const [collectionId, setCollectionId] = useState("none")
  const [categoryName, setCategoryName] = useState("none")
  const [description, setDescription] = useState("none")
  const [progress, setProgress] = useState(0)
  const [cards, setCards] = useState([])
  useEffect(() => {
    if (route.params?.collectionId) {
      setCollectionId(route.params?.collectionId)
      setCategoryName(route.params?.categoryName)
      let cards = route.params?.cards
      setDescription(route.params?.description)
      setCards([...cards, { finish: true }])
    }
  }, [route.params?.collectionId]);

  const renderCard = ({ item, index }) => {
    return (
      <FlipCard flipHorizontal={true}
        flipVertical={false}
        friction={12}
      >
        <View style={styles.card}>
          {!item.finish &&

            <View style={{ padding: 20, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              {item.terminologyImage && <View style={{ height: 300, minHeight: 300, width: "100%" }}>
                <Image source={{ uri: item.terminologyImage }} style={{ width: '100%', height: 300 }} />
              </View>}
              <Text style={{ textAlign: 'center', marginVertical: 10, fontSize: 34, lineHeight: 40 }}>{item.terminology}</Text>
            </View>
          }
        </View>
        <View style={styles.card}>
          <View style={{ padding: 20, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {item.descriptionImage && <Image source={{ uri: item.descriptionImage }} style={{ width: '100%', height: 300 }} />}
            <Text style={{ textAlign: 'center', marginVertical: 10, fontSize: 34, lineHeight: 40, }}>{item.description}</Text>
          </View>
        </View>
      </FlipCard>
    );
  }

  return (
    <View style={styles.containerHome}>
      <View style={{ position: 'relative', height: 600 }}>
        <View style={styles.head}>
          <Text style={{ color: '#fff', fontSize: 50, lineHeight: 50, marginBottom: 15 }} variant="displayLarge" >{categoryName}</Text>
          <Text style={{ color: '#fff', fontSize: 20, lineHeight: 25 }}>{description}</Text>
        </View>
        <View style={styles.containerCard}>
          <Carousel
            style={{ width: "100%", backgroundColor: "blue" }}
            ref={(c: any) => { this._carousel = c; }}
            data={cards}
            renderItem={renderCard}
            sliderWidth={300}
            itemWidth={300}
            onSnapToItem={index => setProgress((index) / (cards.length - 1))}
          />
        </View>

      </View>
      <View style={styles.ProgressBar}>
        <ProgressBar style={{ height: 15, borderRadius: 20, backgroundColor: 'rgba(120, 111,218, 0.4)' }} progress={progress} color='#6750a4' />
      </View>
      <View style={{ flex: 1, justifyContent: 'space-around', alignContent: 'center', flexDirection: 'row', marginTop: 10 }}>
        <IconButton icon="close-circle-outline" size={70} iconColor={"#6750a4"} />
        <IconButton icon="check-circle-outline" size={70} iconColor={"#6750a4"} />
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
    transform: [{ translateX: -150 }],
    width: 300,

  },
  card: {
    flex: 1,
    height: 400,
    width: 300,
    borderRadius: 30,
    backgroundColor: '#FFF',
    marginLeft: "auto",
    marginRight: "auto"
  },
  ProgressBar: {
    marginHorizontal: 60,
  }

})
