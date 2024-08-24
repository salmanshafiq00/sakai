import { HttpHeaders, HttpEvent, HttpEventType, HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { UsersClient } from 'src/app/modules/generated-clients/api-service';

@Component({
  selector: 'user-change-profile-photo',
  templateUrl: './change-profile-photo.component.html',
  styleUrl: './change-profile-photo.component.scss',
  providers: [UsersClient]
})
export class ChangeProfilePhotoComponent {
  
  private baseUrl = 'https://localhost:5001/api/users';
  progressValue: number = 0;

  uploadedFiles: any[] = [];

  private usersClient = inject(UsersClient)
  private http = inject(HttpClient)

  onUpload(event: any) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
  }

  onProgress(event: any) {
    this.progressValue = event.progres;
  }

  onError(event: any){
    console.log(event)
  }

  onUploadHandler(event: any){

    const file = event.files[0];

    this.upload(file).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          console.log('File uploaded successfully, path:', response.body);
          // Do something with the file path (e.g., display a message or update UI)
        } else if (response.status === 'progress') {
          this.progressValue = response.progress; // Update progress bar
        }
      },
      error: (error) => {
        console.error('Upload error:', error);
      }
    });

  }

  upload(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
  
    // No need to specify 'enctype' header manually. HttpClient will automatically handle it.
    return this.http.post(`${this.baseUrl}/upload`, formData, {
      reportProgress: true,
      withCredentials: true,
      observe: 'events'
    }).pipe(
      map((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            return {
              status: 'progress',
              progress: Math.round(100 * event.loaded / (event.total || 1))
            };
          case HttpEventType.Response:
            return {
              status: 'success',
              body: event.body // The server should return the file path here.
            };
          default:
            return { status: 'unknown' };
        }
      })
    );
  }
  
  

}
