// screens/HomeScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ocean Prediction Application</Text>
      </View>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Welcome to the Marine Life Migration and Temperature Prediction Application</Text>
        <Text style={styles.cardText}>
          This application uses cutting edge Graph Attention Models to bring accurate predictions on current/future temperature anomalies and marine life migration.
        </Text>
      </View>
      
      <View style={styles.instructionContainer}>
        <Text style={styles.sectionTitle}>How to Use:</Text>
        
        <View style={styles.instructionItem}>
          <Text style={styles.instructionTitle}>Whale Migration</Text>
          <Text style={styles.instructionText}>
            Predict the path of whale migrations by selecting a date range and starting coordinates.
            The predicted path will be displayed on a map, and below that will be a table with the exact values.
          </Text>
        </View>
        
        <View style={styles.instructionItem}>
          <Text style={styles.instructionTitle}>Temperature Anomaly</Text>
          <Text style={styles.instructionText}>
            Predict ocean temperature anomalies for a specific location and dates.
            Results will show a map with a 100km point that will indicate the anomaly temperature by color. A data table will also be shown below with the exact values.
          </Text>
        </View>
        
        <View style={styles.instructionItem}>
          <Text style={styles.instructionTitle}>Combined Prediction</Text>
          <Text style={styles.instructionText}>
            View both whale migration paths and temperature anomalies on the same map to 
            analyze potential correlations between the two.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '##e3d9d9',
  },
  header: {
    backgroundColor: '#00ffeb',
    paddingVertical: 25,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'black',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    margin: 15,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#0009ff',
  },
  cardText: {
    fontSize: 18,
    lineHeight: 24,
    color: '#000',
  },
  instructionContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 50,
    margin: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  instructionItem: {
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  instructionTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#0090FF',
  },
  instructionText: {
    fontSize: 16,
    lineHeight: 22,
    color: '#555',
  },

});
