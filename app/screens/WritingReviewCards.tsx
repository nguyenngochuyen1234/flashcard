import { View, StyleSheet, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Text, IconButton, TextInput, Button } from 'react-native-paper'
import * as Speech from 'expo-speech';
const WritingReviewCards = ({ navigation, route }) => {
  const [questions, setQuestions] = useState([])
  const [questionCurrent, setQuestionCurrent] = useState(0)
  const [checkQuestion, setCheckQuestion] = useState({
    checked: false,
    correct: false,
    showAnswer: false
  })
  const [answer, setAnswer] = React.useState('')
  const speakWord = (textToSpeak: string) => {
    Speech.speak(textToSpeak, {
      language: 'en-US',
    });
  }
  useEffect(() => {
    if (route.params?.collectionApi.id) {
      let collectionApi = route.params?.collectionApi
      let collectionApiConvert = collectionApi.cards.map((card: any) => {
        let questionText = ''
        let questionImage = ''
        let answerText = ''
        if (collectionApi.langDescription == 'en-US' && card.description) {
          questionText = card.terminology
          questionImage = card.terminologyImage || card.descriptionImage
          answerText = card.description
        } if (collectionApi.languageTerminology == 'en-US' && card.terminology) {
          questionText = card.description
          questionImage = card.terminologyImage || card.descriptionImage
          answerText = card.terminology

        }
        return {
          questionText,
          questionImage,
          answerText,
        }
      })
      let removeEmptyResponse = collectionApiConvert.filter((res: any) => res.answerText)
      setQuestions(removeEmptyResponse)
    }
  }, [])
  const handleCheck = () => {
    let setCorrect = false
    if (checkQuestion.checked) {
      setQuestionCurrent(prev => prev + 1)
      setAnswer('')
      setCheckQuestion({
        checked: false,
        correct: false,
        showAnswer: false
      })
    } else {
      if (questions[questionCurrent].answerText.toLowerCase().trim() === answer.toLowerCase().trim()) {
        setCorrect = true
      } else {
        setCorrect = false
      }
      setCheckQuestion({
        checked: true,
        correct: setCorrect,
        showAnswer: true
      })
    }
  }
  const handeSaveAnswer = (text: string) => {
    let answerText = text
    setAnswer(answerText)
  }
  return (
    <View style={styles.containerHome}>
      {questionCurrent < questions.length &&
        <>
          {questions[questionCurrent].questionImage && <Image source={{ uri: questions[questionCurrent].questionImage }} style={{ width: 100, height: 100 }} />}
          {!questions[questionCurrent].questionImage && questions[questionCurrent].questionText && <Text style={{ fontSize: 30, lineHeight: 30 }}>{questions[questionCurrent].questionText}</Text>}
          <Text style={{ fontSize: 25, lineHeight: 25, fontWeight: '700', marginVertical: 10, opacity: checkQuestion.showAnswer ? 1 : 0 }}>{questions[questionCurrent].answerText}</Text>
          <TextInput
            multiline
            mode="outlined"
            style={{ width: '100%', fontSize: 20, padding: 5 }}
            numberOfLines={6}
            onChangeText={handeSaveAnswer}
            value={answer}
            right={<TextInput.Icon icon="volume-medium" onPress={() => speakWord(questions[questionCurrent].answerText)} />}
          />
          <Button mode="contained" style={{ position: 'absolute', bottom: 10, width: '100%', backgroundColor: checkQuestion.checked ? (checkQuestion.correct ? 'green' : 'red') : "#6750a4" }} onPress={handleCheck}>
            {checkQuestion.checked ? 'Chuyển sang câu hỏi tiếp theo' : 'Kiểm tra đáp án'}
          </Button>
        </>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  containerHome: {
    padding: 10,
    flex: 1,
    backgroundColor: '#e5e5ef',
    alignItems: 'center'
  },
  head: {
    height: 280,
    backgroundColor: '#6750a4',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    padding: 30,
    alignItems: "center",
  },

})

export default WritingReviewCards