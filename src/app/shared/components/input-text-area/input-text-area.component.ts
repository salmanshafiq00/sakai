import { Component, Input } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';

@Component({
  selector: 'app-input-text-area',
  templateUrl: './input-text-area.component.html',
  styleUrl: './input-text-area.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting:  InputTextAreaComponent,
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting:  InputTextAreaComponent,
      multi: true
    }
  ]
})
export class InputTextAreaComponent implements ControlValueAccessor, Validator {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() hidden: boolean = false;
  @Input() variant: string = 'outlined';
  @Input() autofocus: boolean = false;
  @Input() rows: number = 3;
  @Input() cols: number = 30;
  @Input() autoResize: boolean = true;
  @Input() max: number;
  @Input() showCharLength: boolean = false;

  value: string = '';
  onTouched: any = () => {};
  onChangeFn: any = (_: any) => {};

  writeValue(value: any): void {
    this.value = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  validate(control: AbstractControl): ValidationErrors | null {
    if (this.required && !control.value) {
      return { required: true };
    }
    return null;
  }

  onInputChange(event: any): void {
    const value = event.target.value;
    this.value = value;
    this.onChangeFn(value);
  }

  onBlurEvent(): void {
    this.onTouched();
  }


}
