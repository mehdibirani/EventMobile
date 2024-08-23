import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, SafeAreaView, TextInput, FlatList, ImageBackground, TouchableWithoutFeedback, Platform, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import axios from 'axios';
import moment from 'moment';
import { McText, McIcon, McAvatar } from '../components';
import { FONTS, SIZES, COLORS, icons, images } from '../constants';
import { useRoute } from '@react-navigation/native';

const Featured = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const [cartEvents, setCartEvents] = useState([]);
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState('');
  const baseUrl = Platform.OS === 'android' ? 'http://10.0.2.2:80' : 'http://localhost:80';
  const route = useRoute();
  const { userID } = route.params || {};

  const fetchEvents = async () => {
    try {
      console.log("Fetching data");
      const response = await axios.get(`${baseUrl}/rest/Evenement/$entityset?$skip=${offset}&$top=6`);
      const responseData = response.data;
      console.log("data", responseData);
      console.log("user ID", userID);
//mmmm
//kjhkjh
      if (responseData.__ENTITIES && Array.isArray(responseData.__ENTITIES)) {
        const newEvents = responseData.__ENTITIES.filter(newEvent => !events.find(oldEvent => oldEvent.__KEY === newEvent.__KEY));
        setEvents(prevEvents => [...prevEvents, ...newEvents]);
      } else {
        console.log("Response data does not contain an array of events:", responseData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCartEvents = async () => {
    try {
      const response = await axios.get(`${baseUrl}/rest/Achat?$filter="userID=${userID}"`);
      const responseData = response.data;

      if (responseData.__ENTITIES && Array.isArray(responseData.__ENTITIES)) {
        setCartEvents(responseData.__ENTITIES);
        console.log("res", responseData);
      } else {
        console.log("Response data does not contain an array of events:", responseData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [offset]);

  const handleEndReached = () => {
    setOffset(offset => offset + 6);
  };

  const parseCustomDateFormat = (dateString) => {
    const [day, month, year] = dateString.split('!');
    return `${year}-${month}-${day}`;
  };

  const _renderItem = ({ item, index }) => {
    const parsedStartDate = parseCustomDateFormat(item.startDate);
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          navigation.navigate('EventDetail', { selectedEvent: item, userID });
        }}
      >
        <View style={{
          marginLeft: index === 0 ? 30 : 20,
          marginRight: index === events.length - 1 ? 30 : 0
        }}>
          <ImageBackground
            source={{
              uri: item.logo
                ? `${baseUrl}/rest/Evenement[${item.__KEY}]/logo?$imageformat=best&$version=1&$expand=logo`
                : 'https://www.ac-consulting.fr/wp-content/uploads/2022/02/logo4Dv19_210x210.png',
            }}
            resizeMode='cover'
            borderRadius={25}
            style={{
              width: SIZES.width / 2 + 70,
              height: SIZES.width / 2 + 70,
              justifyContent: 'space-between'
            }}
          >
            <View style={{ alignItems: 'flex-end', marginHorizontal: 15, marginVertical: 15 }}>
              <DateBox>
                <McText body5 color={COLORS.black} style={{ opacity: 0.5, letterSpacing: 2 }}>
                  {moment(parsedStartDate, 'YYYY-MM-DD').format('MMM').toUpperCase()}
                </McText>
                <McText h2 color={COLORS.black}>
                  {moment(parsedStartDate, 'YYYY-MM-DD').format('DD')}
                </McText>
              </DateBox>
            </View>
            <View style={{ marginLeft: 20, marginBottom: 25 }}>
              <McText body5 style={{ opacity: 0.5 }}>
                {item.categorie}
              </McText>
              <McText h2>
                {item.Titre}
              </McText>
            </View>
          </ImageBackground>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const filteredEvents = events.filter(event => event.Titre.toLowerCase().includes(search.toLowerCase()));

  const getCurrentMonthEvents = () => {
    const currentMonth = moment().format('MM');
    return events.filter(event => {
      const eventMonth = moment(parseCustomDateFormat(event.startDate), 'YYYY-MM-DD').format('MM');
      return eventMonth === currentMonth;
    });
  };

  const currentMonthEvents = getCurrentMonthEvents();

  const _renderCurrentMonthItem = ({ item, index }) => {
    const parsedStartDate = parseCustomDateFormat(item.startDate);
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          navigation.navigate('EventDetail', { selectedEvent: item, userID });
        }}
      >
        <View style={{
          margin: 10,
          width: SIZES.width - 40,
        }}>
          <ImageBackground
            source={{
              uri: item.logo
                ? `${baseUrl}/rest/Evenement[${item.__KEY}]/logo?$imageformat=best&$version=1&$expand=logo`
                : 'https://www.ac-consulting.fr/wp-content/uploads/2022/02/logo4Dv19_210x210.png',
            }}
            resizeMode='cover'
            borderRadius={25}
            style={{
              width: '100%',
              height: SIZES.width / 2 + 70,
              justifyContent: 'space-between'
            }}
          >
            <View style={{ alignItems: 'flex-end', marginHorizontal: 15, marginVertical: 15 }}>
              <DateBox>
                <McText body5 color={COLORS.black} style={{ opacity: 0.5, letterSpacing: 2 }}>
                  {moment(parsedStartDate, 'YYYY-MM-DD').format('MMM').toUpperCase()}
                </McText>
                <McText h2 color={COLORS.black}>
                  {moment(parsedStartDate, 'YYYY-MM-DD').format('DD')}
                </McText>
              </DateBox>
            </View>
            <View style={{ marginLeft: 20, marginBottom: 25 }}>
              <McText body5 style={{ opacity: 0.5 }}>
                {item.categorie}
              </McText>
              <McText h2>
                {item.Titre}
              </McText>
            </View>
          </ImageBackground>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <SectionHeader>
        <View>
          <McText body5 style={{ opacity: 0.5 }}>DECEMBER 24, 9:10 PM</McText>
          <McText h1>Explore events</McText>
        </View>
        <HeaderIconsContainer>
          <TouchableOpacity
            onPress={() => {
              fetchCartEvents();
              navigation.navigate('CartEvents', { cartEvents, userID });
            }}
          >
            <McIcon source={icons.filter} size={80} />
          </TouchableOpacity>
          <McAvatar source={images.avatar} />
        </HeaderIconsContainer>
      </SectionHeader>
      <SectionSearch>
        <SearchView>
          <McIcon source={icons.search} size={25} />
          <TextInput
            placeholder="Search"
            placeholderTextColor={COLORS.gray1}
            style={{ color: COLORS.white, width: 250 }}
            value={search}
            onChangeText={setSearch}
          />
          <TouchableOpacity onPress={() => navigation.navigate('FilterScreen')}>
            <McIcon source={icons.filter} size={25} />
          </TouchableOpacity>
        </SearchView>
      </SectionSearch>
      <SectionTitle>
        <McText h5>FEATURED</McText>
      </SectionTitle>
      <View>
        <FlatList
          horizontal
          contentContainerStyle={{}}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => 'event_' + item.__KEY}
          data={filteredEvents}
          renderItem={_renderItem}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
        />
      </View>
      <SectionTitle>
        <McText h5>EVENTS THIS MONTH</McText>
        <TouchableOpacity>
          <McText body4 color={COLORS.primary}>View All</McText>
        </TouchableOpacity>
      </SectionTitle>
      <FlatList
        contentContainerStyle={{ paddingHorizontal: 10 }}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => 'event_' + item.__KEY}
        data={currentMonthEvents.slice(0, 3)}
        renderItem={_renderCurrentMonthItem}
      />
    </SafeAreaView>
  );
};

export default Featured;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
});

const DateBox = styled.View`
    padding: 5px 15px;
    background-color: ${COLORS.gray};
    border-radius: 15px;
`;

const SectionHeader = styled.View`
    margin: 30px 30px 0 30px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const SectionSearch = styled.View`
    margin: 30px;
    flex-direction: row;
`;

const SearchView = styled.View`
    flex: 1;
    flex-direction: row;
    background-color: ${COLORS.input};
    border-radius: 10px;
    align-items: center;
    padding: 15px 15px;
`;

const SectionTitle = styled.View`
    margin: 10px 30px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const HeaderIconsContainer = styled.View`
    flex-direction: row;
    align-items: center;
    margin-top: 10px;
`;
