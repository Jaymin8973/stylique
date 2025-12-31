import { AntDesign, Feather, FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Linking, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { THEME } from '@constants/Theme';
import { ThemedContainer, ThemedSection } from '@components/ThemedComponents';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Support = () => {
  const router = useRouter();
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [contactType, setContactType] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [submitModalVisible, setSubmitModalVisible] = useState(false);

  // Bottom Sheet refs
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['65%'], []);

  const faqData = [
    {
      id: 1,
      question: 'How do I track my order?',
      answer: 'You can track your order by going to "My Orders" section in your profile. Click on any order to see detailed tracking information and delivery status.'
    },
    {
      id: 2,
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy for all items. Products must be unused and in original packaging. Contact our support team to initiate a return.'
    },
    {
      id: 3,
      question: 'How long does delivery take?',
      answer: 'Standard delivery takes 3-5 business days. Express delivery is available and takes 1-2 business days. Delivery times may vary based on your location.'
    },
    {
      id: 4,
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit/debit cards, UPI, net banking, and digital wallets. All payments are secured with industry-standard encryption.'
    },
    {
      id: 5,
      question: 'How do I apply a voucher code?',
      answer: 'You can apply voucher codes at checkout. Enter your code in the "Voucher Code" field and click apply. The discount will be reflected in your total.'
    },
    {
      id: 6,
      question: 'Can I modify my order after placing it?',
      answer: 'Orders can be modified within 1 hour of placement. After that, please contact our support team for assistance.'
    }
  ];

  const supportOptions = [
    {
      id: 1,
      title: 'Email Support',
      description: 'Get help via email',
      icon: 'mail',
      iconSet: 'Ionicons',
      action: () => openContactBottomSheet('email')
    },
    {
      id: 2,
      title: 'Live Chat',
      description: 'Chat with our team',
      icon: 'message-circle',
      iconSet: 'Feather',
      action: () => openContactBottomSheet('chat')
    },
    {
      id: 3,
      title: 'Call Us',
      description: '+916353689938',
      icon: 'phone',
      iconSet: 'Feather',
      action: () => Linking.openURL('tel:+916353689938')
    },
    {
      id: 4,
      title: 'WhatsApp',
      description: 'Message us on WhatsApp',
      icon: 'whatsapp',
      iconSet: 'FontAwesome5',
      action: () => Linking.openURL('https://wa.me/+916353689938')
    }
  ];

  const quickLinks = [
    {
      id: 1,
      title: 'My Orders',
      icon: 'shopping-bag',
      iconSet: 'Feather',
      route: 'MyOrders'
    },
    {
      id: 2,
      title: 'Track Order',
      icon: 'map-pin',
      iconSet: 'Feather',
      route: '(screens)/TrackOrder'
    },
    {
      id: 3,
      title: 'Delivery Address',
      icon: 'map-marker-alt',
      iconSet: 'FontAwesome5',
      route: '(screens)/Address'
    },
    {
      id: 4,
      title: 'Payment Methods',
      icon: 'credit-card',
      iconSet: 'Feather',
      route: '(screens)/PaymentMethod'
    }
  ];

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const openContactBottomSheet = (type) => {
    setContactType(type);
    bottomSheetRef.current?.expand();
  };

  const closeBottomSheet = () => {
    bottomSheetRef.current?.close();
  };

  const handleSubmitContact = () => {
    closeBottomSheet();
    setSubmitModalVisible(true);
    setMessage('');
    setEmail('');
  };

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );

  const renderIcon = (iconSet, iconName, size, color) => {
    switch (iconSet) {
      case 'Feather':
        return <Feather name={iconName} size={size} color={color} />;
      case 'FontAwesome5':
        return <FontAwesome5 name={iconName} size={size} color={color} />;
      case 'Ionicons':
        return <Ionicons name={iconName} size={size} color={color} />;
      case 'MaterialCommunityIcons':
        return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
      default:
        return <Feather name={iconName} size={size} color={color} />;
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemedContainer className='bg-white'>
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <ThemedSection className="pt-4 pb-6">
            {/* Header */}
            <View className="mb-6">
              <Text className="text-3xl font-bold text-gray-900 mb-2">How can we help?</Text>
              <Text className="text-gray-600">We're here to assist you with any questions</Text>
            </View>

            {/* Quick Links */}
            <View className="mb-8">
              <Text className="text-xl font-bold text-gray-900 mb-4">Quick Links</Text>
              <View className="flex-row flex-wrap gap-3">
                {quickLinks.map((link) => (
                  <TouchableOpacity
                    key={link.id}
                    onPress={() => router.push(link.route)}
                    className="bg-white rounded-2xl p-4 border border-gray-100 flex-1 min-w-[45%]"
                    style={styles.shadowCard}
                  >
                    <View className="items-center gap-2">
                      {renderIcon(link.iconSet, link.icon, 24, THEME.colors.primary)}
                      <Text className="text-sm font-semibold text-gray-900 text-center">
                        {link.title}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Contact Support */}
            <View className="mb-8">
              <Text className="text-xl font-bold text-gray-900 mb-4">Contact Support</Text>
              <View className="gap-3">
                {supportOptions.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    onPress={option.action}
                    className="bg-white rounded-2xl p-4 border border-gray-100"
                    style={styles.shadowCard}
                  >
                    <View className="flex-row items-center">
                      <View className="bg-gray-50 rounded-full p-3 mr-4">
                        {renderIcon(option.iconSet, option.icon, 24, THEME.colors.primary)}
                      </View>
                      <View className="flex-1">
                        <Text className="text-base font-semibold text-gray-900">
                          {option.title}
                        </Text>
                        <Text className="text-sm text-gray-600 mt-1">
                          {option.description}
                        </Text>
                      </View>
                      <Feather name="chevron-right" size={20} color={THEME.colors.text.secondary} />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* FAQs */}
            <View className="mb-6">
              <Text className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</Text>
              <View className="gap-3">
                {faqData.map((faq) => (
                  <View
                    key={faq.id}
                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
                    style={styles.shadowCard}
                  >
                    <TouchableOpacity
                      onPress={() => toggleFaq(faq.id)}
                      className="p-4 flex-row justify-between items-center"
                    >
                      <Text className="text-base font-semibold text-gray-900 flex-1 pr-4">
                        {faq.question}
                      </Text>
                      <AntDesign
                        name={expandedFaq === faq.id ? 'up' : 'down'}
                        size={16}
                        color={THEME.colors.text.secondary}
                      />
                    </TouchableOpacity>
                    {expandedFaq === faq.id && (
                      <View className="px-4 pb-4 pt-0">
                        <View className="border-t border-gray-100 pt-3">
                          <Text className="text-gray-600 leading-6">{faq.answer}</Text>
                        </View>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </View>

            {/* Additional Help */}
            <View className="bg-gray-50 rounded-2xl p-6 items-center">
              <Feather name="help-circle" size={48} color={THEME.colors.primary} />
              <Text className="text-lg font-bold text-gray-900 mt-4 mb-2">Still need help?</Text>
              <Text className="text-gray-600 text-center mb-4">
                Our support team is available 24/7 to assist you
              </Text>
              <TouchableOpacity
                onPress={() => router.push('(screens)/Feedback')}
                className="bg-black rounded-full py-3 px-8"
              >
                <Text className="text-white font-semibold">Send Feedback</Text>
              </TouchableOpacity>
            </View>
          </ThemedSection>
        </ScrollView>

        {/* Bottom Sheet for Contact */}
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          backdropComponent={renderBackdrop}
          backgroundStyle={{ backgroundColor: 'white' }}
          handleIndicatorStyle={{ backgroundColor: '#D1D5DB' }}
        >
          <BottomSheetView style={styles.bottomSheetContent}>
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-2xl font-bold">
                {contactType === 'email' ? 'Email Support' : 'Live Chat'}
              </Text>
              <TouchableOpacity onPress={closeBottomSheet}>
                <AntDesign name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>

            <View className="gap-4">
              <View>
                <Text className="text-base font-semibold mb-2">Your Email</Text>
                <TextInput
                  className="bg-gray-50 rounded-xl p-4 text-base"
                  placeholder="Enter your email"
                  placeholderTextColor="gray"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                />
              </View>

              <View>
                <Text className="text-base font-semibold mb-2">Message</Text>
                <TextInput
                  className="bg-gray-50 rounded-xl p-4 text-base"
                  placeholder="How can we help you?"
                  placeholderTextColor="gray"
                  value={message}
                  onChangeText={setMessage}
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                  style={{ height: 150 }}
                />
              </View>

              <TouchableOpacity
                onPress={handleSubmitContact}
                className="bg-black rounded-full py-4 mt-2"
                disabled={!email || !message}
                style={{ opacity: (!email || !message) ? 0.5 : 1 }}
              >
                <Text className="text-white text-center font-bold text-base">Send Message</Text>
              </TouchableOpacity>
            </View>
          </BottomSheetView>
        </BottomSheet>

        {/* Success Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={submitModalVisible}
          onRequestClose={() => setSubmitModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent} className="mx-10">
              <View className="gap-7 justify-center items-center">
                <AntDesign name="checkcircle" size={50} color="black" />
                <Text className="text-2xl font-bold text-center">Message Sent!</Text>
                <Text className="text-base text-gray-600 text-center">
                  Thank you for contacting us. Our support team will get back to you within 24 hours.
                </Text>
                <TouchableOpacity
                  onPress={() => setSubmitModalVisible(false)}
                  style={styles.closeButton}
                >
                  <Text className="text-white font-semibold">Done</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ThemedContainer>
    </GestureHandlerRootView>
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
  bottomSheetContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 500,
  },
  closeButton: {
    backgroundColor: 'black',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
});

export default Support;