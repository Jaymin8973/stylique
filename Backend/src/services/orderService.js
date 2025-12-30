/**
 * Order Service - Order lifecycle management
 * Handles the entire lifecycle of an order
 * Contains status transitions, validation, and business logic
 */

// Order Status State Machine
// pending -> confirmed -> processing -> shipped -> out_for_delivery -> delivered
//                    |-> cancelled
//                    delivered -> return_requested -> return_approved -> return_picked -> refunded

export const ORDER_STATUSES = {
    PENDING: 'pending',           // Order placed, payment pending
    CONFIRMED: 'confirmed',       // Payment successful, order confirmed
    PROCESSING: 'processing',     // Seller is preparing the order
    SHIPPED: 'shipped',           // Handed over to courier
    OUT_FOR_DELIVERY: 'out_for_delivery', // Out for delivery
    DELIVERED: 'delivered',       // Delivered to customer
    CANCELLED: 'cancelled',       // Order cancelled
    RETURN_REQUESTED: 'return_requested', // Customer requested return
    RETURN_APPROVED: 'return_approved',   // Seller approved return
    RETURN_PICKED: 'return_picked',       // Return pickup completed
    REFUNDED: 'refunded',         // Refund completed
};

// Valid status transitions - which status can go to which
const VALID_TRANSITIONS = {
    [ORDER_STATUSES.PENDING]: [ORDER_STATUSES.CONFIRMED, ORDER_STATUSES.CANCELLED],
    [ORDER_STATUSES.CONFIRMED]: [ORDER_STATUSES.PROCESSING, ORDER_STATUSES.CANCELLED],
    [ORDER_STATUSES.PROCESSING]: [ORDER_STATUSES.SHIPPED, ORDER_STATUSES.CANCELLED],
    [ORDER_STATUSES.SHIPPED]: [ORDER_STATUSES.OUT_FOR_DELIVERY, ORDER_STATUSES.DELIVERED],
    [ORDER_STATUSES.OUT_FOR_DELIVERY]: [ORDER_STATUSES.DELIVERED],
    [ORDER_STATUSES.DELIVERED]: [ORDER_STATUSES.RETURN_REQUESTED],
    [ORDER_STATUSES.RETURN_REQUESTED]: [ORDER_STATUSES.RETURN_APPROVED, ORDER_STATUSES.DELIVERED], // reject = back to delivered
    [ORDER_STATUSES.RETURN_APPROVED]: [ORDER_STATUSES.RETURN_PICKED],
    [ORDER_STATUSES.RETURN_PICKED]: [ORDER_STATUSES.REFUNDED],
    [ORDER_STATUSES.CANCELLED]: [],
    [ORDER_STATUSES.REFUNDED]: [],
};

/**
 * Check if this status transition is valid
 * @param {string} currentStatus - Current status
 * @param {string} newStatus - New status
 * @returns {boolean} - Is valid
 */
export const isValidTransition = (currentStatus, newStatus) => {
    const validNextStatuses = VALID_TRANSITIONS[currentStatus] || [];
    return validNextStatuses.includes(newStatus);
};

/**
 * Get possible next statuses for an order
 * @param {string} currentStatus - Current status
 * @returns {string[]} - Possible next statuses
 */
export const getNextPossibleStatuses = (currentStatus) => {
    return VALID_TRANSITIONS[currentStatus] || [];
};

/**
 * Check if order can be cancelled
 * Only pending, confirmed, processing can be cancelled
 */
export const canCancelOrder = (currentStatus) => {
    const cancellableStatuses = [
        ORDER_STATUSES.PENDING,
        ORDER_STATUSES.CONFIRMED,
        ORDER_STATUSES.PROCESSING,
    ];
    return cancellableStatuses.includes(currentStatus);
};

/**
 * Check if return can be requested
 * Only delivered orders can be returned
 */
export const canRequestReturn = (currentStatus) => {
    return currentStatus === ORDER_STATUSES.DELIVERED;
};

/**
 * Display text for status (customer facing)
 */
export const getStatusDisplayText = (status) => {
    const displayTexts = {
        [ORDER_STATUSES.PENDING]: 'Payment Pending',
        [ORDER_STATUSES.CONFIRMED]: 'Order Confirmed',
        [ORDER_STATUSES.PROCESSING]: 'Being Prepared',
        [ORDER_STATUSES.SHIPPED]: 'Shipped',
        [ORDER_STATUSES.OUT_FOR_DELIVERY]: 'Out for Delivery',
        [ORDER_STATUSES.DELIVERED]: 'Delivered',
        [ORDER_STATUSES.CANCELLED]: 'Cancelled',
        [ORDER_STATUSES.RETURN_REQUESTED]: 'Return Requested',
        [ORDER_STATUSES.RETURN_APPROVED]: 'Return Approved',
        [ORDER_STATUSES.RETURN_PICKED]: 'Return Picked Up',
        [ORDER_STATUSES.REFUNDED]: 'Refunded',
    };
    return displayTexts[status] || status;
};

/**
 * Color code for status (for UI)
 */
export const getStatusColor = (status) => {
    const colors = {
        [ORDER_STATUSES.PENDING]: '#FFA500',      // Orange
        [ORDER_STATUSES.CONFIRMED]: '#4CAF50',    // Green
        [ORDER_STATUSES.PROCESSING]: '#2196F3',   // Blue
        [ORDER_STATUSES.SHIPPED]: '#9C27B0',      // Purple
        [ORDER_STATUSES.OUT_FOR_DELIVERY]: '#FF9800', // Deep Orange
        [ORDER_STATUSES.DELIVERED]: '#4CAF50',    // Green
        [ORDER_STATUSES.CANCELLED]: '#F44336',    // Red
        [ORDER_STATUSES.RETURN_REQUESTED]: '#FF5722', // Deep Orange
        [ORDER_STATUSES.RETURN_APPROVED]: '#795548', // Brown
        [ORDER_STATUSES.RETURN_PICKED]: '#607D8B', // Blue Grey
        [ORDER_STATUSES.REFUNDED]: '#9E9E9E',     // Grey
    };
    return colors[status] || '#9E9E9E';
};

export default {
    ORDER_STATUSES,
    isValidTransition,
    getNextPossibleStatuses,
    canCancelOrder,
    canRequestReturn,
    getStatusDisplayText,
    getStatusColor,
};
