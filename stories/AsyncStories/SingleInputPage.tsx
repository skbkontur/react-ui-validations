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

interface SingleInputPageProps {
    initialValue?: string;
    validationType: ValidationInfo["type"];
}

interface SingleInputPageState {
    sending: boolean;
    value: string;
    validation: ValidationState;
}

interface Validation1 {
    level?: ValidationLevel;
    message: React.ReactNode;
}

interface Validation2 {
    validation1: Nullable<Promise<Validation1>>;
    type?: ValidationType;
}

const validateOnServer = async (value: string): Promise<Nullable<string>> => {
    await delay(3000);
    if (value.substr(0, 3) === "bad") {
        return "incorrect value";
    }
    return null;
};

export default class SingleInputPage extends React.Component<SingleInputPageProps, SingleInputPageState> {
    state: SingleInputPageState = {
        sending: false,
        value: this.props.initialValue || "",
        validation: "none",
    };

    private prevState: SingleInputPageState = this.state;
    private lastValidation: Nullable<Promise<Validation1>> = null;

    validate(): Nullable<Validation2> {
        return {
            type: this.props.validationType,
            validation1: this.prevState.value !== this.state.value
                ? (this.lastValidation = validateOnServer(this.state.value).then(x => ({ message: x, type: "error" })))
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
                    <Gapped vertical>
                        <ValidationWrapperV1 data-tid="InputValidation" validationInfo={this.validate() as any} renderMessage={text()}>
                            <Input
                                data-tid={"Input"}
                                value={this.state.value}
                                onChange={(e, value) => this.setState({ value: value })}
                            />
                        </ValidationWrapperV1>
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
