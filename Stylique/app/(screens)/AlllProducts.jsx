import axios from 'axios';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import IpAddress from '../../Config.json';

const AlllProducts = () => {

    const [data, setData] = useState([]);
    const router = useRouter();
    const API = axios.create({
        baseURL: `http://${IpAddress.IpAddress}:3000`,
    });
    useEffect(() => {
        FetchData();
    }, []);

    const FetchData = async () => {

        try {
            const response = await API.get('/products/');
            console.log(response.data);
            setData(response.data);
        } catch (error) {
            console.error(error);
        }
    }


    return (

        <View className="mt-5 px-5 flex-1">
            <FlatList
                data={data}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.productId.toString()}
                className="overflow-visible"
                numColumns={2}
                renderItem={({ item }) => (
                    <Pressable onPress={() => router.push({
                        pathname: 'ProductDetail',
                        params: { id: item.productId }
                    })} >
                        <View style={styles.productCard} className="m-4 gap-3">
                            <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
                            <Text className="font-bold">
                                {item.name.length > 15 ? item.name.slice(0, 15) + "..." : item.name}
                            </Text>
                            <Text>{item.price}$</Text>
                        </View>
                    </Pressable>
                )}
            />
        </View>

    )
}

const styles = StyleSheet.create({
    productCard: {
        width: 150,
        height: 240,
    },
    container: {
        flexGrow: 1,
        justifyContent: 'flex-end',
    },
    productImage: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        resizeMode: 'cover',
    },
});

export default AlllProducts