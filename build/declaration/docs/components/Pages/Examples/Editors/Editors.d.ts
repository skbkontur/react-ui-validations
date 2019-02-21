import * as React from "react";
import { Nullable } from "typings/Types";
import { ValidationResultFor } from "./ValidationBuilder";
export interface ContactInfo {
    name: string;
    email: string;
    phone: string;
    sex: Nullable<"male" | "female">;
    city: Nullable<string>;
    confession: Nullable<string>;
    confirmed: boolean;
    about: string;
    born: string;
    modalOpened: boolean;
}
export interface FormEditorProps {
    data: ContactInfo;
    validation?: Nullable<ValidationResultFor<ContactInfo>>;
    onChange: (update: Partial<ContactInfo>) => void;
}
interface EditorsState {
    data: ContactInfo;
}
export default class Editors extends React.Component<{}, EditorsState> {
    state: EditorsState;
    handleSubmit(): void;
    render(): JSX.Element;
}
export {};
