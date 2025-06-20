// WhaleMigrationScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, ActivityIndicator, ScrollView } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function WhaleMigrationScreen() {
  // State management 
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
  const [latitude, setLatitude] = useState('0');
  const [longitude, setLongitude] = useState('0');
  const [numPoints, setNumPoints] = useState('30');
  const [showStartDate, setshowStartDate] = useState(false);
  const [showEndDate, setshowEndDate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  // Function to format date for API
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const fetchMigrationPrediction = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://192.168.100.220:5000/predict_migration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          start_date: formatDate(startDate),
          end_date: formatDate(endDate),
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          num_points: parseInt(numPoints),
        }),
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        setResults(data.predictions);
      } else {
        setError(data.message || 'Something went wrong');
      }
    } catch (err) {
      setError('Connection error: ' + err.message);
      console.error('An error occured when calling API:', err)
    } finally {
      setLoading(false);
    }
  };

  // Coordinates for map
  const coordinates = results ? results.map(point => ({
    latitude: parseFloat(point.predicted_latitude),
    longitude: parseFloat(point.predicted_longitude),
  })) : [];

  // Calculate map location
  const mapRegion = results && results.length > 0 ? {
    latitude: parseFloat(results[0].predicted_latitude),
    longitude: parseFloat(results[0].predicted_longitude),
    latitudeDelta: 10,
    longitudeDelta: 10,
  } : {
    latitude: 0,
    longitude: 0,
    latitudeDelta: 60,
    longitudeDelta: 60,
  };

  return (
    <ScrollView style={styles.container}>
      {/* Form for input */}
      <View style={styles.form}>
        <Text style={styles.title}>Predict Marine Life Migration</Text>
        
        <View style={styles.inputs}>
          <Text style={styles.labels}>Starting Latitude</Text>
          <TextInput
            style={styles.input}
            value={latitude}
            onChangeText={setLatitude}
            keyboardType="numeric"
            placeholder="Enter latitude (eg. 41.0293)"
          />
        </View>
        
        <View style={styles.inputs}>
          <Text style={styles.labels}>Starting Longitude</Text>
          <TextInput
            style={styles.input}
            value={longitude}
            onChangeText={setLongitude}
            keyboardType="numeric"
            placeholder="Enter longitude (eg. -69.1234)"
          />
        </View>
        
        <View style={styles.inputs}>
          <Text style={styles.labels}>Number of Points</Text>
          <TextInput
            style={styles.input}
            value={numPoints}
            onChangeText={setNumPoints}
            keyboardType="numeric"
            placeholder="Number of prediction points (Number of days to predict for)"
          />
        </View>
        
        <View style={styles.inputs}>
          <Text style={styles.labels}>Date Range:</Text>
          <Text style={styles.labels}>Starting Date: {formatDate(startDate)}</Text>
          <Button title="Select Date" onPress={() => setshowStartDate(true)} />
          {showStartDate && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display="default"
              onChange={(_, selectedDate) => {
                setshowStartDate(false);
                if (selectedDate) setStartDate(selectedDate);
              }}
            />
          )}
        </View>
        
        <View style={styles.inputs}>
        <Text style={styles.labels}>Ending Date: {formatDate(startDate)}</Text>
          <Button title="Select Date" onPress={() => setshowEndDate(true)} />
          {showEndDate && (
            <DateTimePicker
              value={endDate}
              mode="date"
              display="default"
              onChange={(_, selectedDate) => {
                setshowEndDate(false);
                if (selectedDate) setEndDate(selectedDate);
              }}
            />
          )}
        </View>
        {/* Prediction button */}
        <Button 
          title="Run Prediction"
          onPress={fetchMigrationPrediction}
          color="#000000"
          disabled={loading}
        />
      </View>
      {/* Loading indicator */}
      {loading && (
        <View style={styles.loadingIcon}>
          <ActivityIndicator size="large" color="#000000" />
        </View>
      )}
      {/* Error display */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      {/* Results */}
      {results && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>Migration Prediction Results</Text>
          {/* Map display */}
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              region={mapRegion}
            >
              {/* Migration Path */}
              <Polyline
                coordinates={coordinates}
                strokeColor="#008888"
                strokeWidth={1}
              />
              {/* Start and end markers */}
              {coordinates.length > 0 && (
                <>
                  <Marker
                    coordinate={coordinates[0]}
                    pinColor="green"
                  />
                  <Marker
                    coordinate={coordinates[coordinates.length - 1]}
                    pinColor="red"
                  />
                </>
              )}
            </MapView>
          </View>
          {/* Date table */}
          <View style={styles.dateTable}>
            <Text style={styles.tableTitle}>Prediction Date Table</Text>
            {/* Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.cell, styles.headerCell]}>Date</Text>
              <Text style={[styles.cell, styles.headerCell]}>Latitude</Text>
              <Text style={[styles.cell, styles.headerCell]}>Longitude</Text>
              <Text style={[styles.cell, styles.headerCell]}>Temperature Anomaly</Text>
            </View>
            {/* Populate rows */}
            {results.map((point, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.cell}>{point.date}</Text>
                <Text style={styles.cell}>{parseFloat(point.predicted_latitude).toFixed(4)}</Text>
                <Text style={styles.cell}>{parseFloat(point.predicted_longitude).toFixed(4)}</Text>
                <Text style={styles.cell}>{parseFloat(point.predicted_anomaly).toFixed(2)}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '##e3d9d9',
  },
  form: {
    backgroundColor: 'white',
    padding: 15,
    margin: 10,
    borderRadius: 10,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#0400FF',
  },
  inputs: {
    marginBottom: 10,
  },
  labels: {
    fontSize: 18,
    marginBottom: 10,
    color: '#3C3C3C',
  },
  input: {
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 18,
  },
  loadingIcon: {
    padding: 10,
    alignItems: 'center',
  },
  errorContainer: {
    backgroundColor: '#0000',
    padding: 10,
    margin: 10,
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 18,
  },
  resultsContainer: {
    margin: 20,
  },
  resultsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#0400FF',
  },
  mapContainer: {
    height: 400,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 15,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  dateTable: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
  },
  tableTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#0400FF',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f8ff',
    padding: 5,
    borderRadius: 4,
    marginBottom: 10,
  },
  headerCell: {
    fontWeight: 'bold',
    color: '#0400FF',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 3,
    borderBottomColor: '#000',
  },
  cell: {
    flex: 1,
    fontSize: 14,
  },
});