import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        //   backgroundColor: '#fff',
        backgroundColor: 'black'
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

export default styles;
