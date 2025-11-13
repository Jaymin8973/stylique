// Consistent theme configuration for Stylique app
export const THEME = {
  // Colors
  colors: {
    primary: '#000000',
    secondary: '#FFFFFF',
    accent: '#10B981', // Green for stock badges
    background: '#FFFFFF',
    surface: '#FFFFFF',
    text: {
      primary: '#111827',
      secondary: '#6B7280',
      tertiary: '#9CA3AF',
      inverse: '#FFFFFF'
    },
    border: '#E5E7EB',
    shadow: 'rgba(0, 0, 0, 0.1)',
    rating: '#FFA500'
  },

  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48
  },

  // Border radius
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 9999
  },

  // Typography
  typography: {
    h1: 'text-3xl font-bold',
    h2: 'text-2xl font-bold',
    h3: 'text-xl font-semibold',
    body: 'text-base',
    caption: 'text-sm',
    small: 'text-xs'
  },

  // Component styles
  components: {
    // Header
    header: {
      background: 'transparent',
      textColor: 'text-gray-900',
      iconColor: '#000000'
    },

    // Search bar
    searchBar: {
      background: 'bg-gray-100',
      textColor: 'text-gray-700',
      placeholderColor: '#999999',
      borderRadius: 'rounded-xl',
      padding: 'px-4 py-3'
    },

    // Category filter
    categoryFilter: {
      active: {
        background: 'bg-black',
        textColor: 'text-white'
      },
      inactive: {
        background: 'bg-gray-100',
        textColor: 'text-gray-700'
      },
      borderRadius: 'rounded-full',
      padding: 'px-5 py-2'
    },

    // Product card
    productCard: {
      background: 'bg-white',
      borderRadius: 'rounded-2xl',
      shadow: 'shadow-sm',
      border: 'border border-gray-100',
      padding: 'p-3'
    },

    // Button
    button: {
      primary: {
        background: 'bg-black',
        textColor: 'text-white'
      },
      secondary: {
        background: 'bg-gray-100',
        textColor: 'text-gray-700'
      }
    },

    // Badge
    badge: {
      success: {
        background: 'bg-green-500',
        textColor: 'text-white'
      },
      warning: {
        background: 'bg-yellow-500',
        textColor: 'text-white'
      }
    }
  },

  // Layout
  layout: {
    container: {
      padding: 'px-5',
      background: 'bg-white'
    },
    section: {
      marginBottom: 'mb-4'
    }
  }
};

// Helper functions for consistent styling
export const getSearchBarStyle = (custom = {}) => ({
  className: `${THEME.components.searchBar.background} ${THEME.components.searchBar.textColor} ${THEME.components.searchBar.borderRadius} ${THEME.components.searchBar.padding} flex-row items-center`,
  ...custom
});

export const getCategoryFilterStyle = (isActive, custom = {}) => {
  const style = isActive ? THEME.components.categoryFilter.active : THEME.components.categoryFilter.inactive;
  return {
    className: `${style.background} ${style.textColor} ${THEME.components.categoryFilter.borderRadius} ${THEME.components.categoryFilter.padding} font-medium`,
    ...custom
  };
};

export const getProductCardStyle = (custom = {}) => ({
  className: `${THEME.components.productCard.background} ${THEME.components.productCard.borderRadius} ${THEME.components.productCard.shadow} ${THEME.components.productCard.border} ${THEME.components.productCard.padding} overflow-hidden`,
  style: {
    elevation: 2,
    shadowColor: THEME.colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    ...custom.style
  },
  ...custom
});

export default THEME;
