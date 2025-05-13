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
                <Button title="Back to Home" onPress={() => navigation.goBack()} color="#8D6E63" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F1F8E9", // พื้นหลังสีเขียวอ่อน
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginVertical: 20,
        textAlign: "center",
        color: "#8D6E63", // สีเขียวเข้ม
        fontWeight: "bold", // ทำให้ตัวอักษรหนา
    },
    name: {
        fontSize: 18,
        marginVertical: 5,
        color: "#8D6E63", // สีเขียวเข้มสำหรับชื่อ
    },
});

export default Main;
