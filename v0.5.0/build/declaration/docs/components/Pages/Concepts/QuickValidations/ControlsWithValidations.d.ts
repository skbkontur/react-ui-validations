import * as React from "react";
import { ValidationInfo, RenderErrorMessage } from "src/index";
import { Nullable } from "typings/Types";
interface ValidationProps<TValue> {
    required?: boolean;
    email?: boolean;
    validations?: ((value: Nullable<TValue>) => Nullable<ValidationInfo>)[];
    renderErrorMessage?: RenderErrorMessage;
}
declare type WrappedProps<TValue, TProps extends {
    value?: TValue;
}> = TProps & ValidationProps<TValue>;
export declare function lessThanDate(value: Date): ((value: Nullable<string>) => Nullable<ValidationInfo>);
declare const WrappedInput: React.FunctionComponent<WrappedProps<string, import("retail-ui/components/Input").InputProps>>;
export { WrappedInput as Input };
declare const WrappedDatePicker: React.FunctionComponent<WrappedProps<string | null, import("retail-ui/components/DatePicker").DatePickerProps<string>>>;
export { WrappedDatePicker as DatePicker };
