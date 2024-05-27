import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const started = Date.now();
    const correlationId = req.headers.get('X-Correlation-Id');
    console.log(`[${correlationId}] Requesting ${req.url}`);

    // Combine request headers and body into a single JSON object
    const requestLog = {
      headers: Object.fromEntries(req.headers.keys().map(key => [key, req.headers.get(key)])),
      body: req.body
    };

    // Log the combined request object
    console.log(`Request (${this.apiPostfix(req.url)}):`, requestLog);

    return next.handle(req).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          const elapsed = Date.now() - started;
          // console.log(`Response from ${req.url} took ${elapsed} ms`);

          // Check if the response is a Blob
          if (event.body instanceof Blob) {
            this.readBlobContent(event.body, correlationId, req.url);
          } else {
            console.log(`${this.apiPostfix(req.url)} --> [${correlationId}] Response body:`, event.body);
          }
        }
      }),
      catchError((error) => {
        const elapsed = Date.now() - started;
        console.error(`Request to ${req.url} failed after ${elapsed} ms:`, error);
        return throwError(() => error);
      })
    );
  }

  private readBlobContent(blob: Blob, correlationId: string, url: string) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const contentType = blob.type;
      let responseData: any;

      // Handle different content types
      if (contentType === 'application/json') {
        responseData = JSON.parse(reader.result as string);
      } else {
        // For other content types (e.g., plain text), you can directly use the result
        responseData = reader.result;
      }

      console.log(`${this.apiPostfix(url)} --> [${correlationId}] Response body (Blob):`, responseData);
    };

    // Read the Blob content as text
    reader.readAsText(blob);
  }

  private apiPostfix(url: string): string {
    const apiIndex = url.indexOf('/api/');
    if (apiIndex !== -1) {
      return url.substring(apiIndex + 5)
    } else {
      return ''
    }
  }

}