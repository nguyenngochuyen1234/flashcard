import { View, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native'
import { Text } from 'react-native-paper'

import React, { useEffect, useState } from 'react'

const MatchCards = ({ navigation, route }) => {
  const [roundCards, setRoundCards] = useState([])
  const [roundCardsDefault, setRoundCardsDefault] = useState([])
  const [cardSelected, setCardSelected] = useState({id:null, idCard:null})
  const [indexRoundCurrent, setIndexRoundCurrent] = useState(0)
  const idR = 1
  const idL = 2
  function shuffleArray(array: any) {
    const randomComparator = () => Math.random() - 0.5;
    return array.sort(randomComparator);
  }
  useEffect(()=>{
    if(indexRoundCurrent === roundCards.length - 1 && roundCards[indexRoundCurrent][0].length==0){
      console.log("end")
    }
  },[cardSelected, roundCards])
  const splitArr = (array: any) => {
    let arrL = []
    let arrR = []
    let resultArr = []
    array.forEach((itemCard: any) => {
      const { description, descriptionImage, id, terminology, terminologyImage } = itemCard
      arrR.push({ description, descriptionImage, id, idCard:idL})
      arrL.push({ id, terminology, terminologyImage, idCard:idR})
    })
    resultArr.push([...shuffleArray(arrL)]);
    resultArr.push([...shuffleArray(arrR)]);

    return resultArr
  }
  function splitArrayIntoSubarrays(array: any, maxSubarraySize: number) {
    const resultArrays = [];
    let currentSubarray = [];
    let arrSplit = []
    for (const item of array) {
      if (currentSubarray.length === maxSubarraySize) {
        arrSplit = splitArr(currentSubarray)
        resultArrays.push([...arrSplit]);
        currentSubarray = [];
      }
      const { description, descriptionImage, id, terminology, terminologyImage } = item
      currentSubarray.push({ description, descriptionImage, id, terminology, terminologyImage });
    }

    if (currentSubarray.length > 0) {
      arrSplit = splitArr(currentSubarray)
      resultArrays.push([...arrSplit]);
    }

    return resultArrays;
  }
  const handleClickCard = (card:any) => {
    if(cardSelected.id && cardSelected.idCard !== card.idCard ){
      if(cardSelected.id === card.id){
        let newRoundCards = roundCards.map(round=>{
          let newRound = round.map((col:any)=>{
              let newCol = col.filter((card:any)=>cardSelected.id != card.id)
              return newCol
          })
          return newRound
        })
        setRoundCards(newRoundCards)
        setCardSelected({id:null, idCard:null})
      }
    }else{
      setCardSelected(card)
    }
  }
  useEffect(() => {
    if (route.params?.collectionApi.id) {
      const originalArray = route.params?.collectionApi.cards
      // Hàm để tách mảng thành các mảng con
      if (originalArray.length > 0) {
        const maxSubarraySize = 5; // Kích thước tối đa của mỗi mảng con
        const resultArrays = splitArrayIntoSubarrays(originalArray, maxSubarraySize);
        if (resultArrays) {
          setRoundCards(resultArrays)
          setRoundCardsDefault(resultArrays)
          console.log({resultArrays})
        }
      }
    }

  }, [route.params?.collectionId])
  const renderCard = ({ item }) => {
    let backgroundColor = (item.id == cardSelected?.id && item.idCard == cardSelected?.idCard) ? '#ccc' : '#fff'
    let image = (!item.description || !item.terminology) ? (item.terminologyImage || item.descriptionImage) : null
    return <TouchableOpacity style={{...styles.card, backgroundColor:backgroundColor}} onPress={()=>handleClickCard(item)}>
      {<Text>{item.description || item.terminology}</Text>}
      {image &&  <Image source={{ uri: image }} style={{ width: 100, height: 100 }} />}
    </TouchableOpacity>
  }
  const renderRoundCard = ({ item, index }) => {
    let roundL = item[0]
    let roundR = item[1]
    if(index === indexRoundCurrent && item[0].length == 0 && indexRoundCurrent < roundCards.length-1){
      setIndexRoundCurrent(index+1)
    }
    return (
      <View style={{...styles.containerHome, display: (index === indexRoundCurrent && roundL.length > 0) ? 'flex' : 'none'}}>
        <View style={{
          width: '50%',
          height: '100%',
          paddingVertical: 5
        }}>
          {roundL.length > 0 && (
            <FlatList
              data={roundL}
              renderItem={(item) => renderCard(item)}
              keyExtractor={(round, index) => index.toString()}
            />
          )}
        </View>
        <View style={{
          width: '50%',
          height: '100%',
          paddingVertical: 5
        }}>
          {roundR.length > 0 && (
            <FlatList
              data={roundR}
              renderItem={(item) => renderCard(item)}
              keyExtractor={(round, index) => index.toString()}
            />
          )}
        </View>
      </View>
    )
  }
  return (
    <View style={styles.containerHome}>
      {roundCards.length > 0 && (
        <FlatList
          data={roundCards}
          renderItem={(item) => renderRoundCard(item)}
          keyExtractor={(round, index) => index.toString()}
        />
      )}
    </View>
  )
}
const styles = StyleSheet.create({
  containerHome: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#e5e5ef'
  },
  containerCards: {
    width: '50%',
    height: '100%',
    paddingVertical: 5,
  },
  card: {
    padding: 10,
    // backgroundColor: '#F6F8FA',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    marginVertical: 5,
  }
})

export default MatchCards