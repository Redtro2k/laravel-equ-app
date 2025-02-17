import React from 'react'

type BadgeProps = {
    text: string;
    color?: "gray" | "red" | "yellow" | "green" | "blue" | "indigo" | "purple" | "pink";
    size?: "xs" | "sm" | "md" | "lg";
}
export default function badge({text, color = "gray", size = "xs" }: BadgeProps) {
    const baseStyle = "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset";

    const colorStyles: Record<string, string> = {
        gray: "bg-gray-400/10 text-gray-400 ring-gray-400/20",
        red: "bg-red-400/10 text-red-400 ring-red-400/20",
        yellow: "bg-yellow-400/10 text-yellow-500 ring-yellow-400/20",
        green: "bg-green-500/10 text-green-400 ring-green-500/20",
        blue: "bg-blue-400/10 text-blue-400 ring-blue-400/30",
        indigo: "bg-indigo-400/10 text-indigo-400 ring-indigo-400/30",
        purple: "bg-purple-400/10 text-purple-400 ring-purple-400/30",
        pink: "bg-pink-400/10 text-pink-400 ring-pink-400/20",
    };

    const sizeStyles: Record<string, string> = {
        xs: "text-xs px-2 py-1",
        sm: "text-sm px-3 py-1.5",
        md: "text-base px-4 py-2",
        lg: "text-lg px-5 py-2.5",
    };

    return <span className={`${baseStyle} ${colorStyles[color]} ${sizeStyles[size]}`}>{text}</span>;
}
