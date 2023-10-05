import { View, StyleSheet, Image } from 'react-native'
import { Modal, Portal, Text, TextInput, Card, IconButton, Switch, Button } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { firebase } from '../firebaseConfig'
import React, { useEffect } from 'react'
export interface addCardProps {
    visibleAddCard: boolean
    setVisibleAddCard: React.Dispatch<React.SetStateAction<boolean>>
    collectionId: string

}
import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { FIREBASE_DB } from '../firebaseConfig';

const AddCard: React.FC<addCardProps> = (props) => {
    const { visibleAddCard, setVisibleAddCard, collectionId } = props
    const [terminology, setTerminology] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [terminologyImage, setTerminologyImage] = React.useState('');
    const [descriptionImage, setDescriptionImage] = React.useState('');
    const [isSwitchTerminologyOn, setIsSwitchTerminologyOn] = React.useState(false);
    const [isSwitchDescriptionOn, setIsSwitchDescriptionOn] = React.useState(false);
    const containerStyle = { backgroundColor: 'white', margin: 20 };

    useEffect(() => {
        if (isSwitchTerminologyOn) {
            pickImage("terminology")
        }
    }, [isSwitchTerminologyOn])
    useEffect(() => {
        if (isSwitchDescriptionOn) {
            pickImage("description")
        }
    }, [isSwitchDescriptionOn])

    const hideModal = () => setVisibleAddCard(false);

    const pickImage = async (key: string) => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled) {
            if (key == "terminology") {
                setTerminologyImage(result.assets[0].uri);
            } else {
                setDescriptionImage(result.assets[0].uri)
            }
        }
    };
    const saveImage = async (imageUrl: string) => {
        const response = await fetch(imageUrl)
        const blob = await response.blob()
        const filename = imageUrl.substring(imageUrl.lastIndexOf('/') + 1)

        var ref = firebase.storage().ref().child(filename).put(blob)
        await ref;
        return await firebase.storage().ref().child(filename).getDownloadURL();

    }
    const handleAddCard = async () => {
        try {
            if (terminologyImage) {
                let result = await saveImage(terminologyImage)
                setTerminologyImage(result)
            }
            if (descriptionImage) {
                let result = await saveImage(descriptionImage)
                setDescriptionImage(result)
            }
            const doc = addDoc(collection(FIREBASE_DB, `collections/${collectionId}/cards`), { terminology, description, terminologyImage, descriptionImage, isMemorised:false })
            setTerminology("")
            setDescription("")
            setTerminologyImage("")
            setDescriptionImage("")
            setIsSwitchTerminologyOn(false)
            setIsSwitchDescriptionOn(false)
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <Portal>
            <Modal visible={visibleAddCard} onDismiss={hideModal} contentContainerStyle={containerStyle}>
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
                            <TextInput label="Thuật ngữ" value={terminology} keyboardType="default" onChangeText={text=>setTerminology(text)} mode='outlined' />
                            <View style={{ marginVertical: 5, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ marginRight: 10 }}>Hình ảnh</Text>
                                <Switch value={isSwitchTerminologyOn} onValueChange={() => setIsSwitchTerminologyOn(!isSwitchTerminologyOn)} />
                            </View>
                            {terminologyImage && <Image source={{ uri: terminologyImage }} style={{ width: 100, height: 100 }} />}

                            <TextInput label="Định nghĩa" value={description} mode='outlined' onChangeText={setDescription} />
                            <View style={{ marginVertical: 5, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ marginRight: 10 }}>Hình ảnh</Text>
                                <Switch value={isSwitchDescriptionOn} onValueChange={() => setIsSwitchDescriptionOn(!isSwitchDescriptionOn)} />
                            </View>
                            {descriptionImage && <Image source={{ uri: descriptionImage }} style={{ width: 100, height: 100 }} />}

                        </View>
                    </View>
                    <View style={{ alignItems: 'center', marginVertical: 10 }}>
                        <Button mode="contained" onPress={handleAddCard}> Thêm thẻ tiếp
                        </Button>
                    </View>
                </View>
            </Modal>
        </Portal >

    )
}

export default AddCard

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