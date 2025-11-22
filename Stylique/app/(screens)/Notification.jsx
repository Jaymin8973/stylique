import { useEffect } from 'react';
import { ScrollView, Text, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNotifications } from '../NotificationProvider';

const Notification = () => {
  const { notifications, markAllRead, clearAll } = useNotifications();

  // Mark all current notifications as read once when this screen mounts
  // (do not depend on markAllRead, to avoid re-running on every render)
  useEffect(() => {
    markAllRead();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ScrollView>
      <SafeAreaView>
        <View className="gap-6 px-5 pb-4">
          <View className="flex-row justify-end items-center mb-4">
            {notifications.length > 0 && (
              <Pressable onPress={clearAll}>
                <Text className="text-md text-red-500">Clear all</Text>
              </Pressable>
            )}
          </View>
          {notifications.length === 0 ? (
            <View className="py-8 items-center">
              <Text className="text-lg text-gray-500">No notifications yet.</Text>
            </View>
          ) : (
            notifications.map((item) => (
              <View
                key={item.id}
                className="border px-5 py-3 gap-1 rounded-lg border-gray-300 mb-3 bg-white"
              >
                <Text className="text-lg font-semibold">
                  {item.title || 'Notification'}
                </Text>
                {!!item.body && (
                  <Text className="text-gray-600 text-base">
                    {item.body}
                  </Text>
                )}
              </View>
            ))
          )}
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default Notification;