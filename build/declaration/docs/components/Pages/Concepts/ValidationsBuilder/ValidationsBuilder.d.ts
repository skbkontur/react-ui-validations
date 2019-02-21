import * as React from "react";
import { ContactInfo } from "docs/Domain/ContactInfo";
interface ValidationsBuilderState {
    data: ContactInfo;
}
export default class ValidationsBuilder extends React.Component<{}, ValidationsBuilderState> {
    state: ValidationsBuilderState;
    handleSubmit(): void;
    render(): JSX.Element;
}
export {};
