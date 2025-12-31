import { Feather } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { THEME } from '@constants/Theme';
import { ThemedContainer, ThemedSection } from '@components/ThemedComponents';

const TermsOfUse = () => {
    const sections = [
        {
            id: 1,
            title: 'Acceptance of Terms',
            icon: 'check-circle',
            content: 'By accessing and using Stylique, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our service.'
        },
        {
            id: 2,
            title: 'Use License',
            icon: 'file-text',
            content: 'Permission is granted to temporarily download one copy of the materials on Stylique for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.'
        },
        {
            id: 3,
            title: 'Account Responsibilities',
            icon: 'user',
            content: 'You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.'
        },
        {
            id: 4,
            title: 'Prohibited Activities',
            icon: 'x-circle',
            content: 'You may not use our service for any illegal or unauthorized purpose. You must not transmit any worms, viruses, or any code of a destructive nature.'
        },
        {
            id: 5,
            title: 'Product Information',
            icon: 'shopping-bag',
            content: 'We strive to provide accurate product descriptions and pricing. However, we do not warrant that product descriptions, pricing, or other content is accurate, complete, reliable, current, or error-free.'
        },
        {
            id: 6,
            title: 'Orders and Payments',
            icon: 'credit-card',
            content: 'We reserve the right to refuse or cancel any order for any reason. Payment must be received by us before your order is processed and shipped.'
        },
        {
            id: 7,
            title: 'Returns and Refunds',
            icon: 'rotate-ccw',
            content: 'Our return policy allows returns within 30 days of purchase. Items must be unused and in original packaging. Refunds will be processed within 7-10 business days after receiving the returned item.'
        },
        {
            id: 8,
            title: 'Intellectual Property',
            icon: 'award',
            content: 'All content on Stylique, including text, graphics, logos, and images, is the property of Stylique and protected by copyright and trademark laws.'
        },
        {
            id: 9,
            title: 'Limitation of Liability',
            icon: 'shield',
            content: 'Stylique shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.'
        },
        {
            id: 10,
            title: 'Modifications to Terms',
            icon: 'edit',
            content: 'We reserve the right to modify these terms at any time. We will notify users of any changes by updating the "Last Updated" date of these Terms of Use.'
        },
    ];

    return (
        <ThemedContainer className='bg-white'>
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <ThemedSection className="pt-4 pb-6">
                    {/* Header */}
                    <View className="mb-6">
                        <Text className="text-3xl font-bold text-gray-900 mb-2">Terms of Use</Text>
                        <Text className="text-sm text-gray-600">Last Updated: December 24, 2025</Text>
                    </View>

                    {/* Introduction */}
                    <View className="bg-gray-50 rounded-2xl p-5 mb-6">
                        <Text className="text-base text-gray-700 leading-7">
                            Welcome to Stylique. These Terms of Use govern your use of our mobile application and services. Please read these terms carefully before using our app.
                        </Text>
                    </View>

                    {/* Terms Sections */}
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
                                    <View className="flex-1">
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

                    {/* Important Notice */}
                    <View className="bg-black rounded-2xl p-6 mb-6" style={styles.shadowCard}>
                        <View className="items-center">
                            <Feather name="alert-triangle" size={32} color="white" />
                            <Text className="text-xl font-bold text-white mt-4 mb-2">Important</Text>
                            <Text className="text-gray-200 text-center leading-6">
                                By using Stylique, you acknowledge that you have read, understood, and agree to be bound by these Terms of Use. If you do not agree, please discontinue use of our service immediately.
                            </Text>
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

export default TermsOfUse;
