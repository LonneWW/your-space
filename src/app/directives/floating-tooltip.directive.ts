import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appFloatingTooltip]',
})
export class FloatingTooltipDirective {
  private tooltip!: HTMLElement;
  @Input() appFloatingTooltip: string = '';

  constructor(private element: ElementRef) {}

  @HostListener('mouseenter') onMouseEnter() {
    this.createToolTip();
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.deleteToolTip();
  }

  private createToolTip() {
    if (!this.tooltip) {
      this.tooltip = document.createElement('div');
      this.tooltip.className = 'tooltip';
      this.tooltip.textContent = this.appFloatingTooltip;
    }
    this.element.nativeElement.appendChild(this.tooltip);
    console.log(this.tooltip);
  }

  private deleteToolTip() {
    if (this.tooltip) {
      this.element.nativeElement.removeChild(this.tooltip);
    }
  }
}
