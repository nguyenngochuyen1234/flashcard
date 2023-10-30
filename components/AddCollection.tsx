import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Modal, Portal, HelperText, TextInput, Text, IconButton, SegmentedButtons, Button } from 'react-native-paper';
import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { FIREBASE_DB } from '../firebaseConfig';
import { openModalCategory, closeModalCategory } from '../redux/categorySlice';
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../models';
import { User, onAuthStateChanged } from 'firebase/auth';
import React, { useEffect } from 'react';
export interface AddCollectionProps {
    visibleAddCollection: boolean
    setVisibleAddCollection: React.Dispatch<React.SetStateAction<boolean>>
    dataCollectionUpdate: any
    user: User | null

}
export interface Collection {
    title: string;
    id: string;
}
const AddCollection: React.FC<AddCollectionProps> = (props) => {
    const { visibleAddCollection, setVisibleAddCollection, dataCollectionUpdate, user } = props
    const categoryName = useSelector((state: RootState) => {
        return state?.categoryReducer?.categoryName
    });
    const categoryColor = useSelector((state: RootState) => {
        return state?.categoryReducer?.categoryColor
    });
    const dispatch = useDispatch()
    const [name, setName] = React.useState(dataCollectionUpdate.name||'');
    const [description, setDescription] = React.useState(dataCollectionUpdate.description||'')
    const [langTerm, setLangTerm] = React.useState('vi-VN');
    const [langDes, setLangDes] = React.useState('vi-VN');
    const [initialCategoryName, setInitialCategoryName] = React.useState('')
    const containerStyle = { backgroundColor: 'white', margin: 20 };
    useEffect(() => {
        setInitialCategoryName(dataCollectionUpdate.categoryName)
        setName(dataCollectionUpdate.name)
        setDescription(dataCollectionUpdate.description)
    }, [dataCollectionUpdate.id])
    const addCollectionHandle = async () => {
        try {
            if (name && user.uid) {
                let data = {
                    name, 
                    description, 
                    categoryName: categoryName || "nothing",
                    languageTerminology:langTerm,
                    langDescription:langDes,
                    userId:user.uid,
                    color:categoryColor
                }
                if (dataCollectionUpdate.isUpdate && dataCollectionUpdate.id) {
                    updateDoc(doc(FIREBASE_DB, "collections", dataCollectionUpdate.id), data)
                } else {
                    const doc = addDoc(collection(FIREBASE_DB, 'collections'), data)
                }
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
                            <TextInput label="Tên" autoCorrect={false} defaultValue={dataCollectionUpdate.name||''} onChangeText={(text) => setName(text)} mode='outlined' />
                            <HelperText style={{ fontSize: 14 }} type="error" visible={!name}>
                                Tên không thể để trống
                            </HelperText>

                            <TextInput style={{ marginVertical: 5 }} label="Mô tả (Không bắt buộc)" defaultValue={dataCollectionUpdate.description||''} onChangeText={(text: string) => setDescription(text)} mode='outlined' />
                            <TouchableOpacity onPress={() => dispatch(openModalCategory())}>

                                <TextInput style={{ marginVertical: 5 }} editable={false} outlineColor="rgba(0,0,0,0)" label="Danh mục" value={categoryName || initialCategoryName || "Không có danh mục"} mode='outlined' />
                            </TouchableOpacity>
                            <View style={{ justifyContent: 'center'}}> 
                                <Text style={{marginBottom:10}}>Thuật ngữ</Text>
                                <SegmentedButtons
                                    value={langTerm}
                                    onValueChange={setLangTerm}
                                    buttons={[
                                        {
                                            value: 'vi-VN',
                                            label: 'Tiếng Việt',
                                        },
                                        {
                                            value: 'en-US',
                                            label: 'Tiếng Anh',
                                        },
                                    ]}
                                />
                            </View>
                            <View style={{ justifyContent: 'center'}}> 
                                <Text style={{marginVertical:10}}>Định nghĩa ngôn ngữ</Text>
                                <SegmentedButtons
                                    value={langDes}
                                    onValueChange={setLangDes}
                                    style={{borderRadius:0}}
                                    buttons={[
                                        {
                                            value: 'vi-VN',
                                            label: 'Tiếng Việt',
                                        },
                                        {
                                            value: 'en-US',
                                            label: 'Tiếng Anh',
                                        },
                                    ]}
                                />
                            </View>

                            <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 10 }}>
                                <Button mode="contained" onPress={addCollectionHandle}> {dataCollectionUpdate.isUpdate ? "Chỉnh sửa" : "Thêm bộ"}
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