# SellerHub - Static Functional E-commerce Dashboard

A modern, responsive e-commerce seller dashboard built with React, TypeScript, and Tailwind CSS. This is a fully static and functional website that demonstrates a complete seller-side e-commerce management system.

## 🚀 Features

### 📊 Dashboard
- **Real-time Metrics**: Sales, orders, products, customers, revenue, and returns tracking
- **Interactive Charts**: Line charts, bar charts, and doughnut charts with static data
- **Top Products**: Best-selling products with sales metrics
- **Recent Orders**: Latest order activity with status tracking
- **Performance Metrics**: Inventory alerts and performance indicators

### 📦 Products Management
- **Product Catalog**: Complete product listing with images, prices, and stock levels
- **Advanced Filtering**: Search by name/SKU, filter by category and status
- **Product Analytics**: Sales data, ratings, and performance metrics
- **Bulk Operations**: Export and bulk upload functionality
- **Stock Management**: Low stock alerts and inventory tracking

### 🛒 Orders Management
- **Order Tracking**: Complete order lifecycle management
- **Status Management**: Processing, shipped, delivered, cancelled, and pending orders
- **Customer Information**: Customer details with shipping addresses
- **Payment Status**: Track payment status (paid, pending, refunded)
- **Revenue Analytics**: Total revenue and order statistics

### ⚙️ Settings & Configuration
- **Profile Management**: Update personal information and contact details
- **Store Settings**: Business information, GSTIN, PAN, and store description
- **Security Settings**: Two-factor authentication, login notifications, session timeout
- **Payment Settings**: Bank account details and payment method preferences
- **Notification Preferences**: Customizable notification settings

### 🎨 User Interface
- **Modern Design**: Clean, professional interface with dark theme
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile
- **Interactive Elements**: Hover effects, loading states, and smooth transitions
- **Accessibility**: Proper ARIA labels and keyboard navigation

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS for responsive design
- **Icons**: Lucide React for consistent iconography
- **Routing**: React Router DOM for navigation
- **Build Tool**: Vite for fast development and building
- **Charts**: Custom SVG-based charts (no external dependencies)

## 📁 Project Structure

```
src/
├── components/
│   ├── features/
│   │   └── dashboard/
│   │       ├── InventoryAlerts.tsx
│   │       ├── PerformanceMetrics.tsx
│   │       └── RecentOrders.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Sidebar.tsx
│   ├── pages/
│   │   ├── Analytics.tsx
│   │   ├── Customers.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Inventory.tsx
│   │   ├── Marketing.tsx
│   │   ├── Orders.tsx
│   │   ├── Payments.tsx
│   │   ├── Products.tsx
│   │   ├── Returns.tsx
│   │   ├── Reviews.tsx
│   │   ├── Settings.tsx
│   │   ├── Shipping.tsx
│   │   └── Support.tsx
│   └── shared/
│       ├── Chart.tsx
│       └── MetricCard.tsx
├── App.tsx
└── main.tsx
```

## 🚀 Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Indinest_Seller-Side/project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📊 Static Data

The application uses realistic static data to demonstrate functionality:

### Sample Data Includes:
- **Products**: 8 products with images, prices, ratings, and sales data
- **Orders**: 8 orders with customer details, shipping addresses, and payment status
- **Metrics**: Realistic sales figures, revenue calculations, and performance indicators
- **Settings**: Pre-filled forms with sample business information

## 🎯 Key Features Demonstrated

### 1. **Interactive Dashboard**
- Real-time metrics with trend indicators
- Custom SVG charts (line, bar, doughnut)
- Top products ranking
- Recent order activity

### 2. **Advanced Product Management**
- Product catalog with images and details
- Search and filtering functionality
- Stock level tracking
- Product performance analytics

### 3. **Comprehensive Order Management**
- Order status tracking
- Customer information display
- Payment status monitoring
- Revenue analytics

### 4. **Settings & Configuration**
- Tabbed interface for different settings sections
- Form validation and state management
- Real-time save functionality with loading states
- Success notifications

### 5. **Responsive Design**
- Mobile-first approach
- Collapsible sidebar
- Adaptive layouts for different screen sizes
- Touch-friendly interface

## 🔧 Customization

### Adding New Pages
1. Create a new component in `src/components/pages/`
2. Add the route in `src/App.tsx`
3. Add navigation item in `src/components/layout/Sidebar.tsx`

### Modifying Data
- Update static data arrays in respective components
- Add new fields to data structures
- Modify filtering and search logic

### Styling
- Uses Tailwind CSS utility classes
- Custom components follow consistent design patterns
- Easy to modify colors, spacing, and layout

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

For support or questions, please open an issue in the repository.

---

**Note**: This is a static demonstration website. All data is mock data and no actual e-commerce functionality is implemented. The focus is on demonstrating a complete, functional UI/UX for an e-commerce seller dashboard.