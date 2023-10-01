import { View, StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Button, Avatar, Text, Card, IconButton } from 'react-native-paper';
import AddCategory from '../../components/AddCategory';
import { Entypo } from '@expo/vector-icons';
import AddCollection from '../../components/AddCollection';
import { useSelector, useDispatch } from 'react-redux'
import { openModalCategory, closeModalCategory } from '../../redux/categorySlice';
import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { FIREBASE_DB } from '../../firebaseConfig';

export interface Collection {
  categoryName: string;
  id: string;
  description: string;
  name: string
}


const Home = ({navigation}) => {
  const dispatch = useDispatch()
  const [visibleAddCollection, setVisibleAddCollection] = React.useState(false)
  const [collections, setCollections] = useState<Collection[]>([])
  useEffect(() => {
    const collectionsRef = collection(FIREBASE_DB, 'collections')

    const fetchCollection = onSnapshot(collectionsRef, {
      next: (snapshot) => {
        const collectionsApi: any[] = [];
        snapshot.docs.forEach(doc => {
          collectionsApi.push({
            id: doc.id,
            ...doc.data()
          } as Collection)
        })
        setCollections(collectionsApi)
      }
    });

    return () => fetchCollection();
  }, [])
  const renderCardCollection = ({ item }: any) => {
    return (
      <TouchableOpacity>
        <Card style={styles.cardCollection}>
          <Card.Title
            style={styles.cardTitle}
            titleStyle={{ fontSize: 22 }}
            subtitleStyle={{fontSize:16}}
            subtitle={item.description}
            title={item.name}
            right={(props) => <IconButton {...props} icon="dots-vertical" onPress={() => { }} />}
          />
          <Card.Content>
            <View style={{ alignItems: 'flex-start' }}>
            <TouchableOpacity style={styles.buttonCategory}>
              <Text style={{fontSize:13}}>{item.categoryName}</Text>
            </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', marginTop: 20 }}>

              <Button mode="contained" onPress={()=>navigation.navigate('ListFlashcards',{ collectionId: item.id})} style={{ marginRight: 10 }} icon="plus">Thêm thẻ</Button>
              <Button mode="outlined">Thực hành</Button>
            </View>
            
          </Card.Content>
        </Card>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.containerHome}>
      <View style={styles.headerHome}>
        <View>
          <TouchableOpacity style={styles.buttonHeader} onPress={() => dispatch(openModalCategory())}>
            <Text style={{ fontSize: 20, color: '#6750a4' }} variant="headlineMedium">Tất cả các bộ</Text>
            <Entypo name="chevron-small-down" size={24} color="black" />
          </TouchableOpacity>

          <AddCategory />
        </View>
        <View style={styles.buttonGroup}>
          <Button mode="outlined" onPress={() => console.log('Pressed')}>
            XEM LẠI TẤT CẢ
          </Button>
          <Button mode="outlined" onPress={() => console.log('Pressed')}>
            THỰC HÀNH TẤT CẢ
          </Button>
        </View>
      </View>
      <View style={styles.bodyHome}>
        {collections.length > 0 ? (
          <View>
            <FlatList
              data={collections}
              renderItem={(item) => renderCardCollection(item)}
              keyExtractor={(collection: Collection) => collection.id}
            />
          </View>
        ):
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Avatar.Icon size={80} icon="credit-card-edit-outline" />
          <Text style={{ marginTop: 10, fontSize: 22 }} variant="headlineMedium">Tạo bộ đầu tiên của bạn</Text>
        </View> 
        }

      </View>
      <View style={styles.footerHome}>
        <Button mode="contained" onPress={() => setVisibleAddCollection(true)} icon="plus">
          THÊM BỘ
        </Button>
        <AddCollection visibleAddCollection={visibleAddCollection}
          setVisibleAddCollection={setVisibleAddCollection} />
      </View>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
  buttonHeader: {
    backgroundColor: "#f7f3f9",
    padding: 10,
    color: "#6750a4",
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: 5,
    borderWidth: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',

  },
  containerHome: {
    flex: 1,
    backgroundColor: '#e5e5ef'
  },
  headerHome: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  bodyHome: {
    height: 750,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,

  },
  footerHome: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cardCollection: {
    width: '100%',
    backgroundColor: '#fff',
    marginVertical: 10,
  },
  cardTitle: {
    width: '100%',
    fontSize: 22,
    fontWeight: 600

  },
  cardContent: {
    marginTop: 0,
  },
  buttonCategory:{
    backgroundColor:'rgba(1,1,1,0.1)',
    paddingHorizontal:10,
    paddingVertical:6,
    borderRadius:20
  }


});
