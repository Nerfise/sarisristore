import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';

const paymentMethods = [
  { id: '1', name: 'Credit Card', icon: '💳' },
  { id: '2', name: 'PayPal', icon: '💵' },
  { id: '3', name: 'GCash', icon: '📱' },
  { id: '4', name: 'Bank Transfer', icon: '🏦' },
];

const PaymentMethodsScreen = ({ navigation }) => {
  const handleSelectPaymentMethod = (method) => {
    // Handle payment method selection here
    console.log(`Selected payment method: ${method.name}`);
    // Navigate to another screen or proceed with payment
    // navigation.navigate('NextScreen');
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.methodItem} onPress={() => handleSelectPaymentMethod(item)}>
      <Text style={styles.icon}>{item.icon}</Text>
      <Text style={styles.methodName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={paymentMethods}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#FDF0F3', // Use a solid background color
  },
  listContainer: {
    paddingBottom: 30,
  },
  methodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#DDDDDD',
    marginBottom: 10,
    borderRadius: 8,
  },
  icon: {
    fontSize: 24,
    marginRight: 15,
  },
  methodName: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
});

export default PaymentMethodsScreen;
