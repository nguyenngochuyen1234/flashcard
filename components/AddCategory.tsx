import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import { Modal, Portal, HelperText, TextInput, Card, IconButton, Text } from 'react-native-paper';
import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { FIREBASE_DB } from '../firebaseConfig';
import { useSelector, useDispatch } from 'react-redux'
import { closeModalCategory, setCategoryName } from '../redux/categorySlice';
import React, { useEffect, useState } from 'react'
import { RootState } from '../models';
export interface AddCategoryProps {

}
export interface Category {
    title: string;
    id: string;
}


const AddCategory: React.FC<AddCategoryProps> = (props) => {
    const colors = ["red", "blue", "green", "yellow", "orange",
        "purple", "pink", "brown", "gray", "silver", "gold", "beige", "turquoise"]
    const dispatch = useDispatch()
    const isCategoryModalOpen = useSelector((state: RootState) => {
        return state?.categoryReducer?.isCategoryModalOpen
    });
    const [visibleAdd, setVisibleAdd] = React.useState(false);

    const showModalAdd = () => setVisibleAdd(true);
    const hideModalAdd = () => setVisibleAdd(false);
    const [categorys, setCategorys] = useState<Category[]>([])

    const hideModal = () => dispatch(closeModalCategory());
    const [text, setText] = React.useState('');

    useEffect(() => {
        const categorysRef = collection(FIREBASE_DB, 'categorys')

        const fetchCategory = onSnapshot(categorysRef, {
            next: (snapshot) => {
                const categorys: any[] = [];
                snapshot.docs.forEach(doc => {
                    categorys.push({
                        id: doc.id,
                        ...doc.data()
                    } as Category)
                })
                setCategorys(categorys)
            }
        });

        return () => fetchCategory();
    }, [])

    const chooseCategory = (title:string) => {
        dispatch(setCategoryName(title))
        dispatch(closeModalCategory())
    }

    const onChangeText = (text: string) => setText(text);

    const hasErrors = () => {
        return !text;
    };
    const handleAddCategory = async () => {
        try {
            if (!hasErrors()) {
                const doc = addDoc(collection(FIREBASE_DB, 'categorys'), { title: text })
                hideModalAdd()
                setText('')

            }
        } catch (error) {
            console.log(error)
        }
    }
    const containerStyle = { backgroundColor: 'white', margin: 20 };
    const renderCardCategory = ({ item }: any) => {
        return (
            <TouchableOpacity onPress={()=>{chooseCategory(item.title)}}>

                <Card.Title
                    style={{ backgroundColor: '#fff', marginVertical: 5 }}
                    title={item.title}
                    right={(props) => <IconButton {...props} icon="dots-vertical" onPress={() => { }} />}
                />
            </TouchableOpacity>
        )
    }
    return (
        <Portal>
            <Modal visible={isCategoryModalOpen} onDismiss={hideModal} contentContainerStyle={containerStyle}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <IconButton
                            icon="close"
                            iconColor="#fff"
                            size={20}
                            onPress={hideModal}
                        />
                    </View>
                    <View style={styles.body}>
                        {categorys.length > 0 && (
                            <View>
                                <FlatList
                                    data={categorys}
                                    renderItem={(item) => renderCardCategory(item)}
                                    keyExtractor={(category: Category) => category.id}
                                />
                            </View>
                        )}
                    </View>
                    <View style={styles.footer}>
                        <IconButton
                            containerColor="#6750a4"
                            iconColor='#fff'
                            mode="contained"
                            icon="plus"
                            size={40}
                            onPress={showModalAdd}
                        />
                        <Portal>
                            <Modal visible={visibleAdd} onDismiss={hideModalAdd} contentContainerStyle={containerStyle}>
                                <View>
                                    <View style={styles.header}>
                                        <IconButton
                                            icon="close"
                                            iconColor="#fff"
                                            size={20}
                                            onPress={hideModalAdd}
                                        />
                                        <IconButton
                                            icon="check"
                                            iconColor="#fff"
                                            size={20}
                                            onPress={handleAddCategory}
                                        />
                                    </View>
                                    <View style={{ backgroundColor: '#fff', height: 250, padding: 15 }}>
                                        <View style={styles.helperText}>
                                            <TextInput label="Tên" value={text} onChangeText={onChangeText} mode='outlined' />
                                            <HelperText style={{ fontSize: 14 }} type="error" visible={hasErrors()}>
                                                Tên không thể để trống
                                            </HelperText>
                                        </View>
                                        <View style={{ marginTop: 10 }}>
                                            <Text variant="headlineMedium">Chọn màu (tùy chọn)</Text>
                                            <View style={{ flexDirection: 'row', overflow: 'scroll', marginTop: 10 }}>
                                                {colors.map(color => <View key={color} style={{ backgroundColor: `${color}`, height: 60, width: 60 }} />)}
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </Modal>
                        </Portal>
                    </View>
                </View>
            </Modal>
        </Portal>
    )
}

export default AddCategory

const styles = StyleSheet.create({
    container: {
        minHeight: 800,
        width: '100%',
    },
    header: {
        backgroundColor: '#6750a4',
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    body: {
        backgroundColor: '#e5e5ef',
        height: 670,
        padding: 10,
    },
    footer: {
        flexDirection: 'row-reverse',
        backgroundColor: '#e5e5ef',
        padding: 10,
    },
    helperText: {

    }
})