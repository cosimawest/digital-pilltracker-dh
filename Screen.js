import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import storage from "@react-native-async-storage/async-storage";
import { IconButton } from "react-native-paper";

import DateTimePicker from "@react-native-community/datetimepicker";


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true
  })
});
  
const Screen = (props) => {
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  const [medName, setMedName] = useState("");

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState(props.item.value);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };

  const submit = async () => {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "Time to take " + medName,
            body: 'Have you taken it yet?',
            categoryIdentifier: medName,
            badge: 1,
        },
        trigger: { 
            hour: date.getHours(),
            minute: date.getMinutes(),
            repeats: true
        },
    });

    if (medName === "") alert("Please enter a name for your medication");
    else {
      setMode("error");
      props.item.value = "error";
    }
  };

  useEffect(() => {
    const getPermission = async () => {
      if (Constants.isDevice) {
          const { status: existingStatus } = await Notifications.getPermissionsAsync();
          let finalStatus = existingStatus;
          if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
          }
          if (finalStatus !== 'granted') {
            alert('Enable push notifications to use the app!');
            await storage.setItem('expopushtoken', "");
            return;
          }
          const token = (await Notifications.getExpoPushTokenAsync()).data;
          await storage.setItem('expopushtoken', token);
      } else {
        alert('Must use physical device for Push Notifications');
      }

        if (Platform.OS === 'android') {
          Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
          });
        }
    }

    getPermission();

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {});

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };    
  }, []);

  useEffect(() => {
    Notifications.setNotificationCategoryAsync(medName, [
        { identifier: medName, 
          buttonTitle: "Yep!",
          options: {
            opensAppToForeground: false,
          },
        },
        { identifier: "No", 
          buttonTitle: "Not yet",
          options: {
            opensAppToForeground: false,
          },
        },
      ]).then(result => {

      })

    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
        if(response.actionIdentifier === medName) setMode("success");
    });

    return () => {
        subscription.remove();
      }; 
  }, [medName]);

  const removeMedicine = () => {
    Alert.alert(
      'Hold on!',
      "Are you sure you want to delete " + medName + "?",
      [{
        text: 'Yes',
        onPress: () => {
          props.setHeight((Dimensions.get("window").height) /Math.ceil((props.data.length - 1) / 2));
          props.setData(props.data.filter(item => item != props.item))
        }
      },{ text: 'No' }]
    )
  };


  return (
    <View style={styles.home}>
      {props.data.length != 1 ?
        <IconButton
          style={styles.minusPillButton}
          icon="minus"
          onPress={removeMedicine}
        /> : null
      }
      

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
  minusPillButton: {
    zIndex: 2,
    position: 'absolute',
    bottom: 8,
    left: 0,
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

export default Screen;