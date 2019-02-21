import * as React from "react";
import { Nullable } from "typings/Types";
import { RenderErrorMessage, ValidationLevel, ValidationBehaviour } from "./ValidationWrapper";
export interface ValidationInfo {
    type?: ValidationBehaviour;
    level?: ValidationLevel;
    message: React.ReactNode;
}
export interface ValidationWrapperV1Props {
    children: React.ReactElement<any>;
    validationInfo: Nullable<ValidationInfo>;
    renderMessage?: Nullable<RenderErrorMessage>;
}
export default class ValidationWrapperV1 extends React.Component<ValidationWrapperV1Props> {
    render(): JSX.Element;
}
