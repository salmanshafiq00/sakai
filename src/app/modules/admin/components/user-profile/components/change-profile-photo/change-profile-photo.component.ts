import { Component } from '@angular/core';
import { UploadEvent } from 'primeng/fileupload';

@Component({
  selector: 'user-change-profile-photo',
  templateUrl: './change-profile-photo.component.html',
  styleUrl: './change-profile-photo.component.scss'
})
export class ChangeProfilePhotoComponent {
  uploadedFiles: any[] = [];

  onUpload(event: any) {
    console.log(event)
    for (let file of event?.files) {
      this.uploadedFiles.push(file);
    }
    console.log(this.uploadedFiles)
    alert('file uploaded')
  }

}
