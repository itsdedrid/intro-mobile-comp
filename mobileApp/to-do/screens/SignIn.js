import React, { useState } from "react";
import { StyleSheet, Text, View, Button, Alert, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

const SignIn = () => {
    const [nationalId, setNationalId] = useState("");
    const [password, setPassword] = useState("");
    const navigation = useNavigation();

    const handleLogin = async () => {
        if (!nationalId.trim() || !password) {
            Alert.alert("แจ้งเตือน", "กรุณากรอกข้อมูลให้ครบถ้วน");
            return;
        }

        try {
            const response = await axios.post("http://10.203.233.120:5555/tokens/login", {
                nationalId,
                password,
            });

            const token = response.data.token;
            await SecureStore.setItemAsync("token", token);

            navigation.navigate("MainDrawer");
        } catch (error) {
            const status = error?.response?.status || "Unknown";
            Alert.alert("เข้าสู่ระบบไม่สำเร็จ", `รหัสผิดพลาด: ${status}`);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>เข้าสู่ระบบ</Text>
            <TextInput
                style={styles.input}
                placeholder="เลขประจำตัวประชาชน"
                value={nationalId}
                onChangeText={setNationalId}
                keyboardType="number-pad"
            />
            <TextInput
                style={styles.input}
                placeholder="รหัสผ่าน"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <View style={styles.buttonContainer}>
                <Button title="เข้าสู่ระบบ" onPress={handleLogin} color="#007bff" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 20,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 24,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 6,
        padding: 12,
        marginBottom: 16,
        fontSize: 16,
    },
    buttonContainer: {
        marginTop: 10,
    },
});

export default SignIn;
