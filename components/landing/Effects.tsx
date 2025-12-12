
import React, { useRef, useState } from 'react';

// --- MAGNETIC BUTTON ---
interface MagneticButtonProps {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    onClick?: (e: React.MouseEvent) => void;
    enabled: boolean;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({ children, className, style, onClick, enabled }) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!enabled || !buttonRef.current) return;
        
        const { clientX, clientY } = e;
        const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
        
        const x = (clientX - (left + width / 2)) * 0.35; // Strength
        const y = (clientY - (top + height / 2)) * 0.35;
        
        setPosition({ x, y });
    };

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
    };

    return (
        <button
            ref={buttonRef}
            className={`${className} transition-transform duration-200 ease-out will-change-transform`}
            style={{ 
                ...style, 
                transform: enabled ? `translate(${position.x}px, ${position.y}px)` : 'none' 
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

// --- TILT CARD ---
interface TiltCardProps {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    enabled: boolean;
}

export const TiltCard: React.FC<TiltCardProps> = ({ children, className, style, enabled }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [rotation, setRotation] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!enabled || !cardRef.current) return;
        
        const { clientX, clientY } = e;
        const { left, top, width, height } = cardRef.current.getBoundingClientRect();
        
        // Calculate percentages
        const x = (clientX - left) / width;
        const y = (clientY - top) / height;
        
        // Max tilt rotation (degrees)
        const maxTilt = 15;
        
        const rotateY = (x - 0.5) * maxTilt * 2;
        const rotateX = (0.5 - y) * maxTilt * 2;
        
        setRotation({ x: rotateX, y: rotateY });
    };

    const handleMouseLeave = () => {
        setRotation({ x: 0, y: 0 });
    };

    const cardStyle = enabled ? {
        transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        transition: 'transform 0.1s ease-out',
        willChange: 'transform' as any
    } : {};

    return (
        <div
            ref={cardRef}
            className={className}
            style={{ ...style, ...cardStyle }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {children}
        </div>
    );
};
