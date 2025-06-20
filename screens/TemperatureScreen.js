// TemperatureScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, ActivityIndicator, ScrollView } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function TemperatureScreen() {
    // State management 
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
  const [latitude, setLatitude] = useState('0');
  const [longitude, setLongitude] = useState('0');
  const [showStartDate, setshowStartDate] = useState(false);
  const [showEndDate, setshowEndDate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  // Function to format date for API
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const fetchTemperaturePrediction = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://192.168.100.220:5000/predict_temperature', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          start_date: formatDate(startDate),
          end_date: formatDate(endDate),
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
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

  // Map region
  const mapRegion = {
    latitude: parseFloat(latitude) || 0,
    longitude: parseFloat(longitude) || 0,
    latitudeDelta: 10,
    longitudeDelta: 10,
  };
  
  // Get color based on temperature anomaly
  const anomalyColor = (anomaly) => {
    if (anomaly > 0.55) return 'rgb(255, 0, 0)';
    if (anomaly > 0.53) return 'rgb(255, 153, 0)';
    if (anomaly > 0.50) return 'rgb(229, 255, 0)';
    if (anomaly > 0.48) return 'rgb(0, 255, 85)';
    return 'rgb(0, 0, 255)';
  };

  // Get average anomaly to display on map
  const averageAnom = () => {
    if (!results || results.length === 0) return 0;
    const sum = results.reduce((acc, item) => acc + item.temperature_anomaly, 0);
    return sum / results.length;
  };

  return (
    <ScrollView style={styles.container}>
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
          onPress={fetchTemperaturePrediction}
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
      
      {results && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>Temperature Anomaly Prediction Results</Text>
          {/* Map display */}
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              region={mapRegion}
            >
              {/* Anomaly marker for 100km */}
              <Circle
                center={{
                  latitude: parseFloat(latitude),
                  longitude: parseFloat(longitude),
                }}
                radius={100000} // 100km
                fillColor={`${anomalyColor(averageAnom())}50`}
                strokeColor={anomalyColor(averageAnom())}
                strokeWidth={4}
              />
            </MapView>
          </View>
          
          <View style={styles.dateTable}>
            <Text style={styles.tableTitle}>Temperature Data Table</Text>
            <View style={styles.tableHeader}>
              <Text style={[styles.cell, styles.headerCell]}>Date</Text>
              <Text style={[styles.cell, styles.headerCell]}>Temperature Anomaly (°C)</Text>
            </View>
            
            {results.map((point, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.cell}>{point.date}</Text>
                <Text style={[styles.cell, { color: anomalyColor(point.temperature_anomaly) }]}>
                  {point.temperature_anomaly.toFixed(4)}
                </Text>
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