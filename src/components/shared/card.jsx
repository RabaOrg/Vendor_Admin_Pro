import React from 'react';
import PropTypes from 'prop-types';

const Card = ({
    children,
    title,
    subtitle,
    footer,
    className = '',
    headerClassName = '',
    bodyClassName = '',
    footerClassName = ''
}) => {
    return (
        <div className={`rounded-lg shadow-sm border-gray-200 border bg-white p-0 ${className}`}>
            {title && (
                <div className={`text-xl font-semibold ${headerClassName}`}>
                    {title}
                </div>
            )}
            {subtitle && (
                <div className={`text-sm text-gray-500 ${headerClassName}`}>
                    {subtitle}
                </div>
            )}
            <div className={`mt-4 ${bodyClassName}`}>
                {children}
            </div>
            {footer && (
                <div className={`mt-4 border-t pt-2 ${footerClassName}`}>
                    {footer}
                </div>
            )}
        </div>
    );
};

Card.propTypes = {
    children: PropTypes.node.isRequired,
    title: PropTypes.string,
    subtitle: PropTypes.string,
    footer: PropTypes.node,
    className: PropTypes.string,
    headerClassName: PropTypes.string,
    bodyClassName: PropTypes.string,
    footerClassName: PropTypes.string,
};

export default Card;
