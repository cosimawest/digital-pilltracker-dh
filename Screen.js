import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";

export default function Screen() {
  const [medName, setMedName] = useState("");

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("edit");

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };

  const submit = () => {
    if (medName === "") alert("Please enter a name for your medication");
    else setMode("error");
  };

  return (
    <View style={styles.home}>
      {mode === "edit" ? (
        <View style={styles.editView}>
          <TextInput
            style={styles.title}
            editable
            maxLength={20}
            value={medName}
            onChangeText={(input) => setMedName(input)}
            placeholder="Medication Name"
          />
          <DateTimePicker
            value={date}
            mode="time"
            onChange={onChange}
            display="spinner"
          />
          <Button style={styles.done} title="Done" onPress={submit}></Button>
        </View>
      ) : null}
      {mode === "success" ? (
        <View style={styles.sucessView}>
          <Text style={styles.title}>
            You took your{" "}
            {date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
          <Text style={styles.title}>{medName}</Text>
          <Text style={styles.titleTwo}>Good job!</Text>
        </View>
      ) : null}
      {mode === "error" ? (
        <View style={styles.errorView}>
          <Text style={styles.title}>
            You haven't taken your{" "}
            {date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
          <Text style={styles.title}>{medName}</Text>
          <TouchableOpacity
            style={styles.takenButton}
            onPress={() => setMode("success")}
          >
            <Text style={styles.takenButtonText}>I took it</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  home: {
    flex: 1,
  },
  editView: {
    backgroundColor: "#56CCF2",
    flex: 1,
    justifyContent: "center",
  },
  sucessView: {
    backgroundColor: "#6FCF97",
    flex: 1,
    justifyContent: "center",
  },
  errorView: {
    backgroundColor: "#EB5757",
    flex: 1,
    justifyContent: "center",
  },
  titleTwo: {
    textAlign: "center",
    fontSize: 17,
    paddingTop: 40,
  },
  title: {
    textAlign: "center",
    fontSize: 17,
  },
  takenButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 40,
  },
  takenButtonText: {
    backgroundColor: "#D91E1E",
    paddingVertical: 3,
    paddingHorizontal: 13,
    borderRadius: 5,
    color: "#940000",
    fontSize: 17,
    overflow: "hidden",
  },
  subtitle: {
    textAlign: "center",
  },
  displayTime: {
    textAlign: "center",
  },
});
