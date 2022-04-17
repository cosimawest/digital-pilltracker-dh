import React, { useState } from 'react';
import { StyleSheet, View, FlatList, Dimensions } from 'react-native';
import { IconButton } from "react-native-paper";

import Screen from './Screen.js';


const numColumns = 2;

export default function App() {
  const [data, setData] = useState([{id: 0, value: 'edit'}]);
  const [height, setHeight] = useState(Dimensions.get('window').height/Math.ceil(data.length/numColumns));


  const addMedicine = () => {
    if(data.length === 4) alert("Max number of medications is 4");
    else {
    setData(item => [...item, {id: data.length, value: 'edit'}]);
    setHeight((Dimensions.get("window").height) /Math.ceil((data.length + 1) / numColumns));
    }
  };

  return (
    <View style={styles.home}>
      <IconButton
        style={styles.addPillButton}
        icon="plus"
        onPress={addMedicine}
      />

      <FlatList
        data={data}
        renderItem={({item}) => (
          <View style={{flex: 1, height: height}}>
            <Screen 
              id={data.id}
              item={item}
              data={data}
              setData={setData}
              setHeight={setHeight}/>
          </View>
        )}
        numColumns={numColumns} />
    </View>
  );
}

const styles = StyleSheet.create({
  addPillButton: {
    zIndex: 2,
    position: 'absolute',
    top: 8,
    right: 0,
  },
  home: {
    flex: 1,
    backgroundColor: "#56CCF2",
  },
  screen: {
    flex: 1,
  }
});