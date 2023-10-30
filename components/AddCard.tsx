import { View, StyleSheet, Image } from 'react-native'
import { Modal, Portal, Text, TextInput, ToggleButton, IconButton, Switch, Button } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { firebase } from '../firebaseConfig'

import React, { useEffect } from 'react'
export interface Collection {
    categoryName: string;
    id: string;
    description: string;
    name: string
    languageTerminology: string
    langDescription: string
}

export interface addCardProps {
    visibleAddCard: boolean
    setVisibleAddCard: React.Dispatch<React.SetStateAction<boolean>>
    collectionApi: Collection | null
    collectionId: string
}
import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { FIREBASE_DB } from '../firebaseConfig';

const AddCard: React.FC<addCardProps> = (props) => {
    const { visibleAddCard, setVisibleAddCard, collectionId, collectionApi } = props
    const [terminology, setTerminology] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [terminologyImage, setTerminologyImage] = React.useState('');
    const [descriptionImage, setDescriptionImage] = React.useState('');
    const [valueToggleBtnTerminology, setValueToggleBtnTerminology] = React.useState('none');
    const [valueToggleBtnDescription, setValueToggleBtnDescription] = React.useState('none');
    const [isSwitchTerminologyOn, setIsSwitchTerminologyOn] = React.useState(false);
    const [isSwitchDescriptionOn, setIsSwitchDescriptionOn] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false)
    const [isSwitchOn, setIsSwitchOn] = React.useState(false);
    const [note, setNote] =  React.useState('')
    const containerStyle = { backgroundColor: 'white', margin: 20 };
    const onToggleSwitch = () => {
        setIsSwitchOn(!isSwitchOn)
    };
    const fetchRequestImg = async (img: string) => {
        const data = await fetch(
            `https://api.unsplash.com/search/photos?page=1&query=${img}&per_page=1&client_id=SwkCnhCkXTf9Ok5kviKHUg9UEeEyCCP3_yCJ9MXjZb0`
        );

        const dataJ = await data.json();
        const result = dataJ.results;
        if (result[0]) {
            return result[0].urls.small
        }
        return;
    };
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
    const handleToggleBtn = async (value: string, key: string) => {
        if (key == "terminology") {
            setValueToggleBtnTerminology(value)
            if (value == "terminologyImage") {
                pickImage("terminology")
            } else if (value == "terminologyImageAuto") {
                if (terminology) {
                    let src = await fetchRequestImg(terminology)
                    if (src) {
                        setTerminologyImage(src)
                    }
                }
            } else {
                setTerminologyImage("")
            }
        } else {
            setValueToggleBtnDescription(value)
            if (value == "descriptionImage") {
                pickImage("description")
            } else if (value == "descriptionImageAuto") {
                if (description) {
                    let src = await fetchRequestImg(description)
                    if (src) {
                        setDescriptionImage(src)
                    }
                }
            } else {
                setDescriptionImage("")
            }
        }
    }
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
        setIsLoading(true)
        try {
            if (terminologyImage) {
                let result = await saveImage(terminologyImage)
                setTerminologyImage(result)
            }
            if (descriptionImage) {
                let result = await saveImage(descriptionImage)
                setDescriptionImage(result)
            }
            if ((terminology || terminologyImage) && (description || descriptionImage)) {
                const doc = addDoc(collection(FIREBASE_DB, `collections/${collectionId}/cards`), { terminology, description, terminologyImage, descriptionImage, isMemorised: false, note })
            }
        } catch (error) {
            console.log(error)
        } finally {
            setTerminology("")
            setDescription("")
            setTerminologyImage("")
            setDescriptionImage("")
            setValueToggleBtnTerminology("none")
            setValueToggleBtnDescription("none")
            setIsSwitchTerminologyOn(false)
            setIsSwitchDescriptionOn(false)
            setIsSwitchOn(false)
            setNote('')
            setIsLoading(false)
            setVisibleAddCard(false)
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
                            <TextInput disabled={isLoading} label="Thuật ngữ" defaultValue="" keyboardType="default" onChangeText={text => setTerminology(text)} mode='outlined' />
                            <View style={{ marginVertical: 10 }}>
                                <ToggleButton.Row onValueChange={value => handleToggleBtn(value, "terminology")} value={valueToggleBtnTerminology}>
                                    <ToggleButton disabled={isLoading} icon="image-off-outline" value="none" />
                                    <ToggleButton disabled={isLoading} icon="image-outline" value="terminologyImage" />
                                    {collectionApi?.languageTerminology == 'en-US' && <ToggleButton disabled={isLoading} icon="auto-fix" value="terminologyImageAuto" />}
                                </ToggleButton.Row>
                            </View>
                            {terminologyImage && <Image source={{ uri: terminologyImage }} style={{ width: 100, height: 100 }} />}
                            <TextInput label="Định nghĩa" disabled={isLoading} defaultValue="" keyboardType="default" mode='outlined' onChangeText={setDescription} />
                            <View style={{ marginVertical: 10 }}>
                                <ToggleButton.Row onValueChange={value => handleToggleBtn(value, "description")} value={valueToggleBtnDescription}>
                                    <ToggleButton disabled={isLoading} icon="image-off-outline" value="none" />
                                    <ToggleButton disabled={isLoading} icon="image-outline" value="descriptionImage" />
                                    {collectionApi?.langDescription == 'en-US' && <ToggleButton disabled={isLoading} icon="auto-fix" value="descriptionImageAuto" />}
                                </ToggleButton.Row>
                            </View>
                            {descriptionImage && <Image source={{ uri: descriptionImage }} style={{ width: 100, height: 100 }} />}
                            <View style={{ justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row' }}>
                                <Text style={{}}>Ghi chú</Text>
                                <Switch value={isSwitchOn} disabled={isLoading} onValueChange={onToggleSwitch} />
                            </View>
                            {isSwitchOn && <TextInput
                                multiline
                                disabled={isLoading}
                                mode="outlined"
                                numberOfLines={4}
                                onChangeText = {setNote}
                            />}
                        </View>
                    </View>
                    <View style={{ alignItems: 'center', marginVertical: 10 }}>
                        <Button disabled={isLoading} mode="contained" onPress={handleAddCard}> Thêm thẻ tiếp
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