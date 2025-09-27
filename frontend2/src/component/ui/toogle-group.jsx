import React, { useState, useContext, createContext } from "react";

// Utility function to combine class names
const cn = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

// Toggle variants with pure CSS styles (same as Toggle component)
const getToggleStyles = ({
  variant = "default",
  size = "default",
  isPressed = false,
}) => {
  const baseStyles = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    cursor: "pointer",
    border: "none",
    outline: "none",
    gap: "8px",
    position: "relative",
    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    userSelect: "none",
  };

  // Variant styles
  const variantStyles = {
    default: {
      backgroundColor: isPressed ? "#e5e7eb" : "transparent",
      color: isPressed ? "#111827" : "#6b7280",
      ":hover": {
        backgroundColor: "#f3f4f6",
        color: "#374151",
        transform: "translateY(-1px)",
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      },
      ":active": {
        transform: "translateY(0)",
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      },
    },
    outline: {
      border: "1px solid #d1d5db",
      backgroundColor: isPressed ? "#f3f4f6" : "transparent",
      color: isPressed ? "#111827" : "#6b7280",
      ":hover": {
        backgroundColor: "#f9fafb",
        color: "#374151",
        borderColor: "#9ca3af",
        transform: "translateY(-1px)",
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      },
      ":active": {
        transform: "translateY(0)",
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      },
    },
  };

  // Size styles
  const sizeStyles = {
    default: {
      height: "40px",
      paddingLeft: "12px",
      paddingRight: "12px",
      minWidth: "40px",
    },
    sm: {
      height: "36px",
      paddingLeft: "10px",
      paddingRight: "10px",
      minWidth: "36px",
    },
    lg: {
      height: "44px",
      paddingLeft: "20px",
      paddingRight: "20px",
      minWidth: "44px",
    },
  };

  return {
    ...baseStyles,
    ...variantStyles[variant],
    ...sizeStyles[size],
  };
};

const ToggleGroupContext = createContext({
  size: "default",
  variant: "default",
  type: "multiple",
});

const ToggleGroup = React.forwardRef(
  ({ variant, size, children, type = "multiple", style, ...props }, ref) => {
    const groupStyles = {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "4px",
      ...style,
    };

    return (
      <div ref={ref} style={groupStyles} role="group" {...props}>
        <ToggleGroupContext.Provider value={{ variant, size, type }}>
          {children}
        </ToggleGroupContext.Provider>
      </div>
    );
  }
);

ToggleGroup.displayName = "ToggleGroup";

const ToggleGroupItem = React.forwardRef(
  (
    {
      variant,
      size,
      pressed,
      onPressedChange,
      children,
      style,
      onMouseEnter,
      onMouseLeave,
      ...props
    },
    ref
  ) => {
    const context = useContext(ToggleGroupContext);
    const [isPressed, setIsPressed] = useState(pressed || false);
    const [isHovered, setIsHovered] = useState(false);

    const actualVariant = context.variant || variant || "default";
    const actualSize = context.size || size || "default";

    const handleClick = (event) => {
      event.preventDefault();
      const newPressed = !isPressed;
      setIsPressed(newPressed);
      if (onPressedChange) {
        onPressedChange(newPressed);
      }
    };

    const handleMouseEnter = (event) => {
      setIsHovered(true);
      if (onMouseEnter) {
        onMouseEnter(event);
      }
    };

    const handleMouseLeave = (event) => {
      setIsHovered(false);
      if (onMouseLeave) {
        onMouseLeave(event);
      }
    };

    const toggleStyles = getToggleStyles({
      variant: actualVariant,
      size: actualSize,
      isPressed,
    });

    // Apply hover styles
    const finalStyles = {
      ...toggleStyles,
      ...(isHovered &&
        actualVariant === "default" && {
          backgroundColor: "#f9fafb",
          color: "#374151",
        }),
      ...(isHovered &&
        actualVariant === "outline" && {
          backgroundColor: "#f3f4f6",
          color: "#1f2937",
        }),
      ...style,
    };

    return (
      <button
        ref={ref}
        style={finalStyles}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        type="button"
        role="button"
        aria-pressed={isPressed}
        data-state={isPressed ? "on" : "off"}
        {...props}
      >
        {children}
      </button>
    );
  }
);

ToggleGroupItem.displayName = "ToggleGroupItem";

export { ToggleGroup, ToggleGroupItem };
