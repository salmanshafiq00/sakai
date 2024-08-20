// input-file.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-input-file-adv',
  templateUrl: './input-file-adv.component.html',
  styleUrls: ['./input-file-adv.component.scss']
})
export class InputFileAdvComponent {
  @Input() label: string = '';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() hidden: boolean = false;
  @Input() autofocus: boolean = false;
  @Input() inputId: string = null;
  @Input() accept: string = null;
  @Input() multiple: boolean = true;
  @Input() name: string = null;
  @Input() url: string = null;
  @Input() maxFileSize: number = 2000000; // two mb
  @Input() fileLimit: number = 2;
  @Input() maxWidth: number = null;
  @Input() maxHeight: number = null;
  @Input() chooseLabel: string = 'Browse';
  @Input() chooseIcon: string = 'pi pi-upload';
  @Input() cancelLabel: string = null;
  @Input() cancelText: boolean = false;
  @Input() cancelIcon: string = 'pi pi-times';
  @Input() showCancelButton: boolean = true;
  @Input() mode: 'basic' | 'advanced' = 'advanced';
  @Input() customUpload: boolean = true;
  @Input() showTemplate: boolean = true;
  @Input() invalidFileTypeMessageSummary: string = 'Invalid File Type';
  @Input() invalidFileSizeMessageSummary: string = 'File Max Size Exceeded';
  @Input() invalidFileLimitMessageSummary: string = 'File Limit Exceed';
  @Output() onUploadedFiles: EventEmitter<any> = new EventEmitter<any>();

  files: any[] = [];

  onClearFiles() {
    this.files = [];
  }

  onFileUpload(event: any): void {
    console.log(event)
    // for (let file of event.currentFiles) {
    //   this.files.push(file);
    // }
    this.onUploadedFiles.emit(this.files);
  }
}



