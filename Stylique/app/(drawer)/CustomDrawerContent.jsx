import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useFocusEffect } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import API from '../../Api';


export default function CustomDrawerContent(props) {
    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);

    const FetchData = async () => {
        try {
            const UserID = await SecureStore.getItemAsync('userId');
            if (UserID) {
                const res = await API.get(`/api/user/${UserID}`);
                const Name = res.data.Username;
                setName(Name);
                setEmail(res.data.Email);
            }
        } catch (err) {
            console.error(err?.response?.data?.message || err.message);
        }
    };

    useFocusEffect(
        useCallback(() => {
            FetchData();
        }, [])
    );

    return (
        <DrawerContentScrollView {...props}>
            <View style={styles.topContent} className=" flex-row ">
                <View style={styles.logo}>
                    <Text style={styles.logoLetter}>
                        {(() => {
                            const raw = (name && name.trim()) || (email && email.split('@')[0]) || 'U';
                            const words = raw.split(/\s+/).filter(Boolean);
                            if (words.length >= 2) {
                                return (words[0][0] + words[1][0]).toUpperCase();
                            }
                            const compact = raw.replace(/[^A-Za-z0-9]/g, '');
                            const base = compact || 'U';
                            return base.slice(0, 2).toUpperCase();
                        })()}
                    </Text>
                </View>
                <View className="ms-5">
                    <Text style={styles.username}>{name ? name : "User"}</Text>
                    <Text className="text-xl">{email ? email : "user@example.com"}</Text>
                </View>
            </View>
            <DrawerItemList {...props} />
        </DrawerContentScrollView>
    );
}

const styles = StyleSheet.create({
    topContent: {
        padding: 25,
        marginBottom: 10,
        alignItems: 'center',
    },
    logo: {
        width: 80,
        height: 80,
        marginBottom: 10,
        borderRadius: 40,
        backgroundColor: '#343434',
        justifyContent: 'center',
        alignItems: 'center',
    },
    username: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    logoLetter: {
        fontSize: 32,
        color: 'white',
        fontWeight: 'bold',
    },
});
