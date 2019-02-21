import * as React from "react";
import * as PropTypes from "prop-types";
import ValidationWrapper from "./ValidationWrapper";
export interface IValidationContextSettings {
    scroll: {
        horizontalOffset: number;
        verticalOffset: number;
    };
}
export interface IValidationContext {
    register(wrapper: ValidationWrapper): void;
    unregister(wrapper: ValidationWrapper): void;
    instanceProcessBlur(wrapper: ValidationWrapper): void;
    onValidationUpdated(wrapper: ValidationWrapper, isValid: boolean): void;
    getSettings(): IValidationContextSettings;
    isAnyWrapperInChangingMode(): boolean;
}
export interface ValidationContextProps {
    children?: React.ReactNode;
    onValidationUpdated?: (isValid?: boolean) => void;
    horizontalOffset?: number;
    verticalOffset?: number;
}
export default class ValidationContext extends React.Component<ValidationContextProps> {
    static childContextTypes: {
        validationContext: PropTypes.Requireable<any>;
    };
    childWrappers: ValidationWrapper[];
    getChildContext(): {
        validationContext: IValidationContext;
    };
    getSettings(): IValidationContextSettings;
    register(wrapper: ValidationWrapper): void;
    unregister(wrapper: ValidationWrapper): void;
    instanceProcessBlur(instance: ValidationWrapper): void;
    onValidationUpdated(wrapper: ValidationWrapper, isValid?: boolean): void;
    isAnyWrapperInChangingMode(): boolean;
    onValidationRemoved(): void;
    getChildWrappersSortedByPosition(): ValidationWrapper[];
    validate(withoutFocus: boolean): Promise<boolean>;
    render(): JSX.Element;
}
