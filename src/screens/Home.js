import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/HomeStyle';
import Icon from 'react-native-vector-icons/Ionicons'; // İkonları kullanabilmek için FontAwesome'u içe aktarıyoruz
// import Sound from 'react-native-sound'; // `react-native-sound`'u içe aktarın
import PushNotification from 'react-native-push-notification';
const DriverHome = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [driverDetails, setDriverDetails] = useState({});
  const [prevOrderCount, setPrevOrderCount] = useState(0);

 

  useEffect(() => {
    fetchDriverDetails(); // Sürücü detaylarını al
    fetchOrders(); // Siparişleri al
    const intervalId = setInterval(fetchOrders, 5000);

    return () => clearInterval(intervalId); // Bileşen unmount olduğunda interval'ı temizle
  }, []);

  const fetchDriverDetails = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const driverId = await AsyncStorage.getItem('driverId'); // driverId'yi de kontrol et
      console.log("Driver ID: ", driverId); // ID'yi kontrol et

      if (driverId) {
        const response = await axios.get(`http://192.168.100.43:5000/api/drivers/profile/${driverId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log("Driver Details: ", response.data);
        setDriverDetails(response.data); // Sürücü detaylarını ayarla
      } else {
        console.error("Driver ID not found in AsyncStorage");
      }
    } catch (error) {
      console.error("Error fetching driver details: ", error);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get('http://192.168.100.43:5000/api/taxis/requests', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log("Orders Response: ", response.data); // API yanıtını kontrol et
      const availableOrders = response.data.filter(order => !order.isTaken);

      setOrders(availableOrders);
    } catch (error) {
      Alert.alert('Hata', 'Siparişler alınırken bir hata oluştu.');
      console.error("Error fetching orders: ", error); // Hata detaylarını kontrol et
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOrder = (order) => {
    Alert.alert(
      "Sipariş Seçimi",
      `Mevcut Adres: ${order.currentAddress}\nGidilecek Adres: ${order.destinationAddress}\nSiparişi almak ister misiniz?`,
      [
        {
          text: "Hayır",
          onPress: () => console.log("İptal edildi"),
          style: "cancel"
        },
        {
          text: "Evet",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              console.log("Taking order for: ", order._id); // Alınan siparişi kontrol et
              const takeOrderResponse = await axios.post('http://192.168.100.43:5000/api/taxis/takeOrder', {
                requestId: order._id,
                tel: order.tel,
                name: order.name,
                driverId: driverDetails._id
              }, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                }
              });

              console.log("Take Order Response: ", takeOrderResponse.data); // Siparişi alma yanıtını kontrol et

              await updateDriverDailyOrderCount(driverDetails._id)
              setOrders(orders.filter(o => o._id !== order._id));
              navigation.navigate('OrderDetails', { order });
            } catch (error) {
              Alert.alert('Hata', 'Sipariş alınırken bir hata oluştu.');
              console.error("Error taking order: ", error); // Hata detaylarını kontrol et
            }
          }
        }
      ],
      { cancelable: false }
    );
  };

  const updateDriverDailyOrderCount = async (driverId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log("Updating order count for Driver ID: ", driverId); // Güncellenen sürücü ID'sini kontrol et

      const response = await axios.put(`http://192.168.100.43:5000/api/drivers/${driverId}/updateOrderCount`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      console.log("Update Response: ", response.data); // Güncelleme yanıtını kontrol et
    } catch (error) {
      Alert.alert('Hata', 'Sürücü sipariş sayısını güncellerken bir hata oluştu.');
      console.error("Update Error: ", error.response ? error.response.data : error.message); // Hata detaylarını kontrol et
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleSelectOrder(item)} style={styles.orderCard}>
      <View style={styles.orderContent}>
        <Icon name="home" size={28} color="#ffffff" />
        <View style={styles.addressDetails}>
          <Text style={styles.addressText}>Müştəri Adresi:</Text>
          <Text style={styles.destinationText}>{item.currentAddress}</Text>
        </View>
      </View>
      <View style={styles.orderContent}>
        <Icon name="navigate" size={28} color="#ffffff" />
        <View style={styles.addressDetails}>
          <Text style={styles.addressText}>Gedilecek Adres:</Text>
          <Text style={styles.destinationText}>{item.destinationAddress}</Text>
        </View>
      </View>
      <View style={styles.priceContainer}>
        <Icon name="cash" size={28} color="#ffffff" />
        <Text style={styles.priceText}>Qiymet: {item.price.toFixed(2)} AZN</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false} // Dikey kaydırma çubuğunu gizle
      />
    </View>
  );
};

export default DriverHome;

// en axrinci isleyen