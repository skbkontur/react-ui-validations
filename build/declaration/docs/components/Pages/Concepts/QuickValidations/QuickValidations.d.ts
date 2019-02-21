import * as React from "react";
export interface ContactInfo {
    name: string;
    email: string;
    born: string;
}
export interface FormEditorProps {
    data: ContactInfo;
    onChange: (update: Partial<ContactInfo>) => void;
}
interface QuickValidationsState {
    data: ContactInfo;
}
export default class QuickValidations extends React.Component<{}, QuickValidationsState> {
    state: QuickValidationsState;
    handleSubmit(): void;
    render(): JSX.Element;
}
export {};
