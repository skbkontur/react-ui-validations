import React from "react";
import { storiesOf } from "@kadira/storybook";
import Input from "retail-ui/components/Input";
import Button from "retail-ui/components/Button";
import Gapped from "retail-ui/components/Gapped";
import { ValidationContainer, ValidationWrapperV1, ValidationNotChanged, text } from "../src";

const delay = timeout => {
    return new Promise(resolve => {
        setTimeout(() => resolve(), timeout);
    });
};

const getValueAfter = async (value, timeout) => {
    await delay(timeout);
    return value;
};

class Example extends React.Component {
    state = {
        sending: false,
        value1: "",
        value2: "",
    };

    componentWillUpdate() {
        this.prevState = this.state;
    }

    validateValue1() {
        const { value1 } = this.state;
        if (value1 === "") {
            return { message: <span>Должно быть не пусто</span>, type: "submit" };
        }
        if (value1 === this.prevState.value1) {
            return ValidationNotChanged;
        }
        return {
            message: getValueAfter(/\d/.exec(value1) ? <span>Цифры запрещены</span> : null, 3000),
            type: "lostfocus",
        };
    }

    validateValue2() {
        const { value2 } = this.state;
        if (value2 === "") {
            return { message: "Должно быть не пусто", type: "submit" };
        }
        if (value2.split(" ").length !== 2) {
            return { message: "Значение должно состоять из двух слов.", type: "lostfocus" };
        }
        return null;
    }

    render() {
        return (
            <ValidationContainer ref="container">
                <div style={{ padding: 30 }}>
                    <Gapped vertical>
                        <ValidationWrapperV1 validationInfo={this.validateValue1()} renderMessage={text("right")}>
                            <Input
                                value={this.state.value1}
                                onChange={(e, value) => this.setState({ value1: value })}
                            />
                        </ValidationWrapperV1>
                        <ValidationWrapperV1 validationInfo={this.validateValue2()} renderMessage={text("right")}>
                            <Input
                                value={this.state.value2}
                                onChange={(e, value) => this.setState({ value2: value })}
                            />
                        </ValidationWrapperV1>
                        <Button loading={this.state.sending} onClick={this.handleSubmit}>
                            Отправить
                        </Button>
                    </Gapped>
                </div>
            </ValidationContainer>
        );
    }

    handleSubmit = () => {
        this.setState({ sending: true }, async () => {
            await this.refs.container.validate();
            this.setState({ sending: false });
        });
    };
}

storiesOf("Async", module).add("Example", () => <Example/>);

/*
type ValidationResult = any;

function submit(model: ZZZ): Promise<ValidationResult> {

}

function validate1(model: ZZZ): Promise<ValidationResult> {

}

function validate2(partOfModel: string): Promise<string | null> {
}

function validate3_PartOfModel(model: ZZZ): Promise<string | null> {

}
*/
///////

// 2. У валиданция посявялеться доп. состояние -- inProcess?
//     - кто упарвлет
//     - кастомное рисонивае сего состояния
//     - проверенно ли текущее значени? ()

//////
