import * as React from "react";
import { storiesOf } from "@storybook/react";
import SingleInputPage from "./AsyncStories/SingleInputPage";
import LostfocusDependentValidation from "./SyncStories/LostfocusDependentValidation";
import LostfocusDynamicValidation from "./SyncStories/LostfocusDynamicValidation";
import DependentFields from "./AsyncStories/DependentFields";

//https://github.com/skbkontur/react-ui-validations/commit/32ef8f4888aa283777c289b1d53f051e8596fa61

storiesOf("Async", module)
    .add("XXxxxxx", () => <DependentFields/>)
    .add("ImmediateValidation", () => <SingleInputPage validationType={"immediate"}/>)
    .add("SubmitValidation", () => <SingleInputPage validationType={"submit"}/>)
    .add("LostfocusValidation", () => <SingleInputPage validationType={"lostfocus"}/>)
    .add("LostfocusDependentValidation", () => <LostfocusDependentValidation/>)
    .add("LostfocusDynamicValidation", () => <LostfocusDynamicValidation/>)
    .add("PreinvalidImmediateValidation", () => <SingleInputPage validationType={"immediate"} initialValue={"bad"}/>)
    .add("PreinvalidLostfocusValidation", () => <SingleInputPage validationType={"lostfocus"} initialValue={"bad"}/>)
    .add("PreinvalidSubmitValidation", () => <SingleInputPage validationType={"submit"} initialValue={"bad"}/>);
