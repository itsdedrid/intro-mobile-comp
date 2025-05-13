import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, Button, Alert, Modal } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import { DataTable, FAB } from "react-native-paper";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

const Main = () => {
    const [activities, setActivities] = useState([]);
    const [editActivity, setEditActivity] = useState(null);
    const [visible, setVisible] = useState(false);
    const navigation = useNavigation();

    const fetchActivities = async () => {
        try {
            const token = await SecureStore.getItemAsync("token");
            if (!token) {
                Alert.alert("Error", "Token not found");
                return;
            }

            const response = await axios.get("http://10.203.233.120:5555/activities", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setActivities(response.data); // <-- Make sure you access .data
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to fetch activities");
        }
    };

    useEffect(() => {
        fetchActivities();
    }, []);

    const handleSubmit = async () => {
        try {
            const token = await SecureStore.getItemAsync("token");
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };

            if (editActivity?.id) {
                await axios.put(`http://10.203.233.120:5555/activities/${editActivity.id}`, editActivity, config);
                Alert.alert("Success", "Activity updated");
            } else {
                const response = await axios.post("http://10.203.233.120:5555/activities", editActivity, config);
                Alert.alert("Success", "Activity created");
            }

            setEditActivity(null);
            setVisible(false);
            fetchActivities(); // refresh data
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to submit activity");
        }
    };

    const handleDelete = async (id) => {
        try {
            const token = await SecureStore.getItemAsync("token");
            await axios.delete(`http://10.203.233.120:5555/activities/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            Alert.alert("Success", "Activity deleted");
            fetchActivities(); // refresh data
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to delete activity");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Main Screen</Text>

            <ScrollView contentContainerStyle={{ padding: 16 }}>
                <DataTable>
                    <DataTable.Header>
                        <DataTable.Title>Name</DataTable.Title>
                        <DataTable.Title>Date</DataTable.Title>
                        <DataTable.Title>Edit</DataTable.Title>
                        <DataTable.Title>Delete</DataTable.Title>
                    </DataTable.Header>

                    {activities.map((activity) => (
                        <DataTable.Row key={activity.id}>
                            <DataTable.Cell>{activity.name}</DataTable.Cell>
                            <DataTable.Cell>{activity.whatTime}</DataTable.Cell>
                            <DataTable.Cell>
                                <Button
                                    title="Edit"
                                    onPress={() => {
                                        setEditActivity(activity);
                                        setVisible(true);
                                    }}
                                />
                            </DataTable.Cell>
                            <DataTable.Cell>
                                <Button
                                    title="Delete"
                                    onPress={() => handleDelete(activity.id)}
                                />
                            </DataTable.Cell>
                        </DataTable.Row>
                    ))}
                </DataTable>
            </ScrollView>

            <FAB
                icon="plus"
                style={styles.fab}
                onPress={() => {
                    setEditActivity({ name: "", whatTime: new Date().toISOString().split("T")[0] });
                    setVisible(true);
                }}
            />

            <Button title="Back to Home" onPress={() => navigation.goBack()} />

            <Modal visible={visible} animationType="slide" onRequestClose={() => setVisible(false)}>
                <ScrollView contentContainerStyle={styles.modal}>
                    <TextInput
                        placeholder="Name"
                        value={editActivity?.name || ""}
                        onChangeText={(text) => setEditActivity({ ...editActivity, name: text })}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Date (YYYY-MM-DD)"
                        value={editActivity?.whatTime || ""}
                        onChangeText={(text) => setEditActivity({ ...editActivity, whatTime: text })}
                        style={styles.input}
                    />
                    <Button
                        title={editActivity?.id ? "Update" : "Create"}
                        onPress={() => {
                            if (!editActivity?.name || !editActivity?.whatTime) {
                                Alert.alert("Validation", "Please fill all fields");
                                return;
                            }
                            handleSubmit();
                        }}
                    />
                    <View style={{ marginTop: 10 }}>
                        <Button title="Cancel" onPress={() => setVisible(false)} color="grey" />
                    </View>
                </ScrollView>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        fontSize: 24,
        marginVertical: 20,
        textAlign: "center",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    modal: {
        padding: 20,
        backgroundColor: "white",
        flexGrow: 1,
    },
    fab: {
        position: "absolute",
        right: 16,
        bottom: 80,
        backgroundColor: "#24a0ed",
    },
});

export default Main;
