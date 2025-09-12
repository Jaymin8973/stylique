import { useRouter } from 'expo-router';
import { Image, Modal, Text, TouchableOpacity, View } from 'react-native';

const router = useRouter();

const PasswordChangedPopup = ({ visible , onClose}) => (
  <Modal
    visible={visible}
    animationType="slide"
    transparent={true}
  >
    <View style={{
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0,0,0,0.2)',
    }}>
      <View style={{
        backgroundColor: 'white',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        alignItems: 'center',
        height:250
      }}>

        <Image source={require('../../assets/images/success.png')} style={{ width: 60, height: 60, marginBottom: 16 }} />
        <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Your password has been changed</Text>
        <Text style={{ color: 'gray', marginVertical: 8 }}>Welcome back! Discover now!</Text>
        <TouchableOpacity
          onPress={onClose}
          style={{
            backgroundColor: 'black',
            borderRadius: 24,
            paddingVertical: 12,
            paddingHorizontal: 32,
            marginTop: 16
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Browse home</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

export default PasswordChangedPopup;
