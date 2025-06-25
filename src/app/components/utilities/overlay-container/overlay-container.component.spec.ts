import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OverlayContainerComponent } from './overlay-container.component';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('OverlayContainerComponent', () => {
  let component: OverlayContainerComponent;
  let fixture: ComponentFixture<OverlayContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverlayContainerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OverlayContainerComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    // Puliamo eventuali modifiche allo stile applicate al body
    document.body.style.overflow = '';
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set document.body.style.overflow to "hidden" on initialization', () => {
    component.ngOnInit();
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('should reset document.body.style.overflow to "auto" on destroy', () => {
    component.ngOnInit();
    component.ngOnDestroy();
    expect(document.body.style.overflow).toBe('auto');
  });

  it('should emit toggleOverlayContainerVisibility event when toggleVisibility is called', () => {
    spyOn(component.toggleOverlayContainerVisibility, 'emit');
    component.toggleVisibility();
    expect(component.toggleOverlayContainerVisibility.emit).toHaveBeenCalled();
  });

  it('should call toggleVisibility when screen-overlay is clicked', () => {
    spyOn(component, 'toggleVisibility');
    fixture.detectChanges();

    const overlayDe: DebugElement = fixture.debugElement.query(
      By.css('.screen-overlay')
    );
    overlayDe.triggerEventHandler('click', null);
    expect(component.toggleVisibility).toHaveBeenCalled();
  });

  it('should call stopPropagation on container click', () => {
    const containerDe: DebugElement = fixture.debugElement.query(
      By.css('.container')
    );
    const mockEvent = { stopPropagation: jasmine.createSpy('stopPropagation') };
    containerDe.triggerEventHandler('click', mockEvent);
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
  });
});
