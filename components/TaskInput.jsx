import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";

const TaskInput = ({ onAddEntry, onBlur }) => {
  const [message, setMessage] = useState("");

  const handleAddEntry = () => {
    if (message.trim() === "") {
      return; // Disable submit if message is empty
    }
    onAddEntry(message);
    console.log("message: ", message);
    setMessage(""); // Clear input after adding entry
  };

  return (
    <View onBlur={onBlur}>
      <TextInput
        style={styles.input}
        placeholder="Enter task"
        onChangeText={setMessage}
        value={message}
      />
      <Button
        title="Add Entry"
        onPress={handleAddEntry}
        disabled={message.trim() === ""}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    marginTop: 20,
    backgroundColor: "black",
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "white",
    paddingBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
    paddingBottom: 10,
    paddingTop: 10,
    borderBottomWidth: 1,
  },
  headerText: {
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
    color: "white",
  },
  rowText: {
    color: "white",
    alignSelf: "center",
    flex: 1,
    textAlign: "center",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    backgroundColor: "white",
  },
});

export default TaskInput;
