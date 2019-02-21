import * as React from "react";
interface FormLineProps {
    children?: React.ReactNode;
    title: string;
}
declare const FormLine: React.FunctionComponent<FormLineProps>;
interface ActionsBarProps {
    children?: React.ReactNode;
}
declare const ActionsBar: import("styled-components").StyledComponent<"div", any, ActionsBarProps, never>;
interface FormProps {
    children?: React.ReactNode;
}
export default class Form extends React.Component<FormProps> {
    static Line: typeof FormLine;
    static ActionsBar: typeof ActionsBar;
    render(): JSX.Element;
}
export {};
