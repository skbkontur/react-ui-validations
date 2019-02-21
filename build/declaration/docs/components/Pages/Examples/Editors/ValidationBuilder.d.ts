/// <reference types="react" />
import { Nullable } from "typings/Types";
import { ValidationInfo, ValidationBehaviour } from "src/index";
export declare type ValidationResultFor<T> = Partial<{
    [Key in keyof T]: ValidationInfo;
}>;
declare type ModelValidationDelegate<TModel> = (model: TModel) => Nullable<ValidationResultFor<TModel>>;
interface IPropertyValidationBuilder<TModel> {
    buildPropertyValidation(): ModelValidationDelegate<TModel>;
}
declare class PropertyValidationBuilder<TModel, T> implements IPropertyValidationBuilder<TModel> {
    private readonly conditions;
    private readonly modelPicker;
    private readonly infoPicker;
    private readonly parentBuilder;
    constructor(modelPicker: (model: TModel) => T, infoPicker: keyof TModel, parentBuilder: ValidationBuilder<TModel>);
    required(): this;
    satisfy(condition: (value: T, model: TModel) => boolean, message: React.ReactNode, type?: ValidationBehaviour): this;
    property<T>(modelPicker: (model: TModel) => T, infoPicker?: keyof TModel, configuration?: (builder: PropertyValidationBuilder<TModel, T>) => void): PropertyValidationBuilder<TModel, T>;
    build(): ModelValidationDelegate<TModel>;
    buildPropertyValidation(): ModelValidationDelegate<TModel>;
}
declare class ValidationBuilder<TModel> {
    builders: IPropertyValidationBuilder<TModel>[];
    property<T>(modelPicker: (model: TModel) => T, infoPicker?: keyof TModel, configuration?: (builder: PropertyValidationBuilder<TModel, T>) => void): PropertyValidationBuilder<TModel, T>;
    build(): ModelValidationDelegate<TModel>;
}
export declare function validation<TModel>(): ValidationBuilder<TModel>;
export {};
