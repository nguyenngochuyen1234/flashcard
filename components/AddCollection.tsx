import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Modal, Portal, HelperText, TextInput, Card, IconButton, Text, Button } from 'react-native-paper';
import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { FIREBASE_DB } from '../firebaseConfig';
import { openModalCategory, closeModalCategory } from '../redux/categorySlice';
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../models';
import React from 'react';
export interface AddCollectionProps {
    visibleAddCollection: boolean
    setVisibleAddCollection: React.Dispatch<React.SetStateAction<boolean>>

}
export interface Collection {
    title: string;
    id: string;
}
const AddCollection: React.FC<AddCollectionProps> = (props) => {
    const { visibleAddCollection, setVisibleAddCollection } = props
    const categoryName = useSelector((state: RootState) => {
        return state?.categoryReducer?.categoryName
    });
    const dispatch = useDispatch()
    const [name, setName] = React.useState('');
    const [description, setDescription] = React.useState('')
    const containerStyle = { backgroundColor: 'white', margin: 20 };
    
    const addCollectionHandle = async () => {
        try {
            if (name) {
                const doc = addDoc(collection(FIREBASE_DB, 'collections'), { name, description, categoryName: categoryName || "nothing" })
                setVisibleAddCollection(false)
            }
        } catch (err: any) {
            console.log({ err })
        }
    }
    const hideModal = () => setVisibleAddCollection(false);
    return (
        <Portal>
            <Modal visible={visibleAddCollection} onDismiss={hideModal} contentContainerStyle={containerStyle}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <IconButton
                            icon="close"
                            iconColor="#fff"
                            size={20}
                            onPress={hideModal}
                        />
                    </View>
                    <View>
                        <View style={styles.body}>
                            <TextInput label="Tên" value={name} onChangeText={(text: string) => setName(text)} mode='outlined' />
                            <HelperText style={{ fontSize: 14 }} type="error" visible={!name}>
                                Tên không thể để trống
                            </HelperText>

                            <TextInput style={{ marginVertical: 5 }} label="Mô tả (Không bắt buộc)" value={description} onChangeText={(text: string) => setDescription(text)} mode='outlined' />
                            <TouchableOpacity onPress={() => dispatch(openModalCategory())}>

                                <TextInput style={{ marginVertical: 5 }} editable={false} outlineColor="rgba(0,0,0,0)" label="Danh mục" value={categoryName || "Không có danh mục"} mode='outlined' />
                            </TouchableOpacity>
                            <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
                                <Button mode="contained" onPress={addCollectionHandle}> Thêm bộ
                                </Button>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </Portal >
    )
}

export default AddCollection
const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    header: {
        backgroundColor: '#6750a4',
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    body: {
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