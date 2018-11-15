import * as React from "react";
import { text, ValidationInfo } from "../../src";
import ValidationContainer from "../../src/ValidationContainer";
import ValidationWrapperV1 from "../../src/ValidationWrapperV1";
import Input from "retail-ui/components/Input";
import { Nullable } from "../../src/Types";
import { ValidationState } from "../ValidationHelper";
import Gapped from "retail-ui/components/Gapped";
import Button from "retail-ui/components/Button";
import { delay, getValueAfter } from "./AsyncHelper";
import { ValidationLevel, ValidationType } from "../../src/ValidationWrapper";

interface SingleInputPageState {
    sending: boolean;
    data: DataModel;
    validation: ValidationState;
}

interface DataModel {
    lower: string;
    upper: string;
    value: string;
}

interface Validation1 {
    level?: ValidationLevel;
    message: React.ReactNode;
}

interface Validation2 {
    validation1: Nullable<Promise<Validation1>>;
    type?: ValidationType;
}

interface ServerValidation {
    lower: Nullable<string>;
    value: Nullable<string>;
    upper: Nullable<string>;
}

const isNumber = (value: string): boolean => {
    return !!/^\d{1,15}$/.exec(value);
};

const messages = {
    empty: "empty",
    notNumber: "not a number",
    notInRange: "not in range",
};

const server = (message: Nullable<string>): Nullable<string> => {
    return message && `server: ${message}`;
};
const client = (message: Nullable<string>): Nullable<string> => {
    return message && `client: ${message}`;
};

const validateX = (value: string): Nullable<string> => {
    if (!value) {
        return messages.empty;
    }
    if (!isNumber(value)) {
        return messages.notNumber;
    }
    return null;
};

const validateOnServer = async (data: DataModel): Promise<ServerValidation> => {
    await delay(3000);
    const result: ServerValidation = {
        lower: null,
        value: null,
        upper: null,
    };
    result.lower = server(validateX(data.lower));
    result.upper = server(validateX(data.upper));
    result.value = server(validateX(data.value));

    if (!result.lower && !result.upper && !result.value) {
        const lower = parseInt(data.lower);
        const upper = parseInt(data.upper);
        const value = parseInt(data.value);
        if (!(lower <= value && value <= upper)) {
            result.value = server(messages.notInRange);
        }
    }
    return result;
};

export default class DependentFields extends React.Component<{}, SingleInputPageState> {
    state: SingleInputPageState = {
        sending: false,
        validation: "none",
        data: {
            lower: "",
            value: "",
            upper: "",
        },
    };

    private prevState: SingleInputPageState = this.state;
    private lastValidation: Nullable<Promise<Validation1>> = null;

    validate(): Nullable<Validation2> {
        return {
            type: "lostfocus",
            validation1: this.prevState.data !== this.state.data
                ? (this.lastValidation = validateOnServer(this.state.data).then(x => ({ message: x.value, type: "error" })))
                : this.lastValidation,
        };
    }

    componentWillUpdate() {
        this.prevState = this.state;
    }

    render() {
        return (
            <ValidationContainer ref="container">
                <div style={{ padding: 30 }}>
                    <Gapped vertical gap={40}>
                        <Gapped>
                            <ValidationWrapperV1 data-tid="InputValidation" validationInfo={{ message: "xxx" }} renderMessage={text("bottom")}>
                                <Input
                                    data-tid={"Input"}
                                    value={this.state.data.lower}
                                    onChange={(e, value) => this.setState({ /*lower: value*/ })}
                                />
                            </ValidationWrapperV1>
                            {"<="}
                            <ValidationWrapperV1 data-tid="InputValidation" validationInfo={this.validate() as any} renderMessage={text("bottom")}>
                                <Input
                                    data-tid={"Input"}
                                    value={this.state.data.lower}
                                    onChange={(e, value) => this.setState({})}
                                />
                            </ValidationWrapperV1>
                            {"<="}
                            <ValidationWrapperV1 data-tid="InputValidation" validationInfo={this.validate() as any} renderMessage={text("bottom")}>
                                <Input
                                    data-tid={"Input"}
                                    value={this.state.data.lower}
                                    onChange={(e, value) => this.setState({})}
                                />
                            </ValidationWrapperV1>
                        </Gapped>
                        <Gapped>
                            <Button
                                data-tid={"SubmitButton"}
                                loading={this.state.sending}
                                onClick={this.handleSubmit}
                            >
                                Submit
                            </Button>
                            <span data-tid={"ValidationState"}>{this.state.validation}</span>
                        </Gapped>
                    </Gapped>
                </div>
            </ValidationContainer>
        );
    }

    handleSubmit = () => {
        this.setState({ sending: true, validation: "validating" }, async () => {
            const isValid = await (this.refs.container as ValidationContainer).validate();
            this.setState({ sending: false, validation: isValid ? "valid" : "invalid" });
        });
    };
}
