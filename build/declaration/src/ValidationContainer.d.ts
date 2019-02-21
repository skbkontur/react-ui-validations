import * as React from "react";
import { Nullable } from "typings/Types";
export interface ValidationContainerProps {
    children?: React.ReactNode;
    onValidationUpdated?: (isValid?: Nullable<boolean>) => void;
    scrollOffset?: number;
}
export default class ValidationContainer extends React.Component<ValidationContainerProps> {
    submit(withoutFocus?: boolean): Promise<void>;
    validate(withoutFocus?: boolean): Promise<boolean>;
    render(): JSX.Element;
}
