import { HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { of } from 'rxjs';
import { CredentialsInterceptor } from './credentials-interceptor.interceptor';

describe('CredentialsInterceptor', () => {
  let interceptor: CredentialsInterceptor;
  let httpHandler: HttpHandler;

  beforeEach(() => {
    interceptor = new CredentialsInterceptor();
    httpHandler = {
      handle: jasmine
        .createSpy('handle')
        .and.returnValue(of({} as HttpEvent<any>)),
    };
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should clone the request with withCredentials true', (done) => {
    const req = new HttpRequest('GET', '/test');

    // Override handle to inspect the passed request
    (httpHandler.handle as jasmine.Spy).and.callFake(
      (clonedReq: HttpRequest<any>) => {
        expect(clonedReq.withCredentials).toBeTrue();
        return of(null as any);
      }
    );

    interceptor.intercept(req, httpHandler).subscribe({
      complete: () => done(),
    });
  });

  it('should not mutate the original request', () => {
    const req = new HttpRequest('POST', '/submit', { payload: 123 });
    interceptor.intercept(req, httpHandler).subscribe();
    expect(req.withCredentials).toBeFalse();
  });

  it('should forward method, url and body correctly', (done) => {
    const req = new HttpRequest('PUT', '/update', { name: 'Sam' });

    (httpHandler.handle as jasmine.Spy).and.callFake(
      (clonedReq: HttpRequest<any>) => {
        expect(clonedReq.method).toBe('PUT');
        expect(clonedReq.url).toBe('/update');
        expect(clonedReq.body).toEqual({ name: 'Sam' });
        return of({} as HttpEvent<any>);
      }
    );

    interceptor.intercept(req, httpHandler).subscribe({
      complete: () => done(),
    });
  });
});
