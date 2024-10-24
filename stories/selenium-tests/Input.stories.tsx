import * as React from "react";
import { storiesOf } from "@storybook/react";
import Input from "retail-ui/components/Input";
import { Nullable } from "../../typings/Types";
import { ValidationContainer, ValidationWrapperV1, text, ValidationInfo } from "../../src";

interface Example1State {
    value: string;
}

class Example1 extends React.Component<{}, Example1State> {
    state: Example1State = {
        value: "",
    };

    validateValue1(): Nullable<ValidationInfo> {
        const { value } = this.state;
        if (value === "") {
            return { message: "Должно быть не пусто", type: "submit" };
        }
        if (value.split(" ").length !== 2) {
            return { message: "Значение должно состоять из двух слов", type: "lostfocus" };
        }
        return null;
    }

    render() {
        return (
            <ValidationContainer>
                <div style={{ padding: 10 }}>
                    <div
                        data-tid="ClickArea"
                        style={{ textAlign: "center", marginBottom: 10, padding: 10, border: "1px solid #ddd" }}>
                        Click here
                    </div>
                    <ValidationWrapperV1
                        data-tid="ValidationWrapper"
                        validationInfo={this.validateValue1()}
                        renderMessage={text("bottom")}>
                        <Input
                            data-tid="SingleInput"
                            value={this.state.value}
                            onChange={(e, value) => this.setState({ value })}
                        />
                    </ValidationWrapperV1>
                </div>
            </ValidationContainer>
        );
    }
}

storiesOf("SingleInput", module).add("Example1", () => {
    return <Example1/>;
});
