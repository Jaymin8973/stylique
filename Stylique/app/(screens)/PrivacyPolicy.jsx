import { Feather } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { THEME } from '@constants/Theme';
import { ThemedContainer, ThemedSection } from '@components/ThemedComponents';

const PrivacyPolicy = () => {
    const sections = [
        {
            id: 1,
            title: 'Information We Collect',
            icon: 'info',
            content: 'We collect information you provide directly to us, including your name, email address, postal address, phone number, and payment information when you create an account, make a purchase, or communicate with us.'
        },
        {
            id: 2,
            title: 'How We Use Your Information',
            icon: 'settings',
            content: 'We use the information we collect to process your orders, communicate with you, improve our services, personalize your experience, and comply with legal obligations.'
        },
        {
            id: 3,
            title: 'Information Sharing',
            icon: 'share-2',
            content: 'We do not sell your personal information. We may share your information with service providers who help us operate our business, such as payment processors and shipping companies, and when required by law.'
        },
        {
            id: 4,
            title: 'Data Security',
            icon: 'shield',
            content: 'We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.'
        },
        {
            id: 5,
            title: 'Cookies and Tracking',
            icon: 'eye',
            content: 'We use cookies and similar tracking technologies to track activity on our service and hold certain information to improve and analyze our service.'
        },
        {
            id: 6,
            title: 'Your Rights',
            icon: 'user-check',
            content: 'You have the right to access, update, or delete your personal information. You can also object to processing, request data portability, and withdraw consent at any time.'
        },
        {
            id: 7,
            title: 'Children\'s Privacy',
            icon: 'users',
            content: 'Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.'
        },
        {
            id: 8,
            title: 'Changes to This Policy',
            icon: 'refresh-cw',
            content: 'We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.'
        },
    ];

    return (
        <ThemedContainer className='bg-white'>
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <ThemedSection className="pt-4 pb-6">
                    {/* Header */}
                    <View className="mb-6">
                        <Text className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</Text>
                        <Text className="text-sm text-gray-600">Last Updated: December 24, 2025</Text>
                    </View>

                    {/* Introduction */}
                    <View className="bg-gray-50 rounded-2xl p-5 mb-6">
                        <Text className="text-base text-gray-700 leading-7">
                            At Stylique, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application.
                        </Text>
                    </View>

                    {/* Policy Sections */}
                    <View className="gap-4 mb-6">
                        {sections.map((section, index) => (
                            <View
                                key={section.id}
                                className="bg-white rounded-2xl p-5 border border-gray-100"
                                style={styles.shadowCard}
                            >
                                <View className="flex-row items-center mb-3">
                                    <View className="bg-gray-50 rounded-full p-3 mr-4">
                                        <Feather name={section.icon} size={20} color={THEME.colors.primary} />
                                    </View>
                                    <View className="flex-1 ">
                                        <Text className="text-lg font-bold text-gray-900 mb-1">
                                            {index + 1}. {section.title}
                                        </Text>
                                    </View>
                                </View>
                                <Text className="text-base text-gray-700 leading-7 pl-1">
                                    {section.content}
                                </Text>
                            </View>
                        ))}
                    </View>

                    {/* Consent */}
                    <View className="bg-gray-50 rounded-2xl p-5">
                        <View className="flex-row items-start">
                            <Feather name="check-circle" size={24} color={THEME.colors.primary} />
                            <View className="flex-1 ml-4">
                                <Text className="text-base font-semibold text-gray-900 mb-2">
                                    Your Consent
                                </Text>
                                <Text className="text-sm text-gray-600 leading-6">
                                    By using our app, you consent to our Privacy Policy and agree to its terms. If you do not agree with this policy, please do not use our service.
                                </Text>
                            </View>
                        </View>
                    </View>
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

export default PrivacyPolicy;
