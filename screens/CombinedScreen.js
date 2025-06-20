// CombinedScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, ActivityIndicator, ScrollView } from 'react-native';
import MapView, { Polyline, Marker, Circle } from 'react-native-maps';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function CombinedScreen() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)); // One week from now
  const [latitude, setLatitude] = useState('0');
  const [longitude, setLongitude] = useState('0');
  const [numPoints, setNumPoints] = useState('30');
  const [showStartDate, setshowStartDate] = useState(false);
  const [showEndDate, setshowEndDate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [migrationResults, setmigrationResults] = useState(null);
  const [anomalyResults, setanomalyResults] = useState(null);
  const [error, setError] = useState(null);

  // Function to format date for API
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const predictBoth = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Predict whale migration
      const migrationResponse = await fetch('http://192.168.100.220:5000/predict_migration', {
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
      
      const migrationData = await migrationResponse.json();
      
      if (migrationData.status === 'success') {
        setmigrationResults(migrationData.predictions);
        
        // Predict temperature anomaly
        const anomResponse = await fetch('http://192.168.100.220:5000/predict_temperature', {
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
        
        const anomData = await anomResponse.json();
        
        if (anomData.status === 'success') {
          setanomalyResults(anomData.predictions);
        } else {
          setError(anomData.message || 'Error predicting temperature anomalies');
        }
      } else {
        setError(migrationData.message || 'Error predicting migration');
      }
    } catch (err) {
      setError('Connection error: ' + err.message);
      console.error('An error occured when calling API:', err)
    } finally {
      setLoading(false);
    }
  };

    // Coordinates for map
  const coordinates = migrationResults ? migrationResults.map(point => ({
    latitude: parseFloat(point.predicted_latitude),
    longitude: parseFloat(point.predicted_longitude),
  })) : [];

  // Calculate map location
  const mapRegion = migrationResults && migrationResults.length > 0 ? {
    latitude: parseFloat(migrationResults[0].predicted_latitude),
    longitude: parseFloat(migrationResults[0].predicted_longitude),
    latitudeDelta: 10,
    longitudeDelta: 10,
  } : {
    latitude: 0,
    longitude: 0,
    latitudeDelta: 60,
    longitudeDelta: 60,
  };
  
  // Get color based on temperature anomaly
  const anomalyColor = (anomaly) => {
    if (anomaly > 0.55) return 'rgb(255, 0, 0)';
    if (anomaly > 0.53) return 'rgb(255, 153, 0)';
    if (anomaly > 0.50) return 'rgb(229, 255, 0)';
    if (anomaly > 0.48) return 'rgb(0, 255, 85)';
    return 'rgb(0, 0, 255)';
  };

  // Get average anomaly 
  const averageAnom = () => {
    if (!anomalyResults || anomalyResults.length === 0) return 0;
    const sum = anomalyResults.reduce((acc, item) => acc + item.temperature_anomaly, 0);
    return sum / anomalyResults.length;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Combined Migration and Temp Predictions</Text>
        
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
          onPress={predictBoth}
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
      
      {migrationResults && anomalyResults && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>Combined Prediction Results</Text>
          
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
              
              {/* Temperature Anomaly marker for 100km */}
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
        
          {/* Date table */}
          <View style={styles.tabContainer}>
            <View style={styles.dateTable}>
              <Text style={styles.tableTitle}>Migration & Temp Data Table</Text>
              {/* Header */}
              <View style={styles.tableHeader}>
                <Text style={[styles.cell, styles.headerCell]}>Date</Text>
                <Text style={[styles.cell, styles.headerCell]}>Latitude</Text>
                <Text style={[styles.cell, styles.headerCell]}>Longitude</Text>
                <Text style={[styles.cell, styles.headerCell]}>Temperature Anomaly (°C)</Text>
              </View>
               {/* Populate rows */}
              {migrationResults.map((point, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.cell}>{point.date}</Text>
                  <Text style={styles.cell}>{parseFloat(point.predicted_latitude).toFixed(4)}</Text>
                  <Text style={styles.cell}>{parseFloat(point.predicted_longitude).toFixed(4)}</Text>
                  <Text style={styles.cell}>{parseFloat(point.predicted_anomaly).toFixed(4)}</Text>
                </View>
              ))} 
              
            </View>
          </View>
          
          <View style={styles.tabContainer}>
          <View style={styles.dateTable}>
            <Text style={styles.tableTitle}>Temperature Data Table</Text>
            <View style={styles.tableHeader}>
              <Text style={[styles.cell, styles.headerCell]}>Date</Text>
              <Text style={[styles.cell, styles.headerCell]}>Temperature Anomaly (°C)</Text>
            </View>
            
            {anomalyResults.map((point, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.cell}>{point.date}</Text>
                <Text style={[styles.cell, { color: anomalyColor(point.temperature_anomaly) }]}>
                  {point.temperature_anomaly.toFixed(4)}
                </Text>
              </View>
              ))}
            </View>
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
  tabContainer: {
    marginBottom: 20,
  },
  
});