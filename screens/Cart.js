import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableWithoutFeedback, ImageBackground, StyleSheet } from 'react-native';
import axios from 'axios';
import { COLORS, SIZES } from '../constants';
import { McText } from '../components';

const Cart = ({ route }) => {
  const { userID } = route.params;
  const [purchasedEvents, setPurchasedEvents] = useState([]);
  const baseUrl = Platform.OS === 'android' ? 'http://10.0.2.2:80' : 'http://localhost:80';

  useEffect(() => {
    const fetchPurchasedEvents = async () => {
      try {
        const response = await axios.get(`${baseUrl}/rest/Achat?$filter=userID=${userID}`);
        setPurchasedEvents(response.data.__ENTITIES);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPurchasedEvents();
  }, [userID]);

  const _renderItem = ({ item }) => {
    return (
      <TouchableWithoutFeedback onPress={() => navigation.navigate('EventDetail', { selectedEvent: item })}>
        <View style={styles.eventContainer}>
          <ImageBackground
            source={{ uri: item.logo ? `${baseUrl}/rest/Evenement[${item.__KEY}]/logo?$imageformat=best&$version=1&$expand=logo` : defaultImage }}
            resizeMode="cover"
            style={styles.imageBackground}
          >
            <McText h2>{item.Titre}</McText>
          </ImageBackground>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={purchasedEvents}
        keyExtractor={(item) => item.__KEY}
        renderItem={_renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  eventContainer: {
    marginBottom: 20,
  },
  imageBackground: {
    height: SIZES.width / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Cart;
