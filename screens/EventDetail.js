import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ScrollView, ImageBackground, Platform, TouchableOpacity, Modal } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import styled from 'styled-components/native';
import moment from 'moment';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import RNPickerSelect from 'react-native-picker-select';
import { dummyData, FONTS, SIZES, COLORS, icons, images } from '../constants';
import { McText, McIcon } from '../components';

const EventDetail = ({ navigation, route }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showTicket, setShowTicket] = useState(false);
  const baseUrl = Platform.OS === 'android' ? 'http://10.0.2.2:80' : 'http://localhost:80';
  const { selectedEvent: event, userID } = route.params || {};

  useEffect(() => {
    if (event) {
      setSelectedEvent(event);
      fetchTickets(event.__KEY);
    }
  }, [event]);

  const fetchTickets = async (eventId) => {
    try {
      const response = await axios.get(`${baseUrl}/rest/Billet`);
      const ticketsData = response.data.__ENTITIES;
      const filteredTickets = ticketsData.filter(ticket => ticket.EventID === eventId);
      setTickets(filteredTickets);
      console.log("event id",eventId)
      console.log("userrrrid",userID)
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  const getTicketPrice = (categoryId) => {
    const ticket = tickets.find(ticket => ticket.CategorieID === categoryId);
    return ticket ? `${ticket.Prix} MAD` : '0 MAD';
  };

  const handleTicketPurchase = async () => {
    try {
      const purchaseData = {
        EventID: selectedEvent.__KEY,
        CategorieID: selectedCategory,
        userID: userID,
        Status: 'Confirmed',
      };

      const response = await axios.post(`${baseUrl}/rest/Achat`, purchaseData);

      if (response.status === 200) {
        alert('Achat confirmé avec succès!');
        setShowTicket(true);  // Afficher le modal après l'achat
      } else {
        alert('Une erreur s\'est produite lors de l\'achat du ticket.');
      }
    } catch (error) {
      console.error("Error purchasing ticket:", error);
      alert('Une erreur s\'est produite lors de l\'achat du ticket.');
    }
  };

  const categoryItems = [
    { label: `VIP - ${getTicketPrice('31202020202020202020202020202020')}`, value: '31202020202020202020202020202020' },
    { label: `Premium - ${getTicketPrice('32202020202020202020202020202020')}`, value: '32202020202020202020202020202020' },
    { label: `Standard - ${getTicketPrice('33202020202020202020202020202020')}`, value: '33202020202020202020202020202020' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          backgroundColor: COLORS.black,
        }}
        style={{
          backgroundColor: COLORS.black,
        }}
      >
        <ImageBackground
          resizeMode='cover'
          source={{
            uri: selectedEvent?.logo
              ? `${baseUrl}/rest/Evenement[${selectedEvent.__KEY}]/logo?$imageformat=best&$version=1&$expand=logo`
              : 'https://www.ac-consulting.fr/wp-content/uploads/2022/02/logo4Dv19_210x210.png',
          }}
          style={{
            width: '100%',
            height: SIZES.height < 700 ? SIZES.height * 0.4 : SIZES.height * 0.4,
          }}
        >
          <View style={{ flex: 1 }}>
            <SectionImageHeader>
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();
                }}
                style={{
                  width: 56,
                  height: 40,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 10,
                }}
              >
                <McIcon source={icons.back_arrow} size={24} />
              </TouchableOpacity>
              <View
                style={{
                  width: 96,
                  height: 40,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexDirection: 'row',
                  borderRadius: 10,
                }}
              >
                <TouchableOpacity>
                  <McIcon
                    source={icons.like}
                    size={24}
                    style={{
                      marginLeft: 16,
                      tintColor: COLORS.white,
                    }}
                  />
                </TouchableOpacity>
                <TouchableOpacity>
                  <McIcon
                    source={icons.share}
                    size={24}
                    style={{
                      marginRight: 16,
                      tintColor: COLORS.white,
                    }}
                  />
                </TouchableOpacity>
              </View>
            </SectionImageHeader>
            <SectionImageFooter>
              <LinearGradient
                colors={['transparent', '#000']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{
                  width: '100%',
                  height: 400,
                  justifyContent: 'flex-end',
                }}
              >
                <FooterContentView>
                  <View>
                    <McText body4 style={{ opacity: 0.5, letterSpacing: 2 }}>
                      {selectedEvent?.type}
                    </McText>
                    <McText h1>{selectedEvent?.Titre}</McText>
                    <McText body5 style={{ opacity: 0.5, letterSpacing: 1.7 }}>
                      STARTING {moment(selectedEvent?.startDate, 'YYYY-MM-DD').format('DD MMM, YYYY')}
                    </McText>
                  </View>
                  <LinearGradient
                    colors={COLORS.linear}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 15,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <McText body4 style={{ letterSpacing: 1 }}>
                      {moment(selectedEvent?.startDate, 'YYYY-MM-DD').format('MMM').toUpperCase()}
                    </McText>
                    <McText h2>{moment(selectedEvent?.startDate, 'YYYY-MM-DD').format('DD').toUpperCase()}</McText>
                  </LinearGradient>
                </FooterContentView>
              </LinearGradient>
            </SectionImageFooter>
          </View>
        </ImageBackground>
        <ButtonSection>
          <TouchableOpacity
            style={{
              width: 76,
              height: 32,
              justifyContent: 'center',
              marginRight: 16,
              alignItems: 'center',
              backgroundColor: COLORS.white,
              borderRadius: 10,
            }}
          >
            <McText h6 style={{ color: COLORS.black, letterSpacing: 1 }}>ABOUT</McText>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 124,
              height: 32,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: COLORS.input,
              borderRadius: 10,
            }}
          >
            <McText h6 style={{ opacity: 0.5, letterSpacing: 1 }}>Session</McText>
          </TouchableOpacity>
        </ButtonSection>
        <DescriptionSection>
          <McText body3>{selectedEvent?.Description}</McText>
        </DescriptionSection>

        <CategorySection>
          <McText h3 style={{ marginBottom: 10 }}>SELECT CATEGORY</McText>
          <RNPickerSelect
            onValueChange={(value) => setSelectedCategory(value)}
            items={categoryItems}
            style={pickerSelectStyles}
          />
        </CategorySection>

        <LocationSection>
          <McText h3>LOCATION</McText>
          <View
            style={{
              height: 250,
            }}
          >
            <MapView
              provider={PROVIDER_GOOGLE}
              style={styles.mapView}
              minZoomLevel={15}
              initialRegion={dummyData.Region}
              customMapStyle={dummyData.MapStyle}
            ></MapView>
          </View>
          <View style={{ paddingBottom: 150 }}></View>
        </LocationSection>
      </ScrollView>

      <BottomTabBarSection>
        <View style={styles.tabBar}>
          <View>
            <McText body5 style={{ opacity: 0.5 }}>TICKET PRICE</McText>
            <McText h2>{getTicketPrice(selectedCategory)}</McText>
          </View>
          <TouchableOpacity
            onPress={() => handleTicketPurchase()}
            style={styles.buyTicketButton}
          >
            <McText h6 style={{ color: COLORS.black, letterSpacing: 1 }}>BUY TICKET</McText>
          </TouchableOpacity>
        </View>
      </BottomTabBarSection>

      {showTicket && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={showTicket}
          onRequestClose={() => setShowTicket(false)}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <ImageBackground
                resizeMode='cover'
                source={{
                  uri: selectedEvent?.logo
                    ? `${baseUrl}/rest/Evenement[${selectedEvent.__KEY}]/logo?$imageformat=best&$version=1&$expand=logo`
                    : 'https://www.ac-consulting.fr/wp-content/uploads/2022/02/logo4Dv19_210x210.png',
                }}
                style={styles.ticketImage}
              >
                <LinearGradient
                  colors={['transparent', '#000']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.ticketDetails}
                >
                  <View style={styles.ticketTextContainer}>
                    <McText h3>{selectedEvent?.Titre}</McText>
                    <McText h4>Category: {selectedCategory}</McText>
                    <McText h4>{moment(selectedEvent?.startDate, 'YYYY-MM-DD').format('DD MMM, YYYY')}</McText>
                    <McText h4>{moment(selectedEvent?.startTime, 'HH:mm:ss').format('hh:mm A')}</McText>
                    <View style={styles.barcodeContainer}>
                      <McText body4 style={styles.barcodeText}>Barcode Booking</McText>
                      <View style={styles.barcode}></View>
                    </View>
                  </View>

                  {/* Ajouter le bouton de confirmation d'achat */}
                  <TouchableOpacity
                    onPress={() => setShowTicket(false)}
                    style={styles.confirmPurchaseButton}
                  >
                    <McText h6 style={{ color: COLORS.black, letterSpacing: 1 }}>Confirm Purchase</McText>
                  </TouchableOpacity>
                </LinearGradient>
              </ImageBackground>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  mapView: {
    height: '100%',
    width: '100%',
    borderRadius: 25,
    marginTop: 20,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.tabBar,
    borderRadius: 20,
    paddingHorizontal: 25,
    height: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  buyTicketButton: {
    width: 170,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalView: {
    margin: 0,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 0,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: 'transparent',
  },
  ticketImage: {
    width: 350,  // Augmentation de la largeur
    height: 400,  // Augmentation de la hauteur
    justifyContent: 'flex-end',
    resizeMode: 'cover', 
  },
  ticketDetails: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  ticketTextContainer: {
    justifyContent: 'flex-start',
  },
  barcodeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  barcodeText: {
    marginBottom: 5,
  },
  barcode: {
    width: '100%',
    height: 2,
    backgroundColor: COLORS.white,
  },
  confirmPurchaseButton: {
    width: '100%',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 4,
    color: 'white',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: COLORS.gray,
    borderRadius: 8,
    color: 'white',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

const SectionImageHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 40px;
  padding-left: 24px;
  padding-right: 24px;
`;

const SectionImageFooter = styled.View`
  flex: 1;
  justify-content: flex-end;
`;

const FooterContentView = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-left: 24px;
  padding-right: 24px;
  padding-bottom: 24px;
`;

const ButtonSection = styled.View`
  flex-direction: row;
  padding-left: 24px;
  padding-right: 24px;
  padding-top: 18px;
  padding-bottom: 18px;
  background-color: ${COLORS.black};
`;

const DescriptionSection = styled.View`
  padding-left: 24px;
  padding-right: 24px;
  margin-bottom: 20px;
`;

const CategorySection = styled.View`
  padding-left: 24px;
  padding-right: 24px;
  margin-bottom: 20px;
`;

const LocationSection = styled.View`
  padding-left: 24px;
  padding-right: 24px;
  margin-bottom: 20px;
`;

const BottomTabBarSection = styled.View`
  padding-left: 24px;
  padding-right: 24px;
  position: absolute;
  bottom: 0;
  height: 96px;
  width: 100%;
`;

export default EventDetail;
