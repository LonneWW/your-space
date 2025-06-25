import { ElementRef } from '@angular/core';
import { FloatingTooltipDirective } from './floating-tooltip.directive';

describe('FloatingTooltipDirective', () => {
  let elementRefStub: ElementRef;

  beforeEach(() => {
    // Creiamo un elemento dummy e lo usiamo come stub per ElementRef.
    const dummyElement = document.createElement('div');
    elementRefStub = { nativeElement: dummyElement } as ElementRef;
  });

  it('should create an instance', () => {
    const directive = new FloatingTooltipDirective(elementRefStub);
    expect(directive).toBeTruthy();
  });
});
