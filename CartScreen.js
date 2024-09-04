import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Button, Alert, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CartContext } from '../context/CartContext';
import { firestore } from '../config/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

const CartScreen = ({ navigation }) => {
  const { cartItems, removeFromCartItem, clearCart } = useContext(CartContext);

  const handleCheckout = async () => {
    try {
      // Reference to Firestore collection
      const ordersCollection = collection(firestore, 'orders');

      // Prepare order data
      const orderData = {
        items: cartItems,
        createdAt: Timestamp.now(),
        status: 'pending', // Or whatever status you want to set
      };

      // Add order to Firestore
      await addDoc(ordersCollection, orderData);

      // Clear cart after successful checkout
      clearCart();

      Alert.alert('Success', 'Your order has been placed!');
      navigation.navigate('HomeScreen');
    } catch (error) {
      console.error('Error adding document: ', error);
      Alert.alert('Error', 'There was an issue placing your order.');
    }
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
      <Text style={styles.itemPrice}>{item.price}</Text>
      <TouchableOpacity onPress={() => removeFromCartItem(item.id)} style={styles.removeButton}>
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  const calculateTotal = () => {
    let total = 0;
    cartItems.forEach(item => {
      // Assuming price is a string like 'Php5000', so we need to remove 'Php' and convert to number
      const price = parseFloat(item.price.replace('Php', '').replace(',', ''));
      total += price * item.quantity;
    });
    return total.toFixed(2); // Format as a decimal number with 2 decimal places
  };

  return (
    <ImageBackground source={require('../assets/onlinegrocery.jpg')} style={styles.backgroundImage}>
      <LinearGradient colors={['rgba(255,255,255,0.6)', 'rgba(255,255,255,0.8)']} style={styles.container}>
        <FlatList
          data={cartItems}
          renderItem={renderCartItem}
          keyExtractor={(item) => item.id}
        />
        <View style={styles.footer}>
          <Text style={styles.totalPrice}>Total Price: Php{calculateTotal()}</Text>
          <Button title="Clear Cart" onPress={clearCart} />
          <Button title="Checkout" onPress={handleCheckout} />
        </View>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  cartItem: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 10,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemQuantity: {
    fontSize: 14,
  },
  itemPrice: {
    fontSize: 14,
    color: '#007bff',
  },
  removeButton: {
    marginTop: 10,
    backgroundColor: '#f00',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CartScreen;
