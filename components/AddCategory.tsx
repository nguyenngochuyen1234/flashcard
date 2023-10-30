import { View, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native'
import { Modal, Portal, HelperText, TextInput, Card, IconButton, Text } from 'react-native-paper';
import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { FIREBASE_DB } from '../firebaseConfig';
import { useSelector, useDispatch } from 'react-redux'
import { closeModalCategory, setCategory } from '../redux/categorySlice';
import React, { useEffect, useState } from 'react'
import { User, onAuthStateChanged } from 'firebase/auth';
import { RootState } from '../models';
export interface AddCategoryProps {
    user: User | null
}
export interface Category {
    title: string;
    id: string;
    idUser: string;
}


const AddCategory: React.FC<AddCategoryProps> = (props) => {
    const { user } = props
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
    const [color, setColor] = React.useState('#6750a4')

    const hideModal = () => dispatch(closeModalCategory());
    const [text, setText] = React.useState('');

    useEffect(() => {
        const categorysRef = collection(FIREBASE_DB, 'categorys')
        const fetchCategory = onSnapshot(categorysRef, (snapshot) => {
            if (user?.uid) {
                const categorys = snapshot.docs
                    .filter(doc => doc.data().idUser === user.uid) // Lọc các danh mục có idUser là 1
                    .map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }) as Category);

                setCategorys(categorys);
            }
        });
        return () => fetchCategory();
    }, [user?.uid])

    const chooseCategory = (name: string, color: string) => {
        dispatch(setCategory({ name, color }))
        dispatch(closeModalCategory())
    }

    const onChangeText = (text: string) => setText(text);

    const hasErrors = () => {
        return !text;
    };
    const handleAddCategory = async () => {
        try {
            if (!hasErrors() && user.uid) {
                const doc = addDoc(collection(FIREBASE_DB, 'categorys'), { title: text, idUser: user.uid, color })
                hideModalAdd()
                setText('')
                setColor('#6750a4')

            }
        } catch (error) {
            console.log(error)
        }
    }
    const containerStyle = { backgroundColor: 'white', margin: 20, zIndex: 100 };
    const renderCardCategory = ({ item }: any) => {
        return (
            <TouchableOpacity onPress={() => { chooseCategory(item.title, item.color) }}>
                {item.color && <View style={{ width: 10, backgroundColor: `${item.color}`, position: 'absolute', top: 5, bottom: 5, left: 0, zIndex: 3 }} />}
                <Card.Title
                    style={{ backgroundColor: '#fff', marginVertical: 5, padding: -50 }}
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
                                    <View style={{
                                        backgroundColor: color,
                                        justifyContent: 'space-between',
                                        flexDirection: 'row',
                                        zIndex: 10
                                    }}>
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
                                            <TextInput label="Tên" defaultValue='' onChangeText={onChangeText} mode='outlined' />
                                            <HelperText style={{ fontSize: 14 }} type="error" visible={hasErrors()}>
                                                Tên không thể để trống
                                            </HelperText>
                                        </View>
                                        <View style={{ marginTop: 10 }}>
                                            <Text variant="headlineMedium">Chọn màu (tùy chọn)</Text>
                                            <ScrollView horizontal={true} style={{ marginTop: 10 }}>
                                                {colors.map(color => <TouchableOpacity key={color} onPress={() => setColor(color)} style={{ backgroundColor: `${color}`, height: 60, width: 60 }} />)}
                                            </ScrollView>
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
        minHeight: 600,
        width: '100%',
        position: 'absolute',
        zIndex: 100
    },
    header: {
        backgroundColor: '#6750a4',
        justifyContent: 'space-between',
        flexDirection: 'row',
        zIndex: 10
    },
    body: {
        backgroundColor: '#e5e5ef',
        height: 600,
        padding: 10,
        zIndex: 10
    },
    footer: {
        flexDirection: 'row-reverse',
        backgroundColor: '#e5e5ef',
        padding: 10,
    },
    helperText: {

    }
})