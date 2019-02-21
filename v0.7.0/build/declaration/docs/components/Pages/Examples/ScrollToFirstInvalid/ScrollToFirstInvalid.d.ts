import * as React from "react";
export default class DifferentMessages extends React.Component {
    state: {
        data: {
            name: string;
            email: string;
            phone: string;
            sex: null;
        };
    };
    handleSubmit(): void;
    render(): JSX.Element;
}
