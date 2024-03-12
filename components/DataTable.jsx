import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
// SQLite
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("mydatabase.db");

const updateDataTable = (setEntries) => {
  db.transaction((tx) => {
    tx.executeSql(
      "SELECT * FROM entries;",
      [],
      (_, { rows }) => {
        setEntries(rows._array);
      },
      (error) => {
        console.log("Error fetching entries:", error);
      }
    );
  });
};

const DataTable = ({ onToggle, onDelete }) => {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    updateDataTable(setEntries);
    console.log("Entries have changed:", entries);
  }, [entries]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerText}>TODO LIST</Text>
      {entries.map((entry) => (
        <View key={entry.id} style={styles.tableRow}>
          <Text style={styles.rowText}>{entry.message}</Text>
          <Ionicons
            style={{ alignSelf: "center" }}
            name={entry.done ? "checkbox-outline" : "square-outline"}
            size={24}
            color={entry.done ? "green" : "gray"}
            onPress={() => {
              onToggle(entry.id, entry.done);
            }}
          />
          <Button
            mode="text"
            icon="trash-can"
            onPress={() => onDelete(entry.id)}
            textColor="red"
          >
            Delete
          </Button>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "80%",
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
    backgroundColor: "lightgray",
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 20,
    marginVertical: 5,
  },
  headerText: {
    fontWeight: "bold",
    flex: 1,
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

export default DataTable;
