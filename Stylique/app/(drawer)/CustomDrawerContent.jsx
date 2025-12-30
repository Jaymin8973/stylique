import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { StyleSheet, Text, View } from 'react-native';
import { useUser } from '../../hooks/useUser';


export default function CustomDrawerContent(props) {
    const { user } = useUser();
    const name = user?.Username;
    const email = user?.Email;

    /* Removed FetchData and state */



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
