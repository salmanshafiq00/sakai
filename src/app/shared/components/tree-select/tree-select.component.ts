import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, ValidationErrors, AbstractControl } from '@angular/forms';
import { TreeNode } from 'primeng/api';

@Component({
  selector: 'app-tree-select',
  templateUrl: './tree-select.component.html',
  styleUrls: ['./tree-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TreeSelectComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => TreeSelectComponent),
      multi: true
    }
  ]
})
export class TreeSelectComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() hidden: boolean = false;
  @Input() placeholder: string = 'Select One';
  @Input() autofocus: boolean = false;
  @Input() variant: 'outlined' | 'filled' = 'outlined';
  @Input() optionDataSource: TreeNode[] = [];
  @Input() inputId: string = '';
  @Input() scrollHeight: string = '400px';
  @Input() metaKeySelection: boolean = false;
  @Input() display: 'comma' | 'chip' = 'comma';
  @Input() selectionMode: 'single' | 'multiple' | 'checkbox' = 'single';
  @Input() tabindex: string = '0';
  @Input() panelClass: string | string[] | Set<string> | Object = '';
  @Input() panelStyle: Object = {};
  @Input() panelStyleClass: string = '';
  @Input() containerStyle: Object = {};
  @Input() containerStyleClass: string = '';
  @Input() labelStyle: Object = {};
  @Input() labelStyleClass: string = '';
  @Input() overlayOptions: any = null;
  @Input() emptyMessage: string = '';
  @Input() appendTo: any = null;
  @Input() filter: boolean = true;
  @Input() filterBy: string = 'label';
  @Input() filterMode: string = 'lenient';
  @Input() filterPlaceholder: string = '';;
  @Input() filterInputAutoFocus: boolean = true;
  @Input() propagateSelectionDown: boolean = true;
  @Input() propagateSelectionUp: boolean = true;
  @Input() showClear: boolean = true;
  @Input() resetFilterOnHide: boolean = true;
  @Input() virtualScroll: boolean = false;
  @Input() virtualScrollItemSize: number = null;
  @Input() virtualScrollOptions: any = null;
  @Input() showTransitionOptions: string = '';
  @Input() hideTransitionOptions: string = '';
  @Input() loading: boolean = false;

  value: any = null;
  onTouched: any = () => { };
  onChangeFn: any = (_: any) => { };

  writeValue(value: any): void {
    this.value = value;
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
    return this.required && (!this.value || this.value.length === 0) ? { required: true } : null;
  }

  onFocus(event: any): void {
    this.onTouched();
  }

  onBlur(event: any): void {
    this.onTouched();
  }

  onNodeUnselect(event: any): void {
    console.log(event)
  }

  onNodeSelect(event: any): void {
    console.log(event)
  }
}
