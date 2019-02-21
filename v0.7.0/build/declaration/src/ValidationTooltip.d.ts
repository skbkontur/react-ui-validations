import * as React from "react";
export declare type TooltipPosition = "top left" | "top center" | "top right" | "bottom left" | "bottom center" | "bottom right" | "left top" | "left middle" | "left bottom" | "right top" | "right middle" | "right bottom";
export interface ValidationTooltipProps {
    children: React.ReactElement<any>;
    type?: "simple" | "lostfocus";
    error: boolean;
    pos?: TooltipPosition;
    render?: () => React.ReactNode;
}
interface ValidationTooltipState {
    focus: boolean;
    mouseOver: boolean;
}
export default class ValidationTooltip extends React.Component<ValidationTooltipProps, ValidationTooltipState> {
    state: ValidationTooltipState;
    handleFocus(): void;
    handleBlur(): void;
    handleMouseOver(): void;
    handleMouseOut(): void;
    render(): JSX.Element;
}
export {};
