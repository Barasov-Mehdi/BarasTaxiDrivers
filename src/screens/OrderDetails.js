import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, TextInput, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import haversine from 'haversine';

const OrderDetails = ({ route }) => {
  const { order } = route.params; // Retrieve order details from route params
  // const [price, setPrice] = useState(''); // State for price
  const [time, setTime] = useState(''); // State for time
  const [distance, setDistance] = useState(null); // State for distance
  const [totalPrice, setTotalPrice] = useState(0); // State for total price
  const [coordinates, setCoordinates] = useState(null); // State for fetched coordinates

  useEffect(() => {
    // Fetch coordinates when the component mounts
    fetchCoordinates(order.destinationAddress);
  }, [order.destinationAddress]);

  useEffect(() => {
    // Calculate distance if coordinates and order location are available
    if (coordinates && order.coordinates) {
      calculateDistance(coordinates, order.coordinates);
    }
  }, [coordinates, order.coordinates]);

  useEffect(() => {
    // Update total price when distance changes
    if (distance !== null) {
      const pricePerKilometer = 0.57; // Price per kilometer
      const calculatedPrice = (distance / 1000) * pricePerKilometer; 
      setTotalPrice(calculatedPrice);
    }
  }, [distance]);

  const calculateDistance = (coords1, coords2) => {
    const start = { latitude: coords1.lat, longitude: coords1.lng };
    const end = { latitude: coords2.latitude, longitude: coords2.longitude };

    const distanceInMeters = haversine(start, end, { unit: 'meter' });
    setDistance(distanceInMeters); // Distance is set in meters
  };

  const fetchCoordinates = async (address) => {
    const apiKey = 'kNe1BL5qTg94P6U2Jp5EugvlKnw8BDJSG-eC7oQMd_U';
    try {
      const response = await axios.get(`https://geocode.search.hereapi.com/v1/geocode`, {
        params: {
          q: address,
          apiKey,
        },
      });
      const location = response.data.items[0].position; // Assuming there is at least one result
      setCoordinates(location);
    } catch (error) {
      console.error('Coordinate fetching error:', error);
      Alert.alert('Hata', 'Koordinatlar alınırken bir hata oluştu.');
    }
  };

  const handleUpdatePrice = async () => {
    if (!time || isNaN(time)) {
      Alert.alert('Hata', 'Lütfen geçerli bir fiyat ve zaman girin.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      const driverId = await AsyncStorage.getItem('driverId');

      const payload = {
        requestId: order._id,
        time: parseFloat(time),
        driverId,
      };

      const response = await axios.post('http://192.168.100.43:5000/api/taxis/updatePrice', payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      Alert.alert('Başarılı', response.data.message);
      setTime(''); // Clear time input
    } catch (error) {
      console.error('Güncelleme hatası:', error);
      const errorMessage = error.response ? error.response.data.message : 'Fiyat güncellenirken bir hata oluştu.';
      Alert.alert('Hata', errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.header}>Sipariş Detayları</Text>

        {order ? (
          <>
            <View style={styles.infoContainer}>
              <Icon name="home" size={30} color="#4A90E2" />
              <View style={styles.textContainer}>
                <Text style={styles.infoText}>Muştəri adresi:</Text>
                <Text style={styles.infoValue}>{order.currentAddress}</Text>
              </View>
            </View>

            <View style={styles.infoContainer}>
              <Icon name="location-on" size={30} color="#4A90E2" />
              <View style={styles.textContainer}>
                <Text style={styles.infoText}>Gediləcək Yer:</Text>
                <Text style={styles.infoValue}>{order.destinationAddress}</Text>
              </View>
            </View>

            {coordinates && (
              <View style={styles.infoContainer}>
                <Icon name="my-location" size={30} color="#4A90E2" />
                <View style={styles.textContainer}>
                  <Text style={styles.infoText}>Koordinatlar:</Text>
                  <Text style={styles.infoValue}>
                    Enlem: {coordinates.lat}, Boylam: {coordinates.lng}
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.infoContainer}>
              <Icon name="phone" size={30} color="#4A90E2" />
              <View style={styles.textContainer}>
                <Text style={styles.infoText}>Tel:</Text>
                <Text style={styles.infoValue}>{order.tel || 'Yok'}</Text>
              </View>
            </View>

            <View style={styles.infoContainer}>
              <Icon name="person" size={30} color="#4A90E2" />
              <View style={styles.textContainer}>
                <Text style={styles.infoText}>Ad:</Text>
                <Text style={styles.infoValue}>{order.name || 'Yok'}</Text>
              </View>
            </View>

            {distance !== null && (
              <View style={styles.infoContainer}>
                <Text style={styles.infoText}>Mesafe:</Text>
                <Text style={styles.infoValue}>{(distance / 1000).toFixed(1)} km</Text>
              </View>
            )}

            {totalPrice > 0 && (
              <View style={styles.infoContainer}>
                <Text style={styles.infoText}>Toplam Fiyat:</Text>
                <Text style={styles.infoValue}>{totalPrice.toFixed(1)} TL</Text>
              </View>
            )}

            <TextInput
              style={styles.priceInput}
              placeholder="Vaxt"
              keyboardType="numeric"
              value={time}
              onChangeText={setTime} // Should update `time` instead
            />

            <TouchableOpacity style={styles.button} onPress={handleUpdatePrice}>
              <Icon name="attach-money" size={24} color="#FFFFFF" />
              <Text style={styles.buttonText}>Sifarisi Tesdiqle</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.infoText}>Sipariş bilgileri bulunamadı.</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  header: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.5,
    elevation: 6,
    marginBottom: 20,
  },
  textContainer: {
    flexDirection: 'column',
    marginLeft: 15,
  },
  infoText: {
    fontSize: 18,
    color: '#555',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  priceInput: {
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 8,
    padding: 10,
    marginTop: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4287f5',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    flexDirection: 'row',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default OrderDetails;