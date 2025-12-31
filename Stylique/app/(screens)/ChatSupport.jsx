import { AntDesign, Feather } from '@expo/vector-icons';
import { useState, useRef, useEffect } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { THEME } from '@constants/Theme';
import { ThemedContainer } from '@components/ThemedComponents';

const ChatSupport = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: 'Hello! Welcome to Stylique Support. How can I help you today?',
            sender: 'support',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const scrollViewRef = useRef(null);

    useEffect(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    }, [messages]);

    const handleSend = () => {
        if (message.trim()) {
            const newMessage = {
                id: messages.length + 1,
                text: message,
                sender: 'user',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages([...messages, newMessage]);
            setMessage('');

            // Simulate support response
            setTimeout(() => {
                const supportResponse = {
                    id: messages.length + 2,
                    text: 'Thank you for your message. Our support team will assist you shortly.',
                    sender: 'support',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
                setMessages(prev => [...prev, supportResponse]);
            }, 1000);
        }
    };

    const quickReplies = [
        'Track my order',
        'Return policy',
        'Payment issue',
        'Product inquiry'
    ];

    const handleQuickReply = (reply) => {
        setMessage(reply);
    };

    return (
        <ThemedContainer className='bg-white'>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <View style={{ flex: 1 }}>
                    {/* Chat Header Info */}
                    <View className="bg-gray-50 p-4 border-b border-gray-200">
                        <View className="flex-row items-center">
                            <View className="bg-green-500 rounded-full p-3 mr-3">
                                <Feather name="headphones" size={24} color="white" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-lg font-bold text-gray-900">Support Team</Text>
                                <View className="flex-row items-center mt-1">
                                    <View className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                                    <Text className="text-sm text-gray-600">Online - Usually replies instantly</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Messages */}
                    <ScrollView
                        ref={scrollViewRef}
                        className="flex-1 px-4 py-4"
                        showsVerticalScrollIndicator={false}
                        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                    >
                        {messages.map((msg) => (
                            <View
                                key={msg.id}
                                className={`mb-4 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                            >
                                <View
                                    className={`max-w-[75%] rounded-2xl p-4 ${msg.sender === 'user'
                                        ? 'bg-black'
                                        : 'bg-gray-100'
                                        }`}
                                    style={msg.sender === 'user' ? styles.userMessage : styles.supportMessage}
                                >
                                    <Text
                                        className={`text-base leading-6 ${msg.sender === 'user' ? 'text-white' : 'text-gray-900'
                                            }`}
                                    >
                                        {msg.text}
                                    </Text>
                                </View>
                                <Text className="text-xs text-gray-500 mt-1 px-2">{msg.timestamp}</Text>
                            </View>
                        ))}
                    </ScrollView>

                    {/* Quick Replies */}
                    {messages.length <= 2 && (
                        <View className="px-4 pb-3">
                            <Text className="text-sm text-gray-600 mb-2">Quick replies:</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                <View className="flex-row gap-2">
                                    {quickReplies.map((reply, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            onPress={() => handleQuickReply(reply)}
                                            className="bg-gray-100 rounded-full px-4 py-2 border border-gray-200"
                                        >
                                            <Text className="text-sm text-gray-700">{reply}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </ScrollView>
                        </View>
                    )}

                    {/* Input Area */}
                    <View className="border-t border-gray-200 bg-white p-4">
                        <View className="flex-row items-center gap-3">
                            <View className="flex-1 bg-gray-100 rounded-full flex-row items-center px-4">
                                <TextInput
                                    className="flex-1 py-3 text-base"
                                    placeholder="Type your message..."
                                    placeholderTextColor="gray"
                                    value={message}
                                    onChangeText={setMessage}
                                    multiline
                                    maxLength={500}
                                />
                            </View>
                            <TouchableOpacity
                                onPress={handleSend}
                                disabled={!message.trim()}
                                className="bg-black rounded-full p-3"
                                style={{ opacity: message.trim() ? 1 : 0.5 }}
                            >
                                <Feather name="send" size={20} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </ThemedContainer>
    );
};

const styles = StyleSheet.create({
    userMessage: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    supportMessage: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
});

export default ChatSupport;
