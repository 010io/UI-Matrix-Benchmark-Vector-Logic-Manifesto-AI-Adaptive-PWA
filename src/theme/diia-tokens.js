/**
 * Diia Design System - Design Tokens
 * 
 * Single source of truth for the entire design system
 * Based on official Diia Design System specifications
 * 
 * @version 1.0.0
 * @see https://design.diia.gov.ua/
 */

/**
 * Complete Diia Design Tokens
 * @const {Object} DIIA_TOKENS
 */
export const DIIA_TOKENS = Object.freeze({
  /**
   * Color Palette
   * Primary colors based on official Diia branding
   */
  colors: {
    // Primary
    primary: '#67C3F3',          // Diia Blue - main brand color
    primaryDark: '#4BA3D3',      // Darker shade for hover states
    primaryLight: '#A3DDFB',      // Lighter shade for backgrounds
    
    // Background
    background: '#E2ECF4',        // Light blue-gray
    backgroundDark: '#0a0e27',    // Dark mode background
    backgroundCard: '#FFFFFF',    // Card background
    
    // Text
    text: '#000000',              // Primary text
    textSecondary: '#666666',     // Secondary text
    textTertiary: '#999999',      // Tertiary text / placeholders
    textInverse: '#FFFFFF',       // Text on dark backgrounds
    
    // Semantic colors
    success: '#4CAF50',           // Green - success states
    error: '#F44336',             // Red - error states
    warning: '#FF9800',           // Orange - warning states
    info: '#2196F3',              // Blue - informational
    
    // Ukrainian flag
    flag: {
      blue: '#005BBB',            // Ukrainian blue
      yellow: '#FFD700'           // Ukrainian yellow (gold)
    },
    
    // Grays
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827'
    },
    
    // Transparency overlays
    overlay: {
      light: 'rgba(255, 255, 255, 0.9)',
      medium: 'rgba(255, 255, 255, 0.7)',
      dark: 'rgba(0, 0, 0, 0.5)'
    }
  },
  
  /**
   * Spacing System (8px grid)
   * All spacing should use multiples of 8px
   */
  spacing: {
    0: 0,
    xs: 4,      // 0.5 × base
    sm: 8,      // 1 × base (base unit)
    md: 16,     // 2 × base
    lg: 24,     // 3 × base
    xl: 32,     // 4 × base
    xxl: 48,    // 6 × base
    xxxl: 64,   // 8 × base
    
    // Semantic spacing
    sectionGap: 48,
    containerPadding: 16,
    cardPadding: 24
  },
  
  /**
   * Typography Scale
   * Font sizes based on 8px grid with responsive scaling
   */
  typography: {
    fontFamily: {
      primary: "'e-Ukraine', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      mono: "'Roboto Mono', 'Courier New', monospace"
    },
    
    fontSize: {
      xs: 10,      // Labels, captions
      sm: 12,      // Small text
      base: 14,    // Body text
      md: 16,      // Medium text
      lg: 18,      // Large text
      xl: 24,      // Headings
      xxl: 32,     // Large headings
      xxxl: 48,    // Hero text
      display: 64  // Display text
    },
    
    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    },
    
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
      loose: 2
    },
    
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em'
    }
  },
  
  /**
   * Border Radius
   * Rounded corners for UI elements
   */
  radius: {
    none: 0,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
    full: '9999px'  // Pills / circles
  },
  
  /**
   * Shadows
   * Elevation system for depth
   */
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    xxl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    
    // Diia-specific holographic glow
    hologram: '0 0 20px rgba(103, 195, 243, 0.3)'
  },
  
  /**
   * Animation & Transitions
   */
  animation: {
    // Duration (milliseconds)
    duration: {
      instant: 0,
      fast: 150,
      base: 300,
      slow: 500,
      slower: 750,
      slowest: 1000
    },
    
    // Easing functions
    easing: {
      linear: 'linear',
      ease: 'ease',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      
      // Custom Diia easing
      diiaSmooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      diiaSharp: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    },
    
    // Keyframes (CSS property)
    keyframes: {
      fadeIn: 'fadeIn',
      fadeOut: 'fadeOut',
      slideIn: 'slideIn',
      slideOut: 'slideOut',
      hologramShift: 'hologramShift'
    }
  },
  
  /**
   * Breakpoints for Responsive Design
   */
  breakpoints: {
    mobile: 320,      // Mobile portrait
    mobileLandscape: 480,
    tablet: 768,      // Tablet portrait
    tabletLandscape: 1024,
    desktop: 1280,    // Desktop
    wide: 1536,       // Wide desktop
    ultrawide: 1920   // Ultra-wide screens
  },
  
  /**
   * Z-Index Scale
   * Layering system
   */
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
    toast: 1080
  },
  
  /**
   * Component-Specific Dimensions
   */
  components: {
    // Canvas / viewport
    canvas: {
      width: 360,
      height: 680,
      maxWidth: 1920
    },
    
    // Diia ID Card
    card: {
      width: 328,           // Card width
      height: 220,          // Card height
      photoRadius: 45,      // Profile photo radius
      qrSize: 60,           // QR code size
      flagWidth: 40,        // Flag width
      flagHeight: 24        // Flag height
    },
    
    // Buttons
    button: {
      height: {
        sm: 32,
        md: 40,
        lg: 48
      },
      padding: {
        sm: 12,
        md: 16,
        lg: 24
      }
    },
    
    // Input fields
    input: {
      height: 48,
      padding: 16,
      borderWidth: 1
    },
    
    // Header
    header: {
      height: 64,
      mobileHeight: 56
    },
    
    // Footer
    footer: {
      height: 80
    }
  },
  
  /**
   * Mathematical Constants
   */
  math: {
    goldenRatio: 1.618,
    phi: 1.618033988749895,
    pi: Math.PI,
    e: Math.E
  }
});

/**
 * Get CSS custom properties string
 * For use in <style> tags or CSS files
 * 
 * @returns {string} CSS custom properties
 */
export function getDiiaCSSVariables() {
  const tokens = DIIA_TOKENS;
  
  return `
:root {
  /* Colors - Primary */
  --diia-primary: ${tokens.colors.primary};
  --diia-primary-dark: ${tokens.colors.primaryDark};
  --diia-primary-light: ${tokens.colors.primaryLight};
  
  /* Colors - Background */
  --diia-bg: ${tokens.colors.background};
  --diia-bg-dark: ${tokens.colors.backgroundDark};
  --diia-bg-card: ${tokens.colors.backgroundCard};
  
  /* Colors - Text */
  --diia-text: ${tokens.colors.text};
  --diia-text-secondary: ${tokens.colors.textSecondary};
  --diia-text-tertiary: ${tokens.colors.textTertiary};
  --diia-text-inverse: ${tokens.colors.textInverse};
  
  /* Colors - Semantic */
  --diia-success: ${tokens.colors.success};
  --diia-error: ${tokens.colors.error};
  --diia-warning: ${tokens.colors.warning};
  --diia-info: ${tokens.colors.info};
  
  /* Spacing */
  --diia-space-xs: ${tokens.spacing.xs}px;
  --diia-space-sm: ${tokens.spacing.sm}px;
  --diia-space-md: ${tokens.spacing.md}px;
  --diia-space-lg: ${tokens.spacing.lg}px;
  --diia-space-xl: ${tokens.spacing.xl}px;
  --diia-space-xxl: ${tokens.spacing.xxl}px;
  
  /* Typography */
  --diia-font-primary: ${tokens.typography.fontFamily.primary};
  --diia-font-mono: ${tokens.typography.fontFamily.mono};
  --diia-font-size-base: ${tokens.typography.fontSize.base}px;
  
  /* Border Radius */
  --diia-radius-sm: ${tokens.radius.sm}px;
  --diia-radius-md: ${tokens.radius.md}px;
  --diia-radius-lg: ${tokens.radius.lg}px;
  --diia-radius-full: ${tokens.radius.full};
  
  /* Shadows */
  --diia-shadow-sm: ${tokens.shadows.sm};
  --diia-shadow-md: ${tokens.shadows.md};
  --diia-shadow-lg: ${tokens.shadows.lg};
  --diia-shadow-hologram: ${tokens.shadows.hologram};
  
  /* Animation */
  --diia-duration-fast: ${tokens.animation.duration.fast}ms;
  --diia-duration-base: ${tokens.animation.duration.base}ms;
  --diia-duration-slow: ${tokens.animation.duration.slow}ms;
  --diia-easing: ${tokens.animation.easing.easeInOut};
  --diia-easing-smooth: ${tokens.animation.easing.diiaSmooth};
}
`.trim();
}

/**
 * Export for browser (non-module)
 */
if (typeof window !== 'undefined') {
  window.DIIA_TOKENS = DIIA_TOKENS;
  window.getDiiaCSSVariables = getDiiaCSSVariables;
}
