import * as React from "react";
import Helmet from "react-helmet";
import styled from "styled-components";
import Input from "retail-ui/components/Input";
import Button from "retail-ui/components/Button";
import RadioGroup from "retail-ui/components/RadioGroup";
import ComboBoxOld from "retail-ui/components/ComboBoxOld";
import Select from "retail-ui/components/Select";
import DatePicker from "retail-ui/components/DatePicker";
import Textarea from "retail-ui/components/Textarea";
import Checkbox from "retail-ui/components/Checkbox";
import Link from "retail-ui/components/Link";
import { ValidationContainer, ValidationWrapperV1, text } from "src/index";
import { Nullable } from "typings/Types";
import { validation, ValidationResultFor } from "./ValidationBuilder";
import Demo from "docs/components/Demo";
import Form from "docs/components/Form";

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

const FormEditor: React.FunctionComponent<FormEditorProps> = ({ data, validation, onChange }) => {
    const validationInfoValue = validation || {};
    return (
        <Form>
            <Form.Line title="Имя">
                <ValidationWrapperV1 renderMessage={text()} validationInfo={validationInfoValue.name}>
                    <Input value={data.name} onChange={(e, value) => onChange({ name: value })}/>
                </ValidationWrapperV1>
            </Form.Line>
            <Form.Line title="Email">
                <ValidationWrapperV1 validationInfo={validationInfoValue.email}>
                    <Input value={data.email} onChange={(e, value) => onChange({ email: value })}/>
                </ValidationWrapperV1>
            </Form.Line>
            <Form.Line title="Телефон">
                <ValidationWrapperV1 validationInfo={validationInfoValue.phone}>
                    <Input value={data.phone} onChange={(e, value) => onChange({ phone: value })}/>
                </ValidationWrapperV1>
            </Form.Line>
            <Form.Line title="Пол">
                <ValidationWrapperV1 validationInfo={validationInfoValue.sex}>
                    <RadioGroup
                        value={data.sex}
                        items={["male", "female"]}
                        renderItem={x => <span>{x}</span>}
                        onChange={(e, value) => onChange({ sex: value })}
                    />
                </ValidationWrapperV1>
            </Form.Line>
            <Form.Line title="Город">
                <ValidationWrapperV1 validationInfo={validationInfoValue.city}>
                    <ComboBoxOld
                        valueToString={x => x}
                        renderValue={x => x}
                        renderItem={x => x}
                        info={async (x : any) => x}
                        value={data.city}
                        source={async query => {
                            const cities = ["City 1", "City 2", "City 3"];
                            const result = !query ? cities : cities.filter(x => x.includes(query));
                            return {
                                values: result,
                                infos: result,
                            };
                        }}
                        onChange={(e, value) => onChange({ city: value })}
                    />
                </ValidationWrapperV1>
            </Form.Line>
            <Form.Line title="Вероисповедание">
                <ValidationWrapperV1 validationInfo={validationInfoValue.confession}>
                    <Select
                        renderItem={x => x}
                        renderValue={x => x}
                        items={[
                            ["Православие", "Православие"],
                            ["Католичество", "Католичество"],
                            ["Мормонизм", "Мормонизм"],
                        ]}
                        value={data.confession}
                        onChange={(e, value) => onChange({ confession: value })}
                    />
                </ValidationWrapperV1>
            </Form.Line>
            <Form.Line title="Согласен">
                <ValidationWrapperV1 validationInfo={validationInfoValue.confirmed}>
                    <Checkbox checked={data.confirmed} onChange={(e, value) => onChange({ confirmed: value })}/>
                </ValidationWrapperV1>
            </Form.Line>

            <Form.Line title="О себе">
                <ValidationWrapperV1 validationInfo={validationInfoValue.about}>
                    <Textarea
                        placeholder="Введите текст"
                        value={data.about}
                        onChange={(e, value) => onChange({ about: value })}
                    />
                </ValidationWrapperV1>
            </Form.Line>

            <Form.Line title="Дата рождения">
                <ValidationWrapperV1 validationInfo={validationInfoValue.born}>
                    <DatePicker value={data.born} onChange={(e, value) => onChange({ born: value })}/>
                </ValidationWrapperV1>
            </Form.Line>
            <Form.Line title="Сcылка">
                <ValidationWrapperV1 validationInfo={validationInfoValue.modalOpened}>
                    <LinkContainer>
                        <Link
                            icon={data.modalOpened ? "ThumbUp" : "ThumbDown"}
                            onClick={() => onChange({ modalOpened: true })}>
                            Нажми меня
                        </Link>
                    </LinkContainer>
                </ValidationWrapperV1>
            </Form.Line>
        </Form>
    );
};

interface LinkContainerProps {
    error?: boolean;
}

const LinkContainer = styled.span<LinkContainerProps>`
    background-color: ${props => (props.error ? "#FDE8E8" : "transparent")}
    padding: 1px 5px;
    margin: -1px -5px;
`;

const validate = validation<ContactInfo>()
    .property(x => x.name)
    .required()
    .satisfy(x => x.split(" ").length === 2, "Имя должно состоять из двух слов")
    .property(x => x.email)
    .required()
    .satisfy(x => x.includes("@"), "Почта указана неверно")
    .property(x => x.phone)
    .required()
    .satisfy(
        phone => phone !== "" && /^[\s\d\-\+\(\)]*$/.test(phone),
        "Телефон должен состоять только из цифр, пробелов и знаков -,+,(,)",
    )
    .property(x => x.sex)
    .required()
    .property(x => x.city)
    .required()
    .property(x => x.confession)
    .required()
    .property(x => x.confirmed)
    .satisfy(x => x, "Надо соглашаться", "submit")
    .property(x => x.modalOpened)
    .satisfy(x => x, "Надо соглашаться", "submit")
    .property(x => x.about)
    .required()
    .property(x => x.born)
    .satisfy(x => !!x, "Заполни", "submit")
    .build();

interface EditorsState {
    data: ContactInfo;
}

export default class Editors extends React.Component<{}, EditorsState> {
    state: EditorsState = {
        data: {
            name: "",
            email: "",
            phone: "",
            sex: null,
            city: null,
            confession: null,
            confirmed: false,
            about: "",
            born: "",
            modalOpened: false,
        },
    };

    handleSubmit() {
        (this.refs.container as ValidationContainer).submit();
    }

    render() {
        return (
            <div>
                <Helmet title="Редакторы"/>
                <h1>Редакторы</h1>
                <Demo>
                    <ValidationContainer ref="container">
                        <FormEditor
                            data={this.state.data}
                            validation={validate(this.state.data)}
                            onChange={update => this.setState({ data: { ...this.state.data, ...update } })}
                        />
                        <Form.ActionsBar>
                            <Button use="primary" onClick={() => this.handleSubmit()}>
                                Сохранить
                            </Button>
                        </Form.ActionsBar>
                    </ValidationContainer>
                </Demo>
            </div>
        );
    }
}
