import { Component, OnDestroy, OnInit } from '@angular/core';
import { EventEmitter, Output, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-overlay-container',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './overlay-container.component.html',
  styleUrl: './overlay-container.component.scss',
})
export class OverlayContainerComponent implements OnInit, OnDestroy {
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
