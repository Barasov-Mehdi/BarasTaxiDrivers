import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  orderCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    backgroundColor: '#388e3c', // Daha koyu bir yeşil
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#fff', // Beyaz sınır ekleme
  },
  orderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  addressDetails: {
    marginLeft: 15, // İkon ile metin arasında daha fazla boşluk
  },
  addressText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold', // Kalınlık artırıldı
  },
  destinationText: {
    color: '#e0e0e0', // Açık gri renk
    fontSize: 16,
    paddingLeft: 5,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  priceText: {
    color: '#ffd600', // Daha parlak sarı
    fontSize: 18,
    marginLeft: 5,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: '#e3f2fd', // Açık mavi arka plan
    paddingHorizontal: 10,
    paddingTop: 20, // Üstten boşluk
  },
  listContainer: {
    paddingBottom: 20,
  },
});

export default styles;