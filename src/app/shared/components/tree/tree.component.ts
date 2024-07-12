import { Component, EventEmitter, Input, Output, forwardRef, OnChanges, SimpleChanges } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { TreeNode } from 'primeng/api';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TreeComponent),
    multi: true
  }]
})
export class TreeComponent implements ControlValueAccessor, OnChanges {
  @Input() label: string = '';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() hidden: boolean = false;
  @Input() autofocus: boolean = false;
  @Input() inputId: string = 'integeronly';
  @Input() optionDataSource: TreeNode[] = [];
  @Input() selectionMode: 'single' | 'multiple' | 'checkbox' = 'checkbox';
  @Input() loadingMode: 'mask' | 'icon' = 'mask';
  @Input() selection: TreeNode[] | null = null;
  @Input() style: any = null;
  @Input() styleClass: string | null = null;
  @Input() contextMenu: any = null;
  @Input() layout: 'vertical' | 'horizontal' = 'vertical';
  @Input() metaKeySelection: boolean = false;
  @Input() propagateSelectionUp: boolean = true;
  @Input() propagateSelectionDown: boolean = true;
  @Input() loading: boolean = false;
  @Input() loadingIcon: string | null = null;
  @Input() emptyMessage: string | null = null;
  @Input() ariaLabel: string | null = null;
  @Input() togglerAriaLabel: string | null = null;
  @Input() ariaLabelledBy: string | null = null;
  @Input() validateDrop: boolean = false;
  @Input() filter: boolean = false;
  @Input() filterBy: string = 'label';
  @Input() filterMode: 'lenient' | 'strict' = 'lenient';
  @Input() filterPlaceholder: string | null = null;
  @Input() filteredNodes: TreeNode[] | null = null;
  @Input() filterLocale: string | null = null;
  @Input() scrollHeight: string | null = null;
  @Input() lazy: boolean = false;
  @Input() virtualScroll: boolean = false;
  @Input() virtualScrollItemSize: number | null = null;
  @Input() virtualScrollOptions: any = null;
  @Input() indentation: number = 1.5;
  @Input() templateMap: any = null;
  @Input() trackBy: (index: number, item: TreeNode) => any = (index, item) => item;
  @Input() getset: 'key' | 'object' = 'key'; // New input for custom property handling

  @Output() selectionChange = new EventEmitter<TreeNode>();
  @Output() onNodeSelect = new EventEmitter<any>();
  @Output() onNodeUnselect = new EventEmitter<any>();
  @Output() onNodeExpand = new EventEmitter<any>();
  @Output() onNodeCollapse = new EventEmitter<any>();
  @Output() onNodeContextMenuSelect = new EventEmitter<any>();
  @Output() onLazyLoad = new EventEmitter<any>();
  @Output() onScroll = new EventEmitter<any>();
  @Output() onScrollIndexChange = new EventEmitter<any>();
  @Output() onFilter = new EventEmitter<any>();

  private onChange: any = () => {};
  private onTouched: any = () => {};

  private newValue: any[] = [];
  private oldValue: any;

  writeValue(value: any): void {
    this.oldValue = value;
    this.updateSelection();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.['optionDataSource']) {
      this.updateSelection();
    }
  }

  private updateSelection(): void {
    if (this.getset === 'key') {
      // this.selection = this.optionDataSource?.filter(node => this.newValue?.includes(node.key)) ?? [];
      this.selectNodes(this.optionDataSource, this.oldValue);
      this.updateParentSelection(this.optionDataSource, this.newValue);
      this.selection = this.newValue;
    } else {
      this.selectNodes(this.optionDataSource, this.oldValue);
      this.updateParentSelection(this.optionDataSource, this.newValue);
      this.selection = this.newValue;
      console.log(this.selection)
    }
    this.onChange(this.selection);
  }

  onSelectionChange(event: any): void {
    console.log(event)
    this.newValue = [];
    if (this.getset === 'key') {
      this.onChange(event?.filter((node: TreeNode) => node.leaf)?.map((node: TreeNode) => node.key) ?? []);
    } else {
      console.log(event)
      this.onChange(event);
    }
    this.selectionChange.emit(event);
  }

  scrollToVirtualIndex(index: number) {
    // Implement scroll to virtual index
  }

  scrollTo(options: any) {
    // Implement scroll to options
  }

  resetFilter() {
    // Implement reset filter
  }

  private selectNodes(nodes: TreeNode[], selectedKeys: string[]) {
    nodes?.forEach(node => {
      if (selectedKeys.includes(node.key!)) {  // Ensure label is not undefined
        this.newValue.push(node);
      }
      if (node.children) {
        this.selectNodes(node.children, selectedKeys);
      }
    });
  }

  private selectNodesByLabel(nodes: TreeNode[], selectedLabels: string[]) {
    nodes?.forEach(node => {
      if (selectedLabels.includes(node.label!)) {  // Ensure label is not undefined
        this.newValue.push(node);
      }
      if (node.children) {
        this.selectNodesByLabel(node.children, selectedLabels);
      }
    });
  }

  private updateParentSelection(nodes: TreeNode[], selectedNodes: TreeNode[]) {
    nodes?.forEach(node => {
      if (node.children && node.children.length > 0) {
        this.updateParentSelection(node.children, selectedNodes);  // Recursively update child nodes
        const totalChildren = node.children.length;
        const selectedChildren = node.children.filter(child => selectedNodes.includes(child)).length;
        if (selectedChildren === totalChildren) {
          // All children are selected, mark parent as selected
          if (!selectedNodes.includes(node)) {
            selectedNodes.push(node);
          }
          node.partialSelected = false;
        } else if (selectedChildren > 0) {
          // Some children are selected, mark parent as partially selected
          node.partialSelected = true;
          // Ensure parent is not fully selected if partially selected
          const parentIndex = selectedNodes.indexOf(node);
          if (parentIndex !== -1) {
            selectedNodes.splice(parentIndex, 1);
          }
        } else {
          // No children are selected, ensure parent is not selected
          node.partialSelected = false;
          const parentIndex = selectedNodes.indexOf(node);
          if (parentIndex !== -1) {
            selectedNodes.splice(parentIndex, 1);
          }
        }
      }
    });
  }
}
