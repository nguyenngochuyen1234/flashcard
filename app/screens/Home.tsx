import { View, StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Button, Avatar, Text, Card, IconButton, Menu, Divider, ProgressBar, Modal, Portal, List } from 'react-native-paper';
import AddCategory from '../../components/AddCategory';
import { Entypo } from '@expo/vector-icons';
import AddCollection from '../../components/AddCollection';
import { useSelector, useDispatch } from 'react-redux'
import { openModalCategory, closeModalCategory } from '../../redux/categorySlice';
import { addDoc, collection, deleteDoc, doc, onSnapshot, getDocs } from 'firebase/firestore'
import { FIREBASE_DB } from '../../firebaseConfig';
import DialogDelete from '../../components/DialogDelete';
import { useFocusEffect } from '@react-navigation/native';
import { User, getAuth } from 'firebase/auth';
import tinycolor from 'tinycolor2';
import { RootState } from '../../models';
export interface Collection {
  categoryName: string;
  id: string;
  description: string;
  name: string
  cards: any[]
}
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
  note: string
}

const Home = ({ navigation, route }) => {
  const dispatch = useDispatch()
  const auth = getAuth()
  const [visible, setVisible] = React.useState(false);
  const [visibleAddCollection, setVisibleAddCollection] = React.useState(false)
  const [collections, setCollections] = useState<Collection[]>([])
  const [visibleMenu, setVisibleMenu] = useState(false)
  const [openDialogDelete, setOpenDialogDelete] = useState(false)
  const [idCurrent, setIdCurrent] = useState('')
  const [user, setUser] = useState<User | null>(null)
  const [dataCollectionUpdate, setDataCollectionUpdate] = useState({
    categoryName: "",
    id: "",
    description: "",
    name: "",
    isUpdate: false
  })
  const hideDialog = () => setVisible(false);
  const handlePractice = (type: string) => {
    const collectionCurrent = collections.find(collection => collection.id === idCurrent)

    if (collectionCurrent.cards.length > 0) {
      if (type === "basic") {
        navigation.navigate('Practice', { cards: collectionCurrent.cards, collectionApi: collectionCurrent })
      }
      else if (type === "matchCards") {
        navigation.navigate('MatchCards', { cards: collectionCurrent.cards, collectionApi: collectionCurrent })
      }
      else if (type === "writing") {
        navigation.navigate('WritingReviewCards', { cards: collectionCurrent.cards, collectionApi: collectionCurrent })
      }
    }
    hideDialog()
  }
  useFocusEffect(
    React.useCallback(() => {
      if (auth.currentUser) {
        setUser(auth.currentUser);
      }
  
      const collectionsRef = collection(FIREBASE_DB, 'collections');
  
      const fetchCollections = onSnapshot(collectionsRef, (snapshot) => {
        if (user?.uid) {
          const collectionPromises = snapshot.docs
            .filter((doc) => doc.data().userId === user.uid)
            .map(async (doc) => {
              let cardsRef = collection(FIREBASE_DB, `collections/${doc.id}/cards`);
              const querySnapshot = await getDocs(cardsRef);
              const cards = querySnapshot.docs.map((cardDoc) => ({
                id: cardDoc.id,
                ...cardDoc.data(),
              }));
  
              return {
                id: doc.id,
                ...doc.data(),
                cards,
              } as Collection;
            });
  
          Promise.all(collectionPromises)
            .then((collections) => {
              setCollections(collections);
              
            })
            .catch((error) => {
              console.error("Error fetching collections:", error);
            });
          }
      });
  
      return () => fetchCollections();
    },[auth.currentUser, user?.uid])
  )


  let collectionsRedux = useSelector((state: RootState) => {
return state?.collectionsSlice?.collections
});
  useEffect(()=>{
        console.log({route})

  },[route.key])

  const handleAddCollection = () => {
    setDataCollectionUpdate({
      categoryName: "",
      id: "",
      description: "",
      name: "",
      isUpdate: false
    })
    setVisibleAddCollection(true)
  }

  const handleUpdateCollection = (item: any) => {
    setDataCollectionUpdate({
      ...item,
      isUpdate: true
    })
    setVisibleAddCollection(true)
  }

  const renderCardCollection = ({ item }: any) => {
    const cardsMemorised = item?.cards.filter((card: any) => card.isMemorised)
    let color = item.color || '#6750a4'
    const lightenedColor = tinycolor(color).lighten(40).toString()
    return (
      <TouchableOpacity onPress={() => navigation.navigate('ListFlashcards', { collection: item, collectionId: item.id, categoryName: item.categoryName, description: item.description })}>
        {color && <View style={{ width: 10, backgroundColor: `${color}`, position: 'absolute', top: 10, bottom: 10, left: 0, zIndex: 3, borderBottomLeftRadius: 12, borderTopLeftRadius: 12 }} />}
        <Card style={styles.cardCollection}>
          <Card.Title
            style={styles.cardTitle}
            titleStyle={{ fontSize: 22 }}
            subtitleStyle={{ fontSize: 16 }}
            subtitle={item.description || false}
            title={item.name}
            right={(props) => <Menu
              visible={visibleMenu == item.id}
              onDismiss={() => { setVisibleMenu(false) }}
              style={{ marginTop: 50 }}
              anchor={<IconButton {...props} icon="dots-vertical" onPress={() => { setVisibleMenu(item.id) }} />}>
              <Menu.Item leadingIcon="delete" onPress={() => { setIdCurrent(item.id); setOpenDialogDelete(true); setVisibleMenu(false) }} title="Xóa" />
              <Divider />
              <Menu.Item leadingIcon="pencil" onPress={() => { handleUpdateCollection(item); setVisibleMenu(false) }} title="Chỉnh sửa" />
            </Menu>}
          />
          <Card.Content>
            <View style={{ alignItems: 'flex-start' }}>
              {item.categoryName !== "nothing" && <TouchableOpacity style={styles.buttonCategory}>
                <Text style={{ fontSize: 13 }}>{item.categoryName}</Text>
              </TouchableOpacity>}
            </View>
            <ProgressBar style={{ height: 10, borderRadius: 20, marginTop: 15, backgroundColor: `${lightenedColor}` }} progress={(cardsMemorised.length / item.cards.length) || 1} color={color || '#6750a4'} />
            <View style={{ flexDirection: 'row', marginTop: 15 }}>
              <Button mode="contained" onPress={() => navigation.navigate('ListFlashcards', { collection: item, collectionId: item.id, categoryName: item.categoryName, description: item.description })} style={{ marginRight: 10, backgroundColor: `${color}` }}>Ôn tập</Button>
              <Button mode="outlined" onPress={() => { setIdCurrent(item.id); setVisible(true) }}>Thực hành</Button>
            </View>

          </Card.Content>
        </Card>
        <DialogDelete
          title="Xóa bộ"
          content="Bạn có chắc chắn muốn xóa bộ này"
          id={idCurrent}
          collection="collections"
          openDialogDelete={openDialogDelete}
          setOpenDialogDelete={setOpenDialogDelete}
        />
      </TouchableOpacity>
    )
  }
  const containerStyle = { backgroundColor: 'white', };

  return (
    <View style={styles.containerHome}>
      <Portal>
        <Modal visible={visible} onDismiss={hideDialog} contentContainerStyle={{ margin: 20 }}>
          <View style={{ width: '100%' }}>
            <View style={{
              backgroundColor: '#6750a4',
              justifyContent: 'space-between',
              flexDirection: 'row',
              alignItems: "center",
              borderBottomColor: "#ccc",
              borderBottomWidth: 1,
            }}>
              <Text style={{ color: "#fff", marginLeft: 10 }}>Thực hành</Text>
              <IconButton
                icon="close"
                iconColor="#fff"
                size={20}
                onPress={hideDialog}
              />
            </View>
            <View style={{ backgroundColor: "#fff", padding: 5 }}>
              <TouchableOpacity style={{ marginVertical: 5 }} onPress={() => { handlePractice("basic") }}>
                <List.Item
                  style={{ borderRadius: 5 }}
                  title="Ôn tập cơ bản"
                  titleStyle={{ fontSize: 17, fontWeight: "700" }}
                  description="Ôn tập thẻ cơ bản"
                  left={props => <List.Icon {...props} icon="folder" />}
                />
              </TouchableOpacity >
              <TouchableOpacity style={{ marginVertical: 5 }} onPress={() => { handlePractice("matchCards") }}>
                <List.Item
                  style={{ borderRadius: 5 }}
                  titleStyle={{ fontSize: 17, fontWeight: "700" }}
                  title="Nối các thẻ"
                  description="Nối giữa hai danh sách"
                  left={props => <List.Icon {...props} icon="folder" />}
                />
              </TouchableOpacity >
              <TouchableOpacity style={{ marginVertical: 5 }} onPress={() => { handlePractice("writing") }}>
                <List.Item
                  style={{ borderRadius: 5 }}
                  titleStyle={{ fontSize: 17, fontWeight: "700" }}
                  title="Ôn tập bằng cách viết"
                  description="Nghe từ hoặc nhìn hình ảnh và viết lại"
                  left={props => <List.Icon {...props} icon="folder" />}
                />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </Portal>
      <View style={styles.headerHome}>
        <View>
          <TouchableOpacity style={styles.buttonHeader} onPress={() => dispatch(openModalCategory())}>
            <Text style={{ fontSize: 20, color: '#6750a4' }} variant="headlineMedium">Tất cả các bộ</Text>
            <Entypo name="chevron-small-down" size={24} color="black" />
          </TouchableOpacity>


        </View>
        <View style={styles.buttonGroup}>
          <Button mode="outlined" labelStyle={{ fontSize: 13 }} onPress={() => console.log('Pressed')}>
            XEM LẠI TẤT CẢ
          </Button>
          <Button mode="outlined" labelStyle={{ fontSize: 13 }} onPress={() => console.log('Pressed')}>
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
        ) :
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Avatar.Icon size={80} icon="credit-card-edit-outline" />
            <Text style={{ marginTop: 10, fontSize: 22 }} variant="headlineMedium">Tạo bộ đầu tiên của bạn</Text>
          </View>
        }

      </View>
      <View style={styles.footerHome}>
        <Button mode="contained" onPress={handleAddCollection} icon="plus">
          THÊM BỘ
        </Button>
        <AddCollection visibleAddCollection={visibleAddCollection}
          setVisibleAddCollection={setVisibleAddCollection}
          dataCollectionUpdate={dataCollectionUpdate} user={user}
        />
      </View>
      <AddCategory user={user} />
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
    borderBottomColor: "#rgba(0,0,0,0.2)",
    borderBottomWidth: 1,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  bodyHome: {
    height: "70%",
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
    paddingLeft: 10,
  },
  cardTitle: {
    width: '100%',
    fontSize: 22,
    fontWeight: 600
  },
  cardContent: {
    marginTop: 0,
  },
  buttonCategory: {
    backgroundColor: 'rgba(1,1,1,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20
  }


});
