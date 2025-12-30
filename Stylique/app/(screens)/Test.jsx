import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';

const Test = () => {
  const bottomSheetHeight = 150;
  const windowHeight = Dimensions.get('window').height;

  return (
    <View style={{ flex: 1 }}>
      {/* Main content scrollable and bottom sheet ke upar visible */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: bottomSheetHeight }} // Padding for bottom sheet
      >
        <Text style={{ fontSize: 20, padding: 20 }}>
          This will be your top content. You can scroll.
        </Text>
        {/* More content */}
      </ScrollView>

      {/* Bottom Fixed Sheet */}
      <View style={[styles.bottomSheet, { height: bottomSheetHeight }]}>
        <Text style={{ fontSize: 18, textAlign: 'center' }}>
          This is bottom fixed sheet content, always visible.
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
