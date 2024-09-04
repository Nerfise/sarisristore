import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Button, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ route, navigation }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [profileImage, setProfileImage] = useState('https://via.placeholder.com/150');

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const storedName = await AsyncStorage.getItem('name');
        const storedEmail = await AsyncStorage.getItem('email');
        const storedAddress = await AsyncStorage.getItem('address');
        const storedProfileImage = await AsyncStorage.getItem('profileImage');

        if (storedName) setName(storedName);
        if (storedEmail) setEmail(storedEmail);
        if (storedAddress) setAddress(storedAddress);
        if (storedProfileImage) setProfileImage(storedProfileImage);
      } catch (error) {
        console.error('Failed to load profile data', error);
      }
    };

    loadProfileData();
  }, []);

  const handleImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.uri);
    }
  };

  const handleSaveChanges = async () => {
    try {
      await AsyncStorage.setItem('name', name);
      await AsyncStorage.setItem('email', email);
      await AsyncStorage.setItem('address', address);
      await AsyncStorage.setItem('profileImage', profileImage);
      
      Alert.alert('Changes Saved', 'Your profile has been updated.');
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save profile data', error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity onPress={handleImagePick}>
          <Image
            source={{ uri: profileImage }}
            style={styles.profileImage}
          />
          <Ionicons name="camera" size={24} color="white" style={styles.cameraIcon} />
        </TouchableOpacity>

        {isEditing ? (
          <View style={styles.editContainer}>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Name"
            />
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              value={address}
              onChangeText={setAddress}
              placeholder="Address"
            />
            <Button title="Save Changes" onPress={handleSaveChanges} color="#007BFF" />
            <Button title="Cancel" onPress={() => setIsEditing(false)} color="#6c757d" />
          </View>
        ) : (
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.email}>{email}</Text>
            <Text style={styles.address}>{address}</Text>
            <View style={styles.buttonContainer}>
              <Button title="Edit Profile" onPress={() => setIsEditing(true)} color="#007BFF" />
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.settingsContainer}>
        <TouchableOpacity onPress={() => navigation.replace('Welcome')}>
          <Text style={styles.settingItem}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 20,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'black',
    borderRadius: 50,
    padding: 5,
  },
  profileInfo: {
    alignItems: 'center',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  address: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
    marginVertical: 10,
  },
  editContainer: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  settingsContainer: {
    justifyContent: 'flex-end',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  settingItem: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007BFF',
    textAlign: 'center',
  },
});

export default ProfileScreen;
