import * as React from "react";
import { ContactInfo } from "docs/Domain/ContactInfo";
interface DifferentMessagesState {
    data: ContactInfo;
}
export default class DifferentMessages extends React.Component<{}, DifferentMessagesState> {
    state: DifferentMessagesState;
    handleSubmit(): void;
    render(): JSX.Element;
}
export {};
