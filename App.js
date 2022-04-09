import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Dimensions,
} from "react-native";
import { IconButton, Colors } from "react-native-paper";
import Screen from "./Screen.js";

export default function App() {
  const [Data, setData] = useState([{ id: "a", value: "A" }]);
  const numColumns = 2;
  const [Height, setHeight] = useState(
    (Dimensions.get("window").height - 150) /
      Math.ceil(Data.length / numColumns)
  );

  useEffect(() => {
    setData(Data);
  }, []);

  const addMedicine = () => {
    var tempArr = Data;
    if (tempArr.length == 4) {
      alert("Max number of medications is 4");
    } else if (tempArr.length == 1) {
      tempArr.push({ id: "b", value: "B" });
      setHeight(
        (Dimensions.get("window").height - 150) /
          Math.ceil(Data.length / numColumns) /
          2
      );
    } else if (tempArr.length == 2) {
      tempArr.push({ id: "c", value: "C" });
    } else if (tempArr.length == 3) {
      tempArr.push({ id: "d", value: "D" });
    }
    setData(tempArr);

    // alert("number of meds" + Data.length + "    height size" + Height);
  };

  const Render_Item = () => (
    <View style={{ flex: 1, height: Height }}>
      <Screen />
    </View>
  );

  return (
    <SafeAreaView style={styles.home}>
      <IconButton
        style={styles.addPillButton}
        icon="plus"
        onPress={addMedicine}
      ></IconButton>
      <FlatList data={Data} renderItem={({ item }) => <Render_Item />} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  home: {
    flex: 1,
    backgroundColor: "#56CCF2",
  },
  test: {
    width: "100%",
    height: "50%",
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  screen: {
    flex: 1,
  },
  addPillButton: {
    alignSelf: "flex-end",
  },
});
