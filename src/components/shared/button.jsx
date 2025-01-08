import React from "react";
import PropTypes from "prop-types";

const Button = ({
    label,
    onClick,
    variant = "solid",
    size = "md",
    disabled = false,
    icon: Icon,
}) => {
    const baseClass = `flex items-center justify-center rounded-md font-[600] text-xs transition duration-200 ease-in-out`;
    const sizeClass = {
        sm: "px-3 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-6 py-3 text-lg",
    }[size];

    const variantClass = {
        solid: "bg-[#0f5D30] text-white hover:bg-[#0a3e20]",
        outline: "text-[#0f5D30] border border-[#0f5D30] hover:bg-[#f0f0f0]",
        transparent: "bg-transparent text-[#0f5D30] border border-green-600 hover:bg-green-50 hover:text-green-700",

    }[variant];

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${baseClass} ${sizeClass} ${variantClass} ${disabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
        >
            {Icon && <Icon className="mr-2" />}
            {label}
        </button>
    );
};

Button.propTypes = {
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    variant: PropTypes.oneOf(["solid", "outline", "transparent"]),
    size: PropTypes.oneOf(["sm", "md", "lg"]),
    disabled: PropTypes.bool,
    icon: PropTypes.elementType,
};

export default Button;
