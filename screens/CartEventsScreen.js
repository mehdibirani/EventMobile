import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, SafeAreaView, FlatList, ImageBackground, TouchableWithoutFeedback, Platform } from 'react-native';
import axios from 'axios';
import moment from 'moment';
import { useRoute } from '@react-navigation/native';
import styled from 'styled-components/native';
import { McText, McIcon } from '../components';
import { SIZES, COLORS, icons } from '../constants';

const CartEventsScreen = ({ navigation }) => {
  const [cartEvents, setCartEvents] = useState([]);
  const baseUrl = Platform.OS === 'android' ? 'http://10.0.2.2:80' : 'http://localhost:80';
  const route = useRoute();
  const { userID } = route.params || {};

  useEffect(() => {
    const fetchCartEvents = async () => {
      try {
        const response = await axios.get(`${baseUrl}/rest/Achat?$filter="userID=${userID}"`);
        const responseData = response.data;

        if (responseData.__ENTITIES && Array.isArray(responseData.__ENTITIES)) {
          const events = responseData.__ENTITIES;
          const uniqueEventIDs = [...new Set(events.map(event => event.EventID))];
          const eventPromises = uniqueEventIDs.map(async (eventID) => {
            const eventResponse = await axios.get(`${baseUrl}/rest/Evenement?$filter="EventID=${eventID}"`);
            return eventResponse.data.__ENTITIES[0];
          });

          const eventDetails = await Promise.all(eventPromises);
          setCartEvents(eventDetails);
        }
      } catch (error) {
        console.error("Error fetching cart events:", error);
      }
    };

    fetchCartEvents();
  }, [userID]);

  const parseCustomDateFormat = (dateString) => {
    const [day, month, year] = dateString.split('!');
    return `${year}-${month}-${day}`;
  };

  const getDaysRemaining = (startDate) => {
    const today = moment();
    const eventDate = moment(parseCustomDateFormat(startDate), 'YYYY-MM-DD');
    const diffDays = eventDate.diff(today, 'days');
    return diffDays < 0 ? `- ${Math.abs(diffDays)}j` : `+ ${diffDays}j`;
  };

  const renderEventItem = ({ item }) => {
    const parsedStartDate = parseCustomDateFormat(item.startDate);
    const daysRemaining = getDaysRemaining(item.startDate);

    return (
      <TouchableWithoutFeedback
        onPress={() => navigation.navigate('EventDetail', { selectedEvent: item, userID })}
      >
        <View style={styles.eventItem}>
          <ImageBackground
            source={{
              uri: item.logo
                ? `${baseUrl}/rest/Evenement[${item.__KEY}]/logo?$imageformat=best&$version=1&$expand=logo`
                : 'https://www.ac-consulting.fr/wp-content/uploads/2022/02/logo4Dv19_210x210.png',
            }}
            resizeMode='cover'
            style={styles.imageBackground}
          >
            <View style={styles.dateBox}>
              <McText body5 color={COLORS.white} style={styles.dateText}>
                {moment(parsedStartDate, 'YYYY-MM-DD').format('MMM').toUpperCase()}
              </McText>
              <McText h2 color={COLORS.white}>
                {moment(parsedStartDate, 'YYYY-MM-DD').format('DD')}
              </McText>
            </View>
            <View style={styles.daysRemainingBox}>
              <McText body4 color={COLORS.white} style={styles.daysRemainingText}>
                {daysRemaining}
              </McText>
            </View>
          </ImageBackground>
          <View style={styles.eventDetails}>
            <McText body5 style={styles.eventCategory}>
              {item.categorie}
            </McText>
            <McText h2 style={styles.eventTitle}>
              {item.Titre}
            </McText>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <SectionHeader>
        <View>
          <McText body5 style={styles.headerDate}>DECEMBER 24, 9:10 PM</McText>
          <McText h1>My Cart</McText>
        </View>
        <HeaderIconsContainer>
          <TouchableWithoutFeedback
            onPress={() => navigation.navigate('Featured')}
          >
            <McIcon source={icons.filter} size={80} />
          </TouchableWithoutFeedback>
        </HeaderIconsContainer>
      </SectionHeader>
      <FlatList
        data={cartEvents}
        renderItem={renderEventItem}
        keyExtractor={(item) => item.__KEY}
        contentContainerStyle={styles.flatListContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  headerDate: {
    color: COLORS.white,
    opacity: 0.5,
  },
  eventItem: {
    marginBottom: 20,
    marginHorizontal: 10,
  },
  imageBackground: {
    width: SIZES.width - 20,
    height: SIZES.width / 2 + 70,
    borderRadius: 25,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  dateBox: {
    padding: 5,
    backgroundColor: COLORS.gray,
    borderRadius: 15,
    margin: 15,
    alignSelf: 'flex-start',
  },
  dateText: {
    fontSize: 14,
    opacity: 0.5,
    letterSpacing: 2,
  },
  daysRemainingBox: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: COLORS.black,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 15,
  },
  daysRemainingText: {
    fontSize: 18, // Augmenter la taille de la police pour les jours restants
    fontWeight: 'bold',
  },
  eventDetails: {
    margin: 20,
  },
  eventTitle: {
    color: COLORS.white,
  },
  eventCategory: {
    color: COLORS.gray,
    opacity: 0.5,
  },
  flatListContent: {
    paddingHorizontal: 10,
  },
});

const SectionHeader = styled.View`
  margin: 30px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const HeaderIconsContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
`;

export default CartEventsScreen;
