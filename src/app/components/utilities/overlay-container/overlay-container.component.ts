import { Component, OnDestroy, OnInit } from '@angular/core';
import { EventEmitter, Output, Input } from '@angular/core';
@Component({
  selector: 'app-overlay-container',
  imports: [],
  templateUrl: './overlay-container.component.html',
  styleUrl: './overlay-container.component.scss',
})
export class OverlayContainerComponent implements OnInit, OnDestroy {
  @Input() toggleOverlayContainer!: boolean;

  @Output() toggleOverlayContainerVisibility = new EventEmitter();

  ngOnInit(): void {
    document.body.style.overflow = 'hidden';
  }

  toggleVisibility() {
    this.toggleOverlayContainerVisibility.emit();
  }

  ngOnDestroy(): void {
    document.body.style.overflow = 'auto';
  }
}
