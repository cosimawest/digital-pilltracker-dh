import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions } from "react-native";

import Screen from './Screen.js';

const data = [
  {id: 'a', value: 'A'},
  {id: 'b', value: 'B'},
  {id: 'c', value: 'C'},
  {id: 'd', value: 'D'},
];

const numColumns = 2;
const size = Dimensions.get('window').width/numColumns;
const height = Dimensions.get('window').height/Math.ceil(data.length/numColumns);

export default function App() {

  return (
    
    <View style={styles.home}>
      <FlatList
        data={data}
        renderItem={({item}) => (
          <View style={styles.screen}>
            <Screen/>
          </View>
        )}
        numColumns={numColumns} />
    </View>
  );
}


const styles = StyleSheet.create({
  home: {
    flex: 1,
    backgroundColor: "#56CCF2",
  },
  screen: {
    flex: 1,
    height: height,
  }
});


