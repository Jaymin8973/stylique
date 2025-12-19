import { useRouter } from 'expo-router';
import { Image, Modal, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import React, { useCallback, useMemo, useRef } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

const PasswordChangedPopup = ({ visible, onClose }) => {
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['30%'], []);

  const handleSheetChanges = useCallback((index) => {
    
    // If user drags down → index becomes -1 → close modal
    if (index === -1) {
      onClose();
    }
  }, [onClose]);

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <GestureHandlerRootView style={styles.container}>
        <BottomSheet
          ref={bottomSheetRef}
          index={0}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          onChange={handleSheetChanges}
        >
          <BottomSheetView style={styles.contentContainer}>
            <Image source={require('../../assets/images/success.png')} style={styles.icon} />

            <Text style={styles.title}>Your password has been changed</Text>
            <Text style={styles.sub}>Welcome back! Discover now!</Text>

            <TouchableOpacity onPress={onClose} style={styles.button}>
              <Text style={styles.buttonText}>Browse home</Text>
            </TouchableOpacity>
          </BottomSheetView>
        </BottomSheet>
      </GestureHandlerRootView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)', // better than ugly grey
  },
  contentContainer: {
    flex: 1,
    padding: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { width: 60, height: 60, marginBottom: 16 },
  title: { fontWeight: 'bold', fontSize: 18 },
  sub: { color: 'gray', marginVertical: 8 },
  button: {
    backgroundColor: 'black',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginTop: 16
  },
  buttonText: { color: 'white', fontWeight: 'bold' }
});

export default PasswordChangedPopup;
