import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';

const Test = () => {
  const bottomSheetHeight = 150;
  const windowHeight = Dimensions.get('window').height;

  return (
    <View style={{ flex: 1 }}>
      {/* Main content scrollable and bottom sheet ke upar visible */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: bottomSheetHeight }} // Bottom sheet jagah ke liye padding
      >
        <Text style={{ fontSize: 20, padding: 20 }}>
          Yeh tumhara upar ka content hoga. Scroll kar sakte ho.
        </Text>
        {/* Aur content */}
      </ScrollView>

      {/* Bottom Fixed Sheet */}
      <View style={[styles.bottomSheet, { height: bottomSheetHeight }]}>
        <Text style={{ fontSize: 18, textAlign: 'center' }}>
          Yeh bottom fixed sheet content hai, hamesha visible rahega.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderColor: '#ccc',
    borderWidth: 1,
    elevation: 10, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    justifyContent: 'center',
    padding: 16,
  },
});

export default Test;
