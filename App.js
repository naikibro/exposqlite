import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { Button } from "react-native-paper";
import TaskInput from "./components/TaskInput";
import { Ionicons } from "@expo/vector-icons";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("mydatabase.db");

const createTable = () => {
  db.transaction((tx) => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS entries (id INTEGER PRIMARY KEY AUTOINCREMENT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, message TEXT, done INTEGER);",
      [],
      () => console.log("Table created successfully"),
      (_, error) => console.log("Error creating table:", error)
    );
  });
};

const dropTable = () => {
  db.transaction((tx) => {
    tx.executeSql(
      "DROP TABLE IF EXISTS entries;",
      [],
      () => console.log("Table dropped successfully"),
      (_, error) => console.log("Error dropping table:", error)
    );
  });
};

const insertEntry = (message, setEntries) => {
  const timestamp = new Date().toISOString();
  db.transaction((tx) => {
    tx.executeSql(
      "INSERT INTO entries (timestamp, message, done) VALUES (?, ?, 0);",
      [timestamp, message],
      () => {
        console.log("Entry added successfully");
        updateDataTable(setEntries); // Fetch updated entries list
      },
      (_, error) => console.log("Error adding entry:", error)
    );
  });
};

const deleteEntry = (id, setEntries) => {
  db.transaction((tx) => {
    tx.executeSql(
      "DELETE FROM entries WHERE id = ?;",
      [id],
      () => {
        console.log("Entry deleted successfully");
        updateDataTable(setEntries); // Fetch updated entries list
      },
      (_, error) => console.log("Error deleting entry:", error)
    );
  });
};

const toggleEntryCompletion = (id, done, setEntries) => {
  db.transaction((tx) => {
    tx.executeSql(
      "UPDATE entries SET done = ? WHERE id = ?;",
      [done ? 0 : 1, id],
      () => {
        console.log("Entry completion toggled successfully");
        updateDataTable(setEntries); // Fetch updated entries list
      },
      (_, error) => console.log("Error toggling entry completion:", error)
    );
  });
};

const updateDataTable = (setEntries) => {
  db.transaction((tx) => {
    tx.executeSql(
      "SELECT * FROM entries;",
      [],
      (_, { rows }) => setEntries(rows._array),
      (_, error) => console.log("Error fetching entries:", error)
    );
  });
};

export default function App() {
  const [entries, setEntries] = useState([]);
  const [showTaskInput, setShowTaskInput] = useState(false);
  const handleBlur = () => {
    setShowTaskInput(false);
  };

  useEffect(() => {
    createTable();
    updateDataTable(setEntries);
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollcontainer}>
        <Text style={styles.headerText}>TODO LIST</Text>
        {entries.map((entry) => (
          <View
            key={entry.id}
            style={[
              styles.tableRow,
              { backgroundColor: entry.done ? "lightgray" : "white" },
            ]}
          >
            <Text style={styles.rowText}>{entry.message}</Text>
            <Ionicons
              style={{ alignSelf: "center" }}
              name={entry.done ? "checkbox-outline" : "square-outline"}
              size={24}
              color={entry.done ? "green" : "gray"}
              onPress={() =>
                toggleEntryCompletion(entry.id, entry.done, setEntries)
              }
            />
            <Button
              mode="text"
              icon="trash-can"
              onPress={() => deleteEntry(entry.id, setEntries)}
              textColor="red"
            >
              Delete
            </Button>
          </View>
        ))}
      </ScrollView>

      <View style={{ width: "100%", display: "flex" }}>
        <Button
          mode="contained"
          icon="plus"
          onPress={() => setShowTaskInput(!showTaskInput)}
          style={{
            alignSelf: "flex-end",
            marginBottom: 30,
            marginRight: 10,
            width: 200,
            display: showTaskInput ? "flex" : "none",
          }}
        >
          Add task
        </Button>
      </View>

      {!showTaskInput && (
        <TaskInput
          onAddEntry={(message) => {
            insertEntry(message, setEntries);
            setShowTaskInput(true);
          }}
          onBlur={handleBlur}
        />
      )}

      <StatusBar style="auto" />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "80%",
    marginTop: 20,
    backgroundColor: "black",
  },
  scrollcontainer: {
    flex: 1,
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "white",
    paddingBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
    backgroundColor: "lightgray",
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 20,
    marginVertical: 5,
  },
  headerText: {
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
    fontSize: 40,
  },
  rowText: {
    color: "black",
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
