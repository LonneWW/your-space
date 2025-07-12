import { HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { LoaderInterceptor } from './loader.interceptor';
import { LoaderService } from '../services/loader.service';

describe('LoaderInterceptor', () => {
  let interceptor: LoaderInterceptor;
  let loaderService: jasmine.SpyObj<LoaderService>;
  let httpHandler: HttpHandler;

  beforeEach(() => {
    loaderService = jasmine.createSpyObj('LoaderService', ['show', 'hide']);
    interceptor = new LoaderInterceptor(loaderService);
    httpHandler = {
      handle: jasmine
        .createSpy('handle')
        .and.returnValue(of({} as HttpEvent<any>)),
    };
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should call loader.show before handling the request', () => {
    const req = new HttpRequest('GET', '/api/test');

    interceptor.intercept(req, httpHandler).subscribe();

    expect(loaderService.show).toHaveBeenCalledTimes(1);
    expect(httpHandler.handle).toHaveBeenCalledWith(req);
  });

  it('should call loader.hide after request completes successfully', (done) => {
    const req = new HttpRequest('POST', '/api/data', { foo: 'bar' });

    (httpHandler.handle as jasmine.Spy).and.returnValue(
      of({} as HttpEvent<any>)
    );

    interceptor.intercept(req, httpHandler).subscribe({
      complete: () => {
        expect(loaderService.hide).toHaveBeenCalledTimes(1);
        done();
      },
    });
  });

  it('should call loader.hide after request errors out', (done) => {
    const req = new HttpRequest('DELETE', '/api/remove/1');
    const error = new Error('Network error');

    (httpHandler.handle as jasmine.Spy).and.returnValue(
      throwError(() => error)
    );

    interceptor.intercept(req, httpHandler).subscribe({
      error: () => {
        expect(loaderService.hide).toHaveBeenCalledTimes(1);
        done();
      },
    });
  });

  it('should forward method, url and body without mutation', () => {
    const body = { id: 42 };
    const req = new HttpRequest('PUT', '/api/update', body);

    interceptor.intercept(req, httpHandler).subscribe();

    const captured = (httpHandler.handle as jasmine.Spy).calls.mostRecent()
      .args[0] as HttpRequest<any>;
    expect(captured.method).toBe('PUT');
    expect(captured.url).toBe('/api/update');
    expect(captured.body).toEqual(body);
  });
});
