import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";

const Main = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Credit Screen</Text>

            <Text style={styles.name}>เดชฤทธิ์ อารยะกิตติพงศ์ 6434426523</Text>
            <Text style={styles.name}>พัชรพล โซ๊ะเฮง 6434455723</Text>

            <View style={{ marginTop: 20 }}>
                <Button title="Back to Home" onPress={() => navigation.goBack()} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    title: {
        fontSize: 24,
        marginVertical: 20,
        textAlign: "center",
    },
    name: {
        fontSize: 16,
        marginVertical: 5,
    },
});

export default Main;
