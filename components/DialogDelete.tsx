import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Dialog, Portal, Button } from 'react-native-paper';
import { deleteDoc, doc } from 'firebase/firestore'
import { FIREBASE_DB } from '../firebaseConfig';

export interface DialogDeleteProps {
    title: string
    content:string
    id:string
    collection:string
    openDialogDelete:boolean
    setOpenDialogDelete: React.Dispatch<React.SetStateAction<boolean>>

}
const DialogDelete: React.FC<DialogDeleteProps> = (props) => {
    const {
        title,
        content,
        id,
        collection,
        openDialogDelete,
        setOpenDialogDelete
    } = props

  const showDialog = () => setOpenDialogDelete(true);
  const hideDialog = () => setOpenDialogDelete(false);
  const deleteItem = async () => {
    try{
      await deleteDoc(doc(FIREBASE_DB, collection,id))
      hideDialog()
    }catch(err){
      console.log(err)
    }
  }
  return (
    <View>
      <Portal>
        <Dialog visible={openDialogDelete} onDismiss={hideDialog}>
          <Dialog.Title>{title}</Dialog.Title>
          <Dialog.Content>
            <Text>{content}</Text>
          </Dialog.Content>
          <Dialog.Actions>
          <Button onPress={hideDialog}>Cancel</Button>
          <Button onPress={deleteItem}>Ok</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

export default DialogDelete;
