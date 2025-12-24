import { AntDesign, Fontisto } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { THEME } from '../../constants/Theme';
import { ThemedContainer, ThemedSection } from '../../components/ThemedComponents';

const Language = () => {
    const [selectedLanguage, setSelectedLanguage] = useState('English');

    const languages = [
        { id: 1, name: 'English', nativeName: 'English', code: 'en', flag: '🇺🇸' },
        { id: 2, name: 'Hindi', nativeName: 'हिन्दी', code: 'hi', flag: '🇮🇳' },
        { id: 3, name: 'Gujarati', nativeName: 'ગુજરાતી', code: 'gu', flag: '🇮🇳' },

    ];

    const handleLanguageSelect = (languageName) => {
        setSelectedLanguage(languageName);
        // Here you can add logic to save the language preference
        // For example: AsyncStorage.setItem('selectedLanguage', languageName);
    };

    return (
        <ThemedContainer className='bg-white'>
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <ThemedSection className="pt-4 pb-6">
                    {/* Header */}
                    <View className="mb-6">
                        <Text className="text-2xl font-bold text-gray-900 mb-2">Select Language</Text>
                        <Text className="text-gray-600">Choose your preferred language for the app</Text>
                    </View>

                    {/* Language List */}
                    <View className="gap-3">
                        {languages.map((language) => (
                            <TouchableOpacity
                                key={language.id}
                                onPress={() => handleLanguageSelect(language.name)}
                                className={`bg-white rounded-2xl p-4 border-2 ${selectedLanguage === language.name
                                    ? 'border-black'
                                    : 'border-gray-100'
                                    }`}
                                style={styles.shadowCard}
                            >
                                <View className="flex-row items-center justify-between">
                                    <View className="flex-row items-center flex-1">
                                        <Text className="text-3xl mr-4">{language.flag}</Text>
                                        <View className="flex-1">
                                            <Text className="text-lg font-semibold text-gray-900">
                                                {language.name}
                                            </Text>
                                            <Text className="text-sm text-gray-600 mt-1">
                                                {language.nativeName}
                                            </Text>
                                        </View>
                                    </View>
                                    {selectedLanguage === language.name && (
                                        <View className="bg-black rounded-full p-2">
                                            <AntDesign name="check" size={16} color="white" />
                                        </View>
                                    )}
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Info Section */}
                    <View className="mt-8 bg-gray-50 rounded-2xl p-5">
                        <View className="flex-row items-start">
                            <Fontisto name="world-o" size={24} color={THEME.colors.primary} />
                            <View className="flex-1 ml-4">
                                <Text className="text-base font-semibold text-gray-900 mb-2">
                                    Language Settings
                                </Text>
                                <Text className="text-sm text-gray-600 leading-6">
                                    Your language preference will be applied throughout the app. Some content may still appear in English if translations are not available.
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Apply Button */}
                    <TouchableOpacity
                        onPress={() => {
                            // Add logic to apply language change
                            alert(`Language changed to ${selectedLanguage}`);
                        }}
                        className="bg-black rounded-full py-4 mt-6"
                    >
                        <Text className="text-white text-center font-bold text-base">
                            Apply Language
                        </Text>
                    </TouchableOpacity>
                </ThemedSection>
            </ScrollView>
        </ThemedContainer>
    );
};

const styles = StyleSheet.create({
    shadowCard: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
});

export default Language;
