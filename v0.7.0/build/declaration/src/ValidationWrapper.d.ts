import * as React from "react";
import * as PropTypes from "prop-types";
import { Nullable } from "typings/Types";
import { IValidationContext } from "./ValidationContext";
export declare type ValidationBehaviour = "immediate" | "lostfocus" | "submit";
export declare type ValidationLevel = "error" | "warning";
export interface Validation {
    error: boolean;
    level: ValidationLevel;
    behaviour: ValidationBehaviour;
    message: React.ReactNode;
}
export declare type RenderErrorMessage = (control: React.ReactElement<any>, hasError: boolean, validation: Nullable<Validation>) => React.ReactElement<any>;
export interface ValidationWrapperProps {
    children?: React.ReactElement<any>;
    validations: Validation[];
    errorMessage: RenderErrorMessage;
}
interface ValidationState {
    visible?: boolean;
}
interface ValidationWrapperState {
    validationStates: ValidationState[];
}
interface Point {
    x: number;
    y: number;
}
export default class ValidationWrapper extends React.Component<ValidationWrapperProps, ValidationWrapperState> {
    state: ValidationWrapperState;
    context: {
        validationContext: IValidationContext;
    };
    refs: {
        errorMessage: any;
    };
    static contextTypes: {
        validationContext: PropTypes.Requireable<any>;
    };
    child: any;
    isChanging: boolean;
    componentWillMount(): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    componentWillReceiveProps(nextProps: ValidationWrapperProps): void;
    syncWithState(props: ValidationWrapperProps): void;
    createState(validation: Validation): ValidationState;
    emulateBlur(): void;
    handleBlur(): void;
    processSubmit(): Promise<void>;
    processValidationSubmit(validation: Validation, validationState: ValidationState, index: number): Promise<void>;
    processBlur(validation: Validation, validationState: ValidationState, index: number): void;
    focus(): Promise<void>;
    getControlPosition(): Nullable<Point>;
    isErrorOrWarning(validation: Validation, index: number): boolean;
    isError(validation: Validation, index: number): boolean;
    hasError(): boolean;
    render(): React.ReactElement<any>;
}
export {};
