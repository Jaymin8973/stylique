import { AntDesign, Feather, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { THEME } from '../../constants/Theme';
import { ThemedContainer, ThemedSection } from '../../components/ThemedComponents';
import { Image } from 'expo-image';

const AboutUs = () => {
  const router = useRouter();

  const stats = [
    { id: 1, value: '10K+', label: 'Happy Customers', icon: 'users', iconSet: 'Feather' },
    { id: 2, value: '5K+', label: 'Products', icon: 'shopping-bag', iconSet: 'Feather' },
    { id: 3, value: '50+', label: 'Brands', icon: 'award', iconSet: 'Feather' },
    { id: 4, value: '24/7', label: 'Support', icon: 'headphones', iconSet: 'Feather' },
  ];

  const values = [
    {
      id: 1,
      title: 'Quality First',
      description: 'We curate only the finest products from trusted brands',
      icon: 'star',
      iconSet: 'Feather',
      color: '#FFD700'
    },
    {
      id: 2,
      title: 'Customer Focused',
      description: 'Your satisfaction is our top priority',
      icon: 'heart',
      iconSet: 'Feather',
      color: '#FF6B6B'
    },
    {
      id: 3,
      title: 'Innovation',
      description: 'Constantly evolving to serve you better',
      icon: 'zap',
      iconSet: 'Feather',
      color: '#4ECDC4'
    },
    {
      id: 4,
      title: 'Sustainability',
      description: 'Committed to eco-friendly practices',
      icon: 'cloud',
      iconSet: 'Feather',
      color: '#95E1D3'
    },
  ];

  const contactInfo = [
    {
      id: 1,
      title: 'Email',
      value: 'support@stylique.com',
      icon: 'mail',
      iconSet: 'Feather',
      action: () => Linking.openURL('mailto:support@stylique.com')
    },
    {
      id: 2,
      title: 'Phone',
      value: '+916353689938',
      icon: 'phone',
      iconSet: 'Feather',
      action: () => Linking.openURL('tel:+916353689938')
    },
    {
      id: 3,
      title: 'Location',
      value: 'Ahmedabad, Gujarat',
      icon: 'map-pin',
      iconSet: 'Feather',
      action: null
    },
  ];

  const socialMedia = [
    { id: 1, name: 'Instagram', icon: 'instagram', iconSet: 'Feather', url: 'https://instagram.com' },
    { id: 2, name: 'Facebook', icon: 'facebook', iconSet: 'Feather', url: 'https://facebook.com' },
    { id: 3, name: 'Twitter', icon: 'twitter', iconSet: 'Feather', url: 'https://twitter.com' },
    { id: 4, name: 'LinkedIn', icon: 'linkedin', iconSet: 'Feather', url: 'https://linkedin.com' },
  ];

  const renderIcon = (iconSet, iconName, size, color) => {
    switch (iconSet) {
      case 'Feather':
        return <Feather name={iconName} size={size} color={color} />;
      case 'FontAwesome5':
        return <FontAwesome5 name={iconName} size={size} color={color} />;
      case 'AntDesign':
        return <AntDesign name={iconName} size={size} color={color} />;
      case 'MaterialCommunityIcons':
        return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
      default:
        return <Feather name={iconName} size={size} color={color} />;
    }
  };

  return (
    <ThemedContainer className='bg-white'>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <ThemedSection className="pt-4 pb-6">
          {/* Hero Section */}
          <View className="mb-8">
            <View className="bg-gradient-to-br from-gray-900 to-gray-700 rounded-3xl p-8 items-center" style={styles.heroCard}>
              <Image
                source={require('../../assets/images/Stylique_Text_Logo_white.png')}
                style={{ width: 200, height: 80 }}
                contentFit="contain"
              />

              <Text className="text-lg text-gray-200 text-center mt-2">
                Your Style, Our Passion
              </Text>
            </View>
          </View>

          {/* Our Story */}
          <View className="mb-8">
            <Text className="text-2xl font-bold text-gray-900 mb-4">Our Story</Text>
            <View className="bg-white rounded-2xl p-5 border border-gray-100" style={styles.shadowCard}>
              <Text className="text-base text-gray-700 leading-7 mb-4">
                Founded in 2025, Stylique emerged from a simple vision: to make premium fashion accessible to everyone. We believe that style is a form of self-expression, and everyone deserves to look and feel their best.
              </Text>
              <Text className="text-base text-gray-700 leading-7">
                Today, we're proud to serve thousands of customers worldwide, offering a carefully curated selection of products from the world's most beloved brands. Our commitment to quality, authenticity, and exceptional customer service has made us a trusted name in online fashion retail.
              </Text>
            </View>
          </View>

          {/* Statistics */}
          <View className="mb-8">
            <Text className="text-2xl font-bold text-gray-900 mb-4">Our Impact</Text>
            <View className="flex-row flex-wrap gap-3">
              {stats.map((stat) => (
                <View
                  key={stat.id}
                  className="bg-white rounded-2xl p-5 border border-gray-100 flex-1 min-w-[45%]"
                  style={styles.shadowCard}
                >
                  <View className="items-center">
                    {renderIcon(stat.iconSet, stat.icon, 32, THEME.colors.primary)}
                    <Text className="text-3xl font-bold text-gray-900 mt-3">{stat.value}</Text>
                    <Text className="text-sm text-gray-600 mt-1 text-center">{stat.label}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Mission */}
          <View className="mb-8">
            <Text className="text-2xl font-bold text-gray-900 mb-4">Our Mission</Text>
            <View className="bg-black rounded-2xl p-6" style={styles.shadowCard}>
              <Text className="text-lg text-white leading-7 text-center">
                "To empower individuals to express their unique style through high-quality, sustainable fashion while delivering an exceptional shopping experience."
              </Text>
            </View>
          </View>

          {/* Core Values */}
          <View className="mb-8">
            <Text className="text-2xl font-bold text-gray-900 mb-4">Our Values</Text>
            <View className="gap-3">
              {values.map((value) => (
                <View
                  key={value.id}
                  className="bg-white rounded-2xl p-5 border border-gray-100"
                  style={styles.shadowCard}
                >
                  <View className="flex-row items-start">
                    <View
                      className="rounded-full p-3 mr-4"
                      style={{ backgroundColor: value.color + '20' }}
                    >
                      {renderIcon(value.iconSet, value.icon, 24, value.color)}
                    </View>
                    <View className="flex-1">
                      <Text className="text-lg font-bold text-gray-900 mb-1">
                        {value.title}
                      </Text>
                      <Text className="text-base text-gray-600 leading-6">
                        {value.description}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Contact Information */}
          <View className="mb-8">
            <Text className="text-2xl font-bold text-gray-900 mb-4">Get in Touch</Text>
            <View className="gap-3">
              {contactInfo.map((contact) => (
                <TouchableOpacity
                  key={contact.id}
                  onPress={contact.action}
                  disabled={!contact.action}
                  className="bg-white rounded-2xl p-4 border border-gray-100"
                  style={styles.shadowCard}
                >
                  <View className="flex-row items-center">
                    <View className="bg-gray-50 rounded-full p-3 mr-4">
                      {renderIcon(contact.iconSet, contact.icon, 20, THEME.colors.primary)}
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm text-gray-600 mb-1">{contact.title}</Text>
                      <Text className="text-base font-semibold text-gray-900">
                        {contact.value}
                      </Text>
                    </View>
                    {contact.action && (
                      <Feather name="external-link" size={18} color={THEME.colors.text.secondary} />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Social Media */}
          <View className="mb-6">
            <Text className="text-2xl font-bold text-gray-900 mb-4">Follow Us</Text>
            <View className="flex-row justify-around bg-white rounded-2xl p-5 border border-gray-100" style={styles.shadowCard}>
              {socialMedia.map((social) => (
                <TouchableOpacity
                  key={social.id}
                  onPress={() => Linking.openURL(social.url)}
                  className="items-center"
                >
                  <View className="bg-gray-50 rounded-full p-4 mb-2">
                    {renderIcon(social.iconSet, social.icon, 24, THEME.colors.primary)}
                  </View>
                  <Text className="text-xs text-gray-600">{social.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* CTA Section */}
          <View className="bg-gray-50 rounded-2xl p-6 items-center">
            <Text className="text-xl font-bold text-gray-900 mb-2">Join Our Journey</Text>
            <Text className="text-gray-600 text-center mb-5">
              Be part of our growing community and stay updated with the latest trends
            </Text>
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => router.push('(drawer)/(tabs)/home')}
                className="bg-black rounded-full py-3 px-6"
              >
                <Text className="text-white font-semibold">Shop Now</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push('Support')}
                className="bg-white border-2 border-black rounded-full py-3 px-6"
              >
                <Text className="text-black font-semibold">Contact Us</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ThemedSection>
      </ScrollView>
    </ThemedContainer>
  );
};

const styles = StyleSheet.create({
  heroCard: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    backgroundColor: '#1a1a1a',
  },
  shadowCard: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
});

export default AboutUs;