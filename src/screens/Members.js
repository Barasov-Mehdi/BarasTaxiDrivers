import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Members = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [carPlate, setCarPlate] = useState('');
    const [carModel, setCarModel] = useState('');
    const [carColor, setCarColor] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const navigation = useNavigation();

    const validateInputs = () => {
        if (isLogin) {
            return email && password;
        } else {
            return firstName && lastName && email && phone && password && carPlate && carModel && carColor;
        }
    };

    const handleSubmit = async () => {
        if (!validateInputs()) {
            Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
            return;
        }

        try {
            if (isLogin) {
                const response = await axios.post('http://192.168.100.43:5000/api/drivers/login', {
                    email,
                    password,
                });

                console.log('Gelen yanıt:', response.data);

                if (response.data.token) {
                    const userId = response.data.driver.id;
                    console.log('Giriş yapan kullanıcının ID\'si:', userId);

                    await AsyncStorage.setItem('token', response.data.token);
                    await AsyncStorage.setItem('driverId', userId);
                    navigation.navigate('Home');
                } else {
                    Alert.alert('Giriş Hatası', 'E-posta veya şifre yanlış.');
                }
            } else {
                // Kayıt olma işlemleri burada
                const response = await axios.post('http://192.168.100.43:5000/api/drivers/register', {
                    firstName,
                    lastName,
                    email,
                    phone,
                    password,
                    carPlate,
                    carModel,
                    carColor,
                });

                console.log('Kayıt yanıtı:', response.data);

                if (response.data.token) {
                    const userId = response.data.driver.id;
                    console.log('Kayıt olan kullanıcının ID\'si:', userId);

                    await AsyncStorage.setItem('token', response.data.token);
                    await AsyncStorage.setItem('driverId', userId);
                    navigation.navigate('Home');
                }
            }
        } catch (error) {
            Alert.alert('Hata', 'Bir hata oluştu: ' + (error.response?.data?.msg || error.message));
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{isLogin ? 'Giriş Yap' : 'Kayıt Ol'}</Text>

            {!isLogin && (
                <>
                    <TextInput
                        style={styles.input}
                        placeholder="Ad"
                        value={firstName}
                        onChangeText={setFirstName}
                        placeholderTextColor="gray"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Soyad"
                        value={lastName}
                        onChangeText={setLastName}
                        placeholderTextColor="gray"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Telefon Numarası"
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                        placeholderTextColor="gray"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Araç Plakası"
                        value={carPlate}
                        onChangeText={setCarPlate}
                        placeholderTextColor="gray"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Araç Modeli"
                        value={carModel}
                        onChangeText={setCarModel}
                        placeholderTextColor="gray"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Araç Rengi"
                        value={carColor}
                        onChangeText={setCarColor}
                        placeholderTextColor="gray"
                    />
                </>
            )}

            <TextInput
                style={styles.input}
                placeholder="E-posta"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                placeholderTextColor="gray"
            />

            <TextInput
                style={styles.input}
                placeholder="Şifre"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor="gray"
            />

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>{isLogin ? 'Giriş Yap' : 'Kayıt Ol'}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
                <Text style={styles.toggleText}>
                    {isLogin ? 'Hesabınız yok mu? Kayıt olun' : 'Hesabınız var mı? Giriş yapın'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
        color:'black'
    },
    button: {
        backgroundColor: '#007BFF',
        borderRadius: 8,
        padding: 15,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    toggleText: {
        color: '#007BFF',
        textAlign: 'center',
        marginTop: 15,
    }
});

export default Members;