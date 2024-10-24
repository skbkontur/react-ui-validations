import * as React from "react";
import { text, ValidationInfo } from "../../src";
import ValidationContainer from "../../src/ValidationContainer";
import Gapped from "retail-ui/components/Gapped";
import ValidationWrapperV1 from "../../src/ValidationWrapperV1";
import Input from "retail-ui/components/Input";
import { Nullable } from "../../typings/Types";

interface LostfocusDynamicValidationState {
    sending: boolean;
    valueA: string;
    valueB: string;
}

export default class LostfocusDynamicValidation extends React.Component<{}, LostfocusDynamicValidationState> {
    state: LostfocusDynamicValidationState = {
        sending: false,
        valueA: "",
        valueB: "",
    };

    private counter: number = 0;

    validateA(): Nullable<ValidationInfo> {
        if (this.state.valueA.substr(0, 3) === "bad") {
            return {
                message: "incorrect times: " + ++this.counter,
                type: "lostfocus",
            };
        }
        return null;
    }

    render() {
        return (
            <ValidationContainer ref="container">
                <div style={{ padding: 30 }}>
                    <Gapped vertical>
                        <Gapped>
                            <b>A</b>
                            <ValidationWrapperV1 data-tid="InputAValidation" validationInfo={this.validateA()} renderMessage={text()}>
                                <Input
                                    data-tid={"InputA"}
                                    value={this.state.valueA}
                                    onChange={(e, value) => this.setState({ valueA: value })}
                                />
                            </ValidationWrapperV1>
                        </Gapped>
                        <Gapped>
                            <b>B</b>
                            <ValidationWrapperV1 data-tid="InputBValidation" validationInfo={null/*it is important to wrap input with ValidationWrapper*/}>
                                <Input
                                    data-tid={"InputB"}
                                    value={this.state.valueB}
                                    onChange={(e, value) => this.setState({ valueB: value })}
                                />
                            </ValidationWrapperV1>
                        </Gapped>
                    </Gapped>
                </div>
            </ValidationContainer>
        );
    }
}
