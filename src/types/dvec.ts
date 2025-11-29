/**
 * D-Vec (Diia Vector) Protocol Specification v0.1
 * 
 * This file serves as a Proof of Concept for the "Internal Singularity" phase.
 * It defines the mathematical structure of UI components.
 */

export type DiiaThemeColor = 
  | "theme.colors.bgGeneric" 
  | "theme.colors.bgSurface" 
  | "theme.colors.textPrimary" 
  | "theme.colors.diiaBlue";

export type DiiaMathExpression = string; // e.g., "screen.width - 32"

export interface DiiaVectorComponent {
  id: string;
  type: "card" | "button" | "input" | "text" | "qr";
  
  // Geometry defined by mathematical formulas, not static pixels
  geometry: {
    x: DiiaMathExpression;
    y: DiiaMathExpression;
    width: DiiaMathExpression;
    height: DiiaMathExpression;
    radius?: DiiaMathExpression;
  };
  
  // Styles linked to the Design System tokens
  style: {
    fill?: DiiaThemeColor;
    stroke?: DiiaThemeColor;
    strokeWidth?: number;
    opacity?: number;
    shadow?: boolean;
  };
  
  // Content and Accessibility
  content?: {
    text?: string;
    icon?: string;
  };
  
  a11y: {
    role: string;
    label: string;
    description?: string;
  };
  
  // Children for nested layouts
  children?: DiiaVectorComponent[];
}

// Example of a Diia Card defined in D-Vec
export const exampleCard: DiiaVectorComponent = {
  id: "doc-card-1",
  type: "card",
  geometry: {
    x: "16",
    y: "prev.y + 24",
    width: "screen.width - 32",
    height: "200", // Fixed height for ID card
    radius: "16"
  },
  style: {
    fill: "theme.colors.bgSurface",
    shadow: true
  },
  a11y: {
    role: "article",
    label: "Digital Driver License"
  }
};
