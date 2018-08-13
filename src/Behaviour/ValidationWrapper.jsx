// @flow
import * as React from "react";
import ReactDom from "react-dom";
import PropTypes from "prop-types";
import isEqual from "lodash.isequal";
import ReactUiDetection from "../ReactUiDetection";
import smoothScrollIntoView from "./smoothScrollIntoView";

if (typeof HTMLElement === "undefined") {
    window.HTMLElement = window.Element;
}

export type Validation = {
    error: boolean,
    level: "error" | "warning",
    behaviour: "immediate" | "lostfocus" | "submit",
    message: React.Node | Promise<React.Node>,
};

export interface IValidationContextSettings {
    scroll: { horizontalOffset: number, verticalOffset: number };
}

export interface IValidationContext {
    register(wrapper: ValidationWrapper): void;

    unregister(wrapper: ValidationWrapper): void;

    instanceProcessBlur(wrapper: ValidationWrapper): void;

    onValidationUpdated(wrapper: ValidationWrapper, isValid: boolean): void;

    getSettings(): IValidationContextSettings;

    isAnyWrapperInChangingMode(): boolean;
}

export type RenderErrorMessage = (
    control: React.Element<any>,
    hasError: boolean,
    validation: ?Validation
) => React.Element<any>;

type ValidationWrapperProps = {
    children?: React.Element<*>,
    validations: Validation[],
    errorMessage: RenderErrorMessage,
};

type ValidationState = {
    id: number,
    waitingForPromise: boolean,
    visible: boolean,
    cancellation: Cancellation,
    validation: Validation,
    promise: Promise,
    message: React.ReactNode,
    ready: boolean,
};

type ValidationWrapperState = {
    validations: ValidationState[],
};

class Cancellation {
    cancelled: boolean = false;

    cancel() {
        this.cancelled = true;
    }

    isCancelled(): boolean {
        return this.cancelled;
    }
}

export default class ValidationWrapper extends React.Component<ValidationWrapperProps, ValidationWrapperState> {
    state: ValidationWrapperState = {
        validations: [],
    };
    context: {
        validationContext: IValidationContext,
    };

    static contextTypes = {
        validationContext: PropTypes.any,
    };

    static globalId = 0;

    child: ?React.Component<any, any>;
    isChanging: boolean = false;

    componentWillMount() {
        this.syncWithState(this.props);
    }

    componentDidMount() {
        if (this.context.validationContext) {
            this.context.validationContext.register(this);
        } else {
            console.error(
                "ValidationWrapper should appears as child of ValidationContext.\n" +
                    "http://tech.skbkontur.ru/react-ui-validations/#/getting-started"
            );
        }
    }

    componentWillUnmount() {
        if (this.context.validationContext) {
            this.context.validationContext.unregister(this);
        }
    }

    componentWillReceiveProps(nextProps: ValidationWrapperProps) {
        if (!isEqual(this.props.validations, nextProps.validations)) {
            this.syncWithState(nextProps);
        }
    }

    syncWithState(props: ValidationWrapperProps) {
        for (const validation of this.state.validations) {
            validation.cancellation.cancel();
        }

        this.setState({
            validations: props.validations.map(validation => {
                const cancellation = new Cancellation();
                const id = ++ValidationWrapper.globalId;
                return {
                    id: id,
                    validation: validation,
                    visible: false,
                    message: null,
                    ready: false,
                    cancellation: cancellation,
                    waitingForPromise: false,
                    promise: this.createPromise(id, validation, cancellation),
                };
            }),
        });
    }

    createPromise(id: number, validation: Validation, cancellation: Cancellation): Promise<void> {
        return Promise.resolve(validation.message).then(message => {
            if (cancellation.isCancelled()) {
                return;
            }
            this.setState(
                state => {
                    const validationWasVisible = state.validations.some(x => x.visible);
                    return {
                        validations: state.validations.map(x => {
                            return x.id !== id
                                ? x
                                : {
                                      ...x,
                                      message: message,
                                      ready: true,
                                      visible: this.isVisible(
                                          x.validation.behaviour,
                                          x.waitingForPromise,
                                          validationWasVisible
                                      ),
                                  };
                        }),
                    };
                },
                () => this.fireValidationUpdated()
            );
        });
    }

    isVisible(
        behaviour: "immediate" | "lostfocus" | "submit",
        waitingForPromise: boolean,
        validationWasVisible: boolean
    ): boolean {
        switch (behaviour) {
            case "immediate":
                return true;
            case "lostfocus": {
                const nothingChanging = !this.context.validationContext.isAnyWrapperInChangingMode();
                return !this.isChanging && (waitingForPromise || validationWasVisible || nothingChanging);
            }
            case "submit":
                return false;
            default:
                throw new Error(`Unknown behaviour: ${behaviour}`);
        }
    }

    emulateBlur() {
        this.processBlur();
    }

    handleBlur() {
        this.processBlur();
        this.context.validationContext.instanceProcessBlur(this);
        this.setState({});
    }

    async processSubmit(): Promise<void> {
        this.isChanging = false;
        await Promise.all(this.state.validations.map(x => x.promise));
        await new Promise(resolve => {
            this.setState(
                state => ({ validations: state.validations.map(x => ({ ...x, visible: true })) }),
                () => resolve()
            );
        });
    }

    processBlur() {
        this.isChanging = false;

        this.setState(
            state => ({
                validations: state.validations.map(x => {
                    if (x.validation.behaviour === "lostfocus") {
                        if (x.ready) {
                            return { ...x, visible: x.validation.error };
                        }
                        return { ...x, waitingForPromise: x.validation.error };
                    }
                    return x;
                }),
            }),
            () => this.fireValidationUpdated
        );
    }

    fireValidationUpdated() {
        const isValid = !this.state.validations.some(x => x.visible);
        this.context.validationContext.onValidationUpdated(this, isValid);
    }

    async focus(): Promise<void> {
        if (this.child) {
            const childDomElement = ReactDom.findDOMNode(this.child);
            if (childDomElement != null && childDomElement instanceof HTMLElement) {
                await smoothScrollIntoView(
                    childDomElement,
                    this.context.validationContext.getSettings().scroll.verticalOffset || 50
                );
                if (this.child != null && typeof this.child.focus === "function") {
                    this.child.focus();
                }
            }
            this.isChanging = false;
        }
    }

    getControlPosition(): ?{ x: number, y: number } {
        if (this.child) {
            const childDomElement = ReactDom.findDOMNode(this.child);
            if (childDomElement != null && childDomElement instanceof HTMLElement) {
                return {
                    x: childDomElement.getBoundingClientRect().top,
                    y: childDomElement.getBoundingClientRect().left,
                };
            }
        }
        return null;
    }

    isErrorOrWarning(validationState: ValidationState): boolean {
        return Boolean(validationState.validation.error && validationState.visible);
    }

    isError(validationState: ValidationState): boolean {
        const validation = validationState.validation;
        return Boolean(validation.error && validation.level === "error" && validationState.visible);
    }

    hasError(): boolean {
        return this.state.validations.some(x => this.isError(x));
    }

    render(): React.Node {
        const { children } = this.props;
        const validationState = this.state.validations.find(x => this.isErrorOrWarning(x));
        const validation = validationState
            ? {
                  ...validationState.validation,
                  message: validationState.message,
              }
            : null;
        const clonedChild: React.Element<any> = children ? (
            React.cloneElement(children, {
                ref: x => {
                    if (children && children.ref) {
                        children.ref(x);
                    }
                    this.child = x;
                },
                error: this.isChanging
                    ? false
                    : Boolean(validation && validation.error && validation.level === "error"),
                warning: this.isChanging
                    ? false
                    : Boolean(validation && validation.error && validation.level === "warning"),
                onBlur: () => {
                    this.handleBlur();
                    if (children && children.props && children.props.onBlur) {
                        children.props.onBlur();
                    }
                },
                onInput: (...args) => {
                    if (ReactUiDetection.isDatePicker(children)) {
                        this.isChanging = true;
                        this.setState({});
                    }
                    if (children && children.props && children.props.onInput) {
                        children.props.onInput(...args);
                    }
                },
                onChange: (...args) => {
                    if (ReactUiDetection.isDatePicker(children)) {
                        const nextValue = args[1];
                        if (
                            nextValue !== children.props.value &&
                            !(nextValue == null && children.props.value == null)
                        ) {
                            this.isChanging = true;
                            this.handleBlur();
                        }
                    } else {
                        this.isChanging = true;
                    }
                    if (children && children.props && children.props.onChange) {
                        children.props.onChange(...args);
                    }
                },
            })
        ) : (
            <span />
        );
        const hasError = Boolean(validation && validation.error);
        return this.props.errorMessage(clonedChild, hasError, validation);
    }
}
