import { Component, h, Prop, ComponentInterface, Host, Watch, Event, EventEmitter, State, Element, Method } from '@stencil/core';
import utils from '../../utils/componentUtils';

export interface IFormFieldData {
    isValid: boolean;
    name: string;
    validity: ValidityState;
    value: string | number | boolean | any[];
}

@Component({
    tag: 'ks-form-field',
    styleUrl: 'form-field.scss'
})
export class FormField implements ComponentInterface {
    formFieldId = formFieldIds++;
    $input: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    $checkbox: HTMLKsCheckboxElement;
    $checklist: HTMLKsChecklistElement;

    @Element() $el: HTMLElement;

    @Prop() label: string;
    @Prop() helpText: string;
    @Prop() tooltipText: string;
    @Prop() placeholder: string;
    @Prop() name: string;
    @Prop() required: boolean;
    @Prop() requiredText: string = 'Required';
    @Prop({ mutable: true }) invalid: boolean = false;
    @Prop() disabled: boolean;
    @Prop({ mutable: true }) value?: string | number | any[] | null = '';
    @Prop() pattern?: string;
    @Prop() min?: number;
    @Prop() max?: number;
    @Prop() step?: number;
    @Prop() minlength?: number;
    @Prop() maxlength?: number;
    @Prop() autocomplete?: string;
    @Prop() type: 'checkbox'
        | 'checklist'
        | 'color'
        | 'date'
        | 'email'
        | 'file'
        | 'hidden'
        | 'month'
        | 'number'
        | 'password'
        | 'radiolist'
        | 'range'
        | 'search'
        | 'select'
        | 'tel'
        | 'text'
        | 'textarea'
        | 'url' = 'text';
    @Prop() defaultErrorMessage: string = 'The value entered is not valid.';
    @Prop() badInputErrorMessage: string = 'There was a problem processing the value.';
    @Prop() patternErrorMessage: string = 'There was a problem processing the value.';
    @Prop() maxErrorMessage: string = `Your value must be no greater than ${this.max}.`;
    @Prop() minErrorMessage: string = `Your value must be no less than ${this.min}.`;
    @Prop() stepErrorMessage: string = `Your value must be divisible by ${this.step}.`;
    @Prop() maxlengthErrorMessage: string = `Your value must be no more than ${this.maxlength} characters.`;
    @Prop() minlengthErrorMessage: string = `Your value must be at least ${this.minlength} characters.`;
    @Prop() typeErrorMessage: string = `Your value must be a valid ${this.type === 'tel' ? 'telephone number' : this.type}.`;
    @Prop() requiredErrorMessage: string = `This field is required.`;
    @Prop({ mutable: true }) validateOnInput: boolean = false;
    @Prop() debounce: number = 0;
    @Prop() datalist: boolean = false;
    @Prop() checked: boolean = false;

    @Event() updated!: EventEmitter<IFormFieldData>;
    @Event() blurred!: EventEmitter;

    @State() validityState: ValidityState;

    @Method()
    async validate() {
        if (!this.$checkbox && !this.$checklist) {
            this.invalid = !this.$input.checkValidity();
            this.validateOnInput = true;
        }

        return this.validateField();
    }

    @Watch('value')
    protected async valueChanged() {
        if (this.$input && this.$input.value !== this.value) {
            this.$input.value = this.value.toString();
        }

        if (this.validateOnInput)
            this.invalid = !this.$input.checkValidity();

        let detail = await this.validateField();

        this.updated.emit(detail);
    }

    handleComponentChange(e) {
        let checkboxData: IFormFieldData = e.detail;
        this.invalid = !checkboxData.isValid;
        this.validityState = checkboxData.validity
        this.updated.emit(checkboxData);
    }

    componentDidLoad() {
        if (this.type !== 'select' || this.datalist) {
            const $options = Array.from(this.$el.querySelectorAll('option')) as HTMLElement[];
            $options.forEach(x => x.hidden = true);
        }
    }

    private async validateField(): Promise<IFormFieldData> {
        switch (true) {
            case this.$checkbox !== undefined:
                let checkboxFieldData = await this.$checkbox.validate();
                this.invalid = !checkboxFieldData.isValid;
                this.validityState = checkboxFieldData.validity;
                return checkboxFieldData;
            case this.$checklist !== undefined:
                let checklistData = await this.$checklist.validate();
                this.invalid = !checklistData.isValid;
                this.validityState = checklistData.validity;
                return checklistData;
            default:
                this.validityState = this.$input.validity;
                return {
                    isValid: this.$input.checkValidity(),
                    name: this.$input.name,
                    validity: this.validityState,
                    value: this.value == null ? this.value : this.value.toString()
                };
        }
    }

    private getValue(): string {
        return typeof this.value === 'number' ? this.value.toString() :
            (this.value || '').toString();
    }

    private getErrorMessage(): string {
        switch (true) {
            case !this.validityState:
                return this.defaultErrorMessage;
            case this.validityState?.badInput:
                return this.badInputErrorMessage;
            case this.validityState?.patternMismatch:
                return this.patternErrorMessage;
            case this.validityState?.rangeOverflow:
                return this.maxErrorMessage;
            case this.validityState?.rangeUnderflow:
                return this.minErrorMessage;
            case this.validityState?.stepMismatch:
                return this.stepErrorMessage;
            case this.validityState?.tooLong:
                return this.maxlengthErrorMessage;
            case this.validityState?.tooShort:
                return this.minlengthErrorMessage;
            case this.validityState?.typeMismatch:
                return this.typeErrorMessage;
            case this.validityState?.valueMissing:
                return this.requiredErrorMessage;
            default:
                return this.defaultErrorMessage;
        }
    }

    private getInputName() {
        return this.name || this.label ? this.label.toLowerCase().replace(/ /g, '-') : '';
    }

    private onInput(ev: Event) {
        utils.debounce(() => {
            const input = ev.target as HTMLInputElement | null;

            if (input)
                this.value = input.value || '';

        }, this.debounce);
    }

    private onBlur() {
        if (!this.validateOnInput) {
            this.invalid = !this.$input.checkValidity();

            if (this.invalid)
                this.validateOnInput = true;
        }

        this.blurred.emit();
    }

    private setProps(props: any) {
        this.placeholder && (props.placeholder = this.placeholder);
        this.autocomplete && (props.autocomplete = this.autocomplete);
        this.minlength && (props.minlength = this.minlength);
        this.maxlength && (props.maxlength = this.maxlength);
        this.pattern && (props.pattern = this.pattern);
        this.min && (props.min = this.min);
        this.max && (props.max = this.max);
        this.step && (props.step = this.step);

        return props;
    }

    render() {
        let fieldId = `form-input-${this.formFieldId}`;
        let labelId = `form-label-${this.formFieldId}`;
        let listId = `form-list-${this.formFieldId}`;
        let value = this.getValue();
        let props = {
            'disabled': this.disabled,
            'required': this.required,
            'aria-invalid': !this.disabled && this.invalid.toString(),
            'list': this.datalist && listId
        };
        props = this.setProps(props);
        let classes = {
            'form-field': true,
            'invalid': this.invalid && !this.disabled
        };
        let labelClasses = {
            'form-label': true
        };
        let fieldInput = {
            'textarea': (
                <textarea
                    id={fieldId}
                    class="form-input"
                    name={this.getInputName()}
                    {...props}
                    onInput={(e) => this.onInput(e)}
                    onBlur={() => this.onBlur()}
                    ref={el => this.$input = el}
                >
                    {value}
                </textarea>
            ),
            'select': (
                <select
                    id={fieldId}
                    class="form-input"
                    name={this.getInputName()}
                    {...props}
                    onInput={(e) => this.onInput(e)}
                    onBlur={() => this.onBlur()}
                    ref={el => this.$input = el}
                >
                    <slot />
                </select>
            )
        }[this.type] || (
                <div>
                    <input
                        id={fieldId}
                        class="form-input"
                        type={this.type}
                        name={this.getInputName()}
                        {...props}
                        value={value}
                        onInput={(e) => this.onInput(e)}
                        onBlur={() => this.onBlur()}
                        ref={el => this.$input = el}
                    />
                    {this.datalist && <datalist id={listId}>
                        <slot />
                    </datalist>}
                </div>
            );

        return (
            <Host class={classes}>
                {
                    {
                        'checkbox': (
                            <div>
                                <div class="error-message text-danger" role="alert" aria-live="assertive">
                                    {(this.invalid && !this.disabled) && <div class="error-text">
                                        <ks-icon icon="danger" class="mr-xs" />
                                        <span>{this.getErrorMessage()}</span>
                                    </div>}
                                </div>
                                <ks-checkbox
                                    label={this.label}
                                    checked={this.checked}
                                    tooltip-text={this.tooltipText}
                                    required={this.required}
                                    required-text={this.requiredText}
                                    name={this.getInputName()}
                                    onChanged={e => this.handleComponentChange(e)}
                                    ref={el => this.$checkbox = el}
                                />
                            </div>
                        ),
                        'checklist': (
                            <ks-checklist
                                label={this.label}
                                tooltip-text={this.tooltipText}
                                required={this.required}
                                required-text={this.requiredText}
                                required-error-message={this.requiredErrorMessage}
                                type="checkbox"
                                name={this.getInputName()}
                                help-text={this.helpText}
                                invalid={this.invalid}
                                disabled={this.disabled}
                                ref={el => this.$checklist = el}
                                onChecked={e => this.handleComponentChange(e)}
                            >
                                <slot />
                            </ks-checklist>
                        ),
                        'radiolist': (
                            <ks-checklist
                                label={this.label}
                                tooltip-text={this.tooltipText}
                                required={this.required}
                                required-text={this.requiredText}
                                required-error-message={this.requiredErrorMessage}
                                type="radio"
                                name={this.getInputName()}
                                help-text={this.helpText}
                                invalid={this.invalid}
                                disabled={this.disabled}
                                ref={el => this.$checklist = el}
                                onChecked={e => this.handleComponentChange(e)}
                            >
                                <slot />
                            </ks-checklist>
                        )
                    }[this.type] || (
                        [
                            <label id={labelId} class={labelClasses} htmlFor={fieldId}>
                                <span class="field-label">
                                    {this.label}
                                    {this.required && <abbr class="text-danger text-decoration-none" title={this.requiredText} aria-label={this.requiredText}>*</abbr>}
                                    {(this.tooltipText && this.tooltipText !== '') && <ks-tooltip position="right" size="md" text={this.tooltipText} hide-decoration><ks-icon icon="info" class="text-info text-xs" /></ks-tooltip>}
                                </span>
                                <span class="help-text">{this.helpText}</span>
                                <span class="error-message text-danger" role="alert" aria-live="assertive">
                                    {(this.invalid && !this.disabled) && <span class="error-text">
                                        <ks-icon icon="danger" class="mr-xs" />
                                        <span>{this.getErrorMessage()}</span>
                                    </span>}
                                </span>
                            </label>,
                            (fieldInput)
                        ]
                    )
                }
            </Host>
        );
    }
}

let formFieldIds = 0;