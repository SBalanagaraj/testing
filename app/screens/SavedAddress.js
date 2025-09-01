import React from 'react';
import {View, Text, FlatList, StyleSheet, Dimensions} from 'react-native';
import {useSelector} from 'react-redux';
import HeaderBlock from '../Components/HeaderBlock';

const {width} = Dimensions.get('window');

export default function AddressList() {
  const {savedAddress} = useSelector(state => state.setting);

  const renderItem = ({item}) => (
    <View style={styles.card}>
      <Text style={styles.title}>
        Flat No: {item.flatNo}, {item.apartmentName}
      </Text>
      <Text style={styles.detail}>
        {item.city}, {item.state}
      </Text>
      <Text style={styles.detail}>
        {item.country} - {item.pincode}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <HeaderBlock leftIcon title="Saved Addresses" />
      <FlatList
        data={savedAddress}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.container}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    width: width * 0.9, // responsive width
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 3},
    shadowRadius: 5,
    elevation: 10,
    alignSelf: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  detail: {
    fontSize: 14,
    color: '#555',
    marginBottom: 3,
  },
});
