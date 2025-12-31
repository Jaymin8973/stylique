import React, { useState } from 'react';
import { User, Store, CreditCard, Shield, Bell, Globe, Palette, Key, Save, CheckCircle } from 'lucide-react';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [profileData, setProfileData] = useState({
    fullName: 'John Seller',
    email: 'john@seller.com',
    phone: '+91 98765 43210',
    location: 'Mumbai, India'
  });

  const [storeData, setStoreData] = useState({
    storeName: 'Premium Electronics Store',
    businessType: 'Individual',
    gstin: '27AAPFU0939F1ZV',
    pan: 'AAPFU0939F',
    description: 'We specialize in premium electronics and gadgets with warranty and fast delivery.'
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    loginNotifications: true,
    sessionTimeout: '30'
  });

  const handleSave = async (section: string) => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleProfileChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleStoreChange = (field: string, value: string) => {
    setStoreData(prev => ({ ...prev, [field]: value }));
  };

  const handleSecurityChange = (field: string, value: boolean | string) => {
    setSecuritySettings(prev => ({ ...prev, [field]: value }));
  };

  const menuItems = [
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'store', icon: Store, label: 'Store Settings' },
    { id: 'payments', icon: CreditCard, label: 'Payment Settings' },
    { id: 'security', icon: Shield, label: 'Security' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-1">Manage your account and store preferences</p>
        </div>
        {saveSuccess && (
          <div className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Settings saved successfully!</span>
          </div>
        )}
      </div>

      {/* Settings Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4">
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center space-x-3 px-3 py-2 w-full rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-black text-white' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Profile Information
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input 
                      type="text" 
                      value={profileData.fullName}
                      onChange={(e) => handleProfileChange('fullName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input 
                      type="email" 
                      value={profileData.email}
                      onChange={(e) => handleProfileChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input 
                      type="tel" 
                      value={profileData.phone}
                      onChange={(e) => handleProfileChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input 
                      type="text" 
                      value={profileData.location}
                      onChange={(e) => handleProfileChange('location', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <button 
                    onClick={() => handleSave('profile')}
                    disabled={isSaving}
                    className="flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Store Settings */}
          {activeTab === 'store' && (
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold flex items-center">
                  <Store className="w-5 h-5 mr-2" />
                  Store Information
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
                    <input 
                      type="text" 
                      value={storeData.storeName}
                      onChange={(e) => handleStoreChange('storeName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
                    <select 
                      value={storeData.businessType}
                      onChange={(e) => handleStoreChange('businessType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    >
                      <option>Individual</option>
                      <option>Partnership</option>
                      <option>Private Limited</option>
                      <option>LLP</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">GSTIN</label>
                    <input 
                      type="text" 
                      value={storeData.gstin}
                      onChange={(e) => handleStoreChange('gstin', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">PAN</label>
                    <input 
                      type="text" 
                      value={storeData.pan}
                      onChange={(e) => handleStoreChange('pan', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Store Description</label>
                  <textarea 
                    rows={4}
                    value={storeData.description}
                    onChange={(e) => handleStoreChange('description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                <div className="mt-6">
                  <button 
                    onClick={() => handleSave('store')}
                    disabled={isSaving}
                    className="flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Update Store
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Security & Privacy
                </h2>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={securitySettings.twoFactorAuth}
                      onChange={(e) => handleSecurityChange('twoFactorAuth', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-black/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Login Notifications</h3>
                    <p className="text-sm text-gray-500">Get notified of new login attempts</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={securitySettings.loginNotifications}
                      onChange={(e) => handleSecurityChange('loginNotifications', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-black/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Session Timeout</h3>
                    <p className="text-sm text-gray-500">Automatically log out after inactivity</p>
                  </div>
                  <select 
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => handleSecurityChange('sessionTimeout', e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="120">2 hours</option>
                  </select>
                </div>
                <div>
                  <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Key className="w-4 h-4 mr-2" />
                    Change Password
                  </button>
                </div>
                <div className="mt-6">
                  <button 
                    onClick={() => handleSave('security')}
                    disabled={isSaving}
                    className="flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Security Settings
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Payment Settings */}
          {activeTab === 'payments' && (
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Payment Settings
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-4">Bank Account Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Account Holder Name</label>
                        <input 
                          type="text" 
                          defaultValue="John Seller"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                        <input 
                          type="text" 
                          defaultValue="1234567890"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">IFSC Code</label>
                        <input 
                          type="text" 
                          defaultValue="SBIN0001234"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
                        <input 
                          type="text" 
                          defaultValue="State Bank of India"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-4">Payment Methods</h3>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="mr-3" />
                        <span>UPI Payments</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="mr-3" />
                        <span>Card Payments</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="mr-3" />
                        <span>Net Banking</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-3" />
                        <span>Cash on Delivery</span>
                      </label>
                    </div>
                  </div>
                  <div className="mt-6">
                    <button className="flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                      <Save className="w-4 h-4 mr-2" />
                      Save Payment Settings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Settings */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Notification Preferences
                </h2>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">New Order Notifications</h3>
                    <p className="text-sm text-gray-500">Get notified when you receive new orders</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-black/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Low Stock Alerts</h3>
                    <p className="text-sm text-gray-500">Get notified when products are running low</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-black/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Payment Notifications</h3>
                    <p className="text-sm text-gray-500">Get notified of successful payments</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-black/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Customer Reviews</h3>
                    <p className="text-sm text-gray-500">Get notified of new customer reviews</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-black/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                  </label>
                </div>
                <div className="mt-6">
                  <button className="flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                    <Save className="w-4 h-4 mr-2" />
                    Save Notification Settings
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;