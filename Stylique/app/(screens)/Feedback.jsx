import { AntDesign, Feather } from '@expo/vector-icons';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { useState } from 'react';
import { Image, KeyboardAvoidingView, Modal, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import StarRating from 'react-native-star-rating-widget';


const Feedback = () => {
    const [rating, setRating] = useState(0);
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);
    const [text, setText] = useState('');
    const [isSend, setIsSend] = useState(false);
    const maxLength = 50;
    const [modalVisible, setModalVisible] = useState(false);

    const pickImage = () => {
        launchImageLibraryAsync(
            { mediaType: 'photo', quality: 1 },
        ).then((response) => {
            if (response.assets && response.assets.length > 0) {
                setImages([response.assets[0].uri]);
            }
            if (!response.canceled && response.assets.length > 0) {
                setImages([...images, response.assets[0].uri]);
            }
        });
    };

    const removeImage = (uri) => {
        setImages(images.filter(img => img !== uri));
    };

    const submitFeedback = () => {
        setIsSend(true);
        setModalVisible(true);
    };

    return (
        <SafeAreaView className="flex-1">
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}

            >
                <ScrollView contentContainerStyle={{ flexGrow: 1, marginHorizontal: 20, justifyContent: 'flex-center' }} >
                    <View className="mt-10 gap-10">
                        <View className="justify-center items-center gap-5">
                            <Text className="text-xl text-center font-bold">What is your opinion of stylique?</Text>
                            <StarRating
                                rating={rating}
                                onChange={setRating}
                                starSize={50}
                                color="#000000"
                                emptyColor="#000000"
                                enableHalfStar={false}
                                starStyle={{ marginHorizontal: 2, borderRadius: 5 }}
                            />
                        </View>
                        <View>
                            <TextInput
                                style={{
                                    height: 200,
                                    borderColor: 'gray',
                                    borderWidth: 1,
                                    padding: 10,
                                    textAlignVertical: 'top',
                                }}
                                className='rounded-3xl text-xl'
                                multiline
                                maxLength={maxLength}
                                placeholder="Would you like to write anything about this product?"
                                placeholderTextColor={'gray'}
                                value={text}
                                onChangeText={setText}
                            />
                            <Text style={{ position: 'absolute', right: 25, bottom: 15, color: 'gray', fontSize: 16 }}>
                                {maxLength - text.length} characters left
                            </Text>
                        </View>

                        <View className="flex-row">
                            {images.map((img, index) => (
                                <TouchableOpacity key={index} onPress={() => removeImage(img)} style={{ marginRight: 10 }}>
                                    <Image
                                        source={{ uri: img }}
                                        style={{
                                            width: 80,
                                            height: 80,
                                            borderWidth: 2,
                                            borderColor: 'gray',
                                            borderStyle: 'dashed',
                                            borderRadius: 16,
                                            padding: 4,
                                        }}
                                    />
                                </TouchableOpacity>
                            ))}

                            {images.length < 4 && (
                                <TouchableOpacity
                                    onPress={pickImage}
                                    style={{
                                        width: 80,
                                        height: 80,
                                        borderWidth: 2,
                                        borderColor: 'gray',
                                        borderStyle: 'dashed',
                                        borderRadius: 16,
                                        padding: 10,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Feather name="image" size={30} color="gray" />
                                </TouchableOpacity>
                            )}


                        </View>

                        <TouchableOpacity onPress={() => { submitFeedback() }} className="bg-[#343434] rounded-full py-5 px-3 ">
                            <Text className="text-white text-center font-bold">Submit Feedback</Text>
                        </TouchableOpacity>
                    </View>

                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContent} className="mx-10">
                                <View className="gap-7 justify-center items-center">
                                    <AntDesign name="checkcircle" size={50} color="black" />
                                    <Text className="text-2xl">Thank you for your feedback!</Text>
                                    <Text className="text-xl text-gray-400">We appreciated your feedback.
                                        We’ll use your feedback to improve your experience.</Text>
                                
                                <TouchableOpacity
                                    onPress={() => setModalVisible(false)}
                                    style={styles.closeButton}
                                >
                                    <Text style={{ color: 'white' }}>Done</Text>
                                </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1, justifyContent: 'center', alignItems: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 20,
        alignItems: 'center',
    },
    closeButton: {
        backgroundColor: 'black',
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 5,
    },
});
export default Feedback