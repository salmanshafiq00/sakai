import { Component, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor, Validator, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-input-radio',
  templateUrl: './input-radio.component.html',
  styleUrls: ['./input-radio.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputRadioComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => InputRadioComponent),
      multi: true
    }
  ]
})
export class InputRadioComponent implements ControlValueAccessor, Validator {
  @Input() label: string = '';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() hidden: boolean = false;
  @Input() autofocus: boolean = false;
  @Input() name: string;
  @Input() column: boolean = false;
  @Input() variant: 'outlined' | 'filled' = 'outlined';
  @Input() optionDataSource: any[] = [];

  value: any;
  onTouched: any = () => { };
  onChangeFn: any = (_: any) => { };

  writeValue(value: any): void {
    this.value = value ;
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
    this.value = event.value;
    this.onChangeFn(this.value);
  }
  
  onBlurEvent(): void {
    this.onTouched();
  }
}
