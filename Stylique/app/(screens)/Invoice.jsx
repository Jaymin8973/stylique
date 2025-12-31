import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useOrders } from '@hooks/useOrders';
import Toast from 'react-native-toast-message';
import { THEME } from '@constants/Theme';
import { ThemedButton, ThemedContainer, ThemedSection } from '@components/ThemedComponents';

const Invoice = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const orderId = useMemo(() => {
        const raw = params.id;
        const v = Array.isArray(raw) ? raw[0] : raw;
        const n = Number(v);
        return Number.isNaN(n) ? null : n;
    }, [params.id]);

    const { useInvoiceDetail } = useOrders();
    const { data: invoice, isLoading: loading } = useInvoiceDetail(orderId);
    const [downloading, setDownloading] = useState(false);
    /* Removed manual loadInvoice function */

    const downloadPDF = async () => {
        if (!orderId) return;

        try {
            setDownloading(true);

            // Get API base URL and auth token
            const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
            const config = await import('../../Config.json');
            const baseURL = `http://${config.IpAddress}:5001`;
            const token = await AsyncStorage.getItem('userToken');

            // Create destination file in document directory
            const fileName = `invoice-${invoice?.invoiceNumber || orderId}.pdf`;
            const destinationFile = new File(Paths.document, fileName);

            // Delete existing file if it exists
            if (destinationFile.exists) {
                await destinationFile.delete();
            }

            // Download PDF using new API
            const downloadedFile = await File.downloadFileAsync(
                `${baseURL}/api/orders/${orderId}/invoice/pdf`,
                destinationFile,
                {
                    headers: token ? {
                        Authorization: `Bearer ${token}`,
                    } : {},
                }
            );

            // Share the downloaded file
            const isAvailable = await Sharing.isAvailableAsync();

            if (isAvailable) {
                await Sharing.shareAsync(downloadedFile.uri, {
                    mimeType: 'application/pdf',
                    dialogTitle: 'Save Invoice',
                    UTI: 'com.adobe.pdf',
                });
                Toast.show({ type: 'success', text1: 'Invoice downloaded successfully!' });
            } else {
                Toast.show({ type: 'info', text1: 'Invoice saved to: ' + downloadedFile.uri });
            }
        } catch (e) {
            console.error('Download error:', e);
            Toast.show({ type: 'error', text1: e.message || 'Failed to download invoice' });
        } finally {
            setDownloading(false);
        }
    };



    if (!orderId) {
        return (
            <ThemedContainer>
                <View className="flex-1 justify-center items-center px-6">
                    <Text className="text-xl font-semibold text-gray-900 mb-2">Invalid invoice</Text>
                    <ThemedButton title="Back" onPress={() => router.back()} />
                </View>
            </ThemedContainer>
        );
    }

    if (loading || !invoice) {
        return (
            <ThemedContainer>
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color={THEME.colors.primary} />
                    <Text className="mt-4 text-gray-600">Loading invoice...</Text>
                </View>
            </ThemedContainer>
        );
    }

    return (
        <ThemedContainer>
            <ScrollView className="flex-1 bg-white">
                <ThemedSection className="pt-4 pb-8">

                    {/* Invoice Title */}
                    <View className="mb-6 mt-5">
                        <Text className="text-2xl font-bold text-gray-900 mb-2">INVOICE</Text>
                        <View className="flex-row justify-between mb-1">
                            <Text className="text-gray-600">Invoice #:</Text>
                            <Text className="text-gray-900 font-medium">{invoice.invoiceNumber}</Text>
                        </View>
                        <View className="flex-row justify-between">
                            <Text className="text-gray-600">Date:</Text>
                            <Text className="text-gray-900 font-medium">
                                {new Date(invoice.invoiceDate).toLocaleDateString('en-IN')}
                            </Text>
                        </View>
                    </View>

                    {/* Divider */}
                    <View className="h-px bg-gray-300 mb-6" />

                    {/* Customer Details */}
                    <View className="mb-6">
                        <Text className="text-lg font-bold text-gray-900 mb-3">Bill To:</Text>
                        <Text className="text-gray-900 font-medium">{invoice.customer.name}</Text>
                        <Text className="text-gray-600 mt-1">{invoice.customer.email}</Text>
                        <Text className="text-gray-600 mt-1">{invoice.customer.address}</Text>
                    </View>

                    {/* Order Details */}
                    <View className="mb-6">
                        <Text className="text-lg font-bold text-gray-900 mb-3">Order Details:</Text>
                        <View className="flex-row justify-between mb-1">
                            <Text className="text-gray-600">Order Number:</Text>
                            <Text className="text-gray-900 font-medium">{invoice.orderNumber}</Text>
                        </View>
                        <View className="flex-row justify-between mb-1">
                            <Text className="text-gray-600">Tracking:</Text>
                            <Text className="text-gray-900 font-medium">{invoice.trackingNumber || 'N/A'}</Text>
                        </View>
                        <View className="flex-row justify-between">
                            <Text className="text-gray-600">Status:</Text>
                            <Text className="text-gray-900 font-medium uppercase">{invoice.status}</Text>
                        </View>
                    </View>

                    {/* Items Table */}
                    <View className="mb-6">
                        <Text className="text-lg font-bold text-gray-900 mb-3 ">Items:</Text>

                        {/* Table Header */}
                        <View className="flex-row  p-3 rounded-t-lg">
                            <Text className="flex-1 font-semibold text-gray-900">Item</Text>
                            <Text className="w-16 font-semibold text-gray-900 text-center">Qty</Text>
                            <Text className="w-20 font-semibold text-gray-900 text-right">Price</Text>
                            <Text className="w-24 font-semibold text-gray-900 text-right">Amount</Text>
                        </View>

                        {/* Table Rows */}
                        {invoice.items.map((item, index) => (
                            <View
                                key={index}
                                className={`flex-row p-3 border-b border-gray-200 ${index === invoice.items.length - 1 ? 'rounded-b-lg' : ''
                                    }`}
                            >
                                <Text className="flex-1 text-gray-900" numberOfLines={2}>{item.productName}</Text>
                                <Text className="w-16 text-gray-900 text-center">{item.quantity}</Text>
                                <Text className="w-20 text-gray-900 text-right">₹{item.unitPrice.toFixed(2)}</Text>
                                <Text className="w-24 text-gray-900 text-right">₹{item.amount.toFixed(2)}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Summary */}
                    <View className="rounded-lg p-4 mb-6">
                        <View className="flex-row justify-between mb-2">
                            <Text className="text-gray-600">Subtotal:</Text>
                            <Text className="text-gray-900">₹{invoice.pricing.subtotal.toFixed(2)}</Text>
                        </View>
                        <View className="flex-row justify-between mb-3">
                            <Text className="text-gray-600">Shipping:</Text>
                            <Text className="text-gray-900">₹{invoice.pricing.shipping.toFixed(2)}</Text>
                        </View>
                        <View className="h-px bg-gray-300 mb-3" />
                        <View className="flex-row justify-between">
                            <Text className="text-lg font-bold text-gray-900">Total:</Text>
                            <Text className="text-lg font-bold text-gray-900">
                                ₹{invoice.pricing.total.toFixed(2)}
                            </Text>
                        </View>
                    </View>

                    {/* Download Button */}
                    <ThemedButton
                        title={downloading ? "Downloading..." : "Download PDF"}
                        onPress={downloadPDF}
                        disabled={downloading}
                        icon={downloading ? undefined : "download-outline"}
                    />

                    {/* Footer */}
                    <View className="mt-6 pt-4 border-t border-gray-200">
                        <Text className="text-center text-gray-600 text-sm">
                            Thank you for shopping with Stylique!
                        </Text>
                        <Text className="text-center text-gray-500 text-xs mt-1">
                            For any queries, please contact support@stylique.com
                        </Text>
                    </View>
                </ThemedSection>
            </ScrollView>
        </ThemedContainer>
    );
};

export default Invoice;
