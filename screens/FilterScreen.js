import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Platform } from 'react-native';
import { McText, McIcon } from '../components';
import { COLORS, icons } from '../constants';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';

const categories = ["Concerts", "Formation", "Conférences", "Lancements de Produits", "Séances de Q&A"];
const baseUrl = Platform.OS === 'android' ? 'http://10.0.2.2:80' : 'http://localhost:80';

const FilterScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const applyFilters = async () => {
    const formatDate = (date) => {
      const d = new Date(date);
      return `${d.getDate()}!${d.getMonth() + 1}!${d.getFullYear()}`;
    };
  
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);
  
    try {
      console.log(`Fetching events with startDate: ${formattedStartDate}, endDate: ${formattedEndDate}, category: ${selectedCategory}`);
      const response = await axios.get(`${baseUrl}/rest/Evenement?$filter="startDate>=:1 AND endDate<=:2 AND categorie=:3"&$params='["${formattedStartDate}", "${formattedEndDate}", "${selectedCategory}"]'`);
      console.log("Response data:", response.data);
      const filteredEvents = response.data.__ENTITIES;
      navigation.navigate('Featured', { filteredEvents });
    } catch (error) {
      console.error("Error fetching filtered events:", error);
    }
  };
  
  

  const onChangeStartDate = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(Platform.OS === 'ios');
    setStartDate(currentDate);
  };

  const onChangeEndDate = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShowEndDatePicker(Platform.OS === 'ios');
    setEndDate(currentDate);
  };

  const showStartDatepicker = () => {
    setShowStartDatePicker(true);
  };

  const showEndDatepicker = () => {
    setShowEndDatePicker(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <McIcon source={icons.back_arrow} size={24} />
          </TouchableOpacity>
          <McText h1 style={styles.headerText}>Filter Events</McText>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.categoriesContainer}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.selectedCategoryButton
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={styles.categoryButtonText}>{category}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.label}>Start Date</Text>
          <TouchableOpacity style={styles.dateInput} onPress={showStartDatepicker}>
            <Text style={styles.dateText}>{startDate.toISOString().split('T')[0]}</Text>
          </TouchableOpacity>
          {showStartDatePicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display="default"
              onChange={onChangeStartDate}
            />
          )}
          <Text style={styles.label}>End Date</Text>
          <TouchableOpacity style={styles.dateInput} onPress={showEndDatepicker}>
            <Text style={styles.dateText}>{endDate.toISOString().split('T')[0]}</Text>
          </TouchableOpacity>
          {showEndDatePicker && (
            <DateTimePicker
              value={endDate}
              mode="date"
              display="default"
              onChange={onChangeEndDate}
            />
          )}
        </View>
        <TouchableOpacity style={styles.button} onPress={applyFilters}>
          <McText h2>Apply Filters</McText>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    marginLeft: 10,
  },
  inputContainer: {
    flex: 1,
  },
  label: {
    color: COLORS.white,
    marginBottom: 10,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  categoryButton: {
    backgroundColor: COLORS.input,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    margin: 5,
  },
  selectedCategoryButton: {
    backgroundColor: COLORS.primary,
  },
  categoryButtonText: {
    color: COLORS.white,
  },
  dateInput: {
    backgroundColor: COLORS.input,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 20,
  },
  dateText: {
    color: COLORS.white,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 10,
  },
});

export default FilterScreen;
