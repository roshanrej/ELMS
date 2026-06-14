import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { LeaveRequestActionEnum } from '../../../core/types-enums/leave-request-action.enum';
import { getLeaveRequestActionMeta } from '../../models/leave-request-action-menu.model';

interface MenuPosition {
  top: number;
  left: number;
}

@Component({
  selector: 'app-leave-action-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leave-action-menu.html',
  styleUrl: './leave-action-menu.scss',
})
export class LeaveActionMenuComponent {
  @Input({ required: true }) actions: readonly LeaveRequestActionEnum[] = [];
  @Input() disabled = false;
  @Input() pendingAction: LeaveRequestActionEnum | null = null;
  @Input() ariaLabel = 'Leave request actions';

  @Output() actionSelected = new EventEmitter<LeaveRequestActionEnum>();
  @Output() menuStateChanged = new EventEmitter<boolean>();

  isOpen = false;
  menuPosition: MenuPosition = { top: 0, left: 0 };

  constructor(private readonly elementRef: ElementRef<HTMLElement>) {}

  get visibleActions(): readonly LeaveRequestActionEnum[] {
    return this.actions ?? [];
  }

  get hasActions(): boolean {
    return this.visibleActions.length > 0;
  }

  get isDisabled(): boolean {
    return this.disabled || !this.hasActions;
  }

  @HostListener('document:click', ['$event'])
  closeOnOutsideClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      if (this.isOpen) {
        this.isOpen = false;
        this.menuStateChanged.emit(false);
      }
    }
  }

  @HostListener('keydown.escape')
  closeOnEscape(): void {
    if (this.isOpen) {
      this.isOpen = false;
      this.menuStateChanged.emit(false);
    }
  }

  @HostListener('window:resize')
  @HostListener('window:scroll')
  repositionOpenMenu(): void {
    if (this.isOpen) {
      this.setMenuPosition();
    }
  }

  toggleMenu(): void {
    if (this.isDisabled) return;
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.setMenuPosition();
    }
    this.menuStateChanged.emit(this.isOpen);
  }

  selectAction(action: LeaveRequestActionEnum): void {
    this.isOpen = false;
    this.menuStateChanged.emit(false);
    this.actionSelected.emit(action);
  }

  getLabel(action: LeaveRequestActionEnum): string {
    return getLeaveRequestActionMeta(action).label;
  }

  getIcon(action: LeaveRequestActionEnum): string {
    return getLeaveRequestActionMeta(action).icon;
  }

  isDanger(action: LeaveRequestActionEnum): boolean {
    return getLeaveRequestActionMeta(action).danger;
  }

  private setMenuPosition(): void {
    const trigger = this.elementRef.nativeElement.querySelector<HTMLButtonElement>(
      '.leave-action-menu__trigger'
    );

    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const viewportPadding = 8;
    const panelWidth = 224;
    const rowHeight = 38;
    const panelHeight = Math.max(this.visibleActions.length * rowHeight + 12, 48);
    const spaceBelow = window.innerHeight - rect.bottom;
    const opensUp = spaceBelow < panelHeight + viewportPadding && rect.top > panelHeight;

    const left = Math.min(
      Math.max(rect.right - panelWidth, viewportPadding),
      window.innerWidth - panelWidth - viewportPadding
    );

    this.menuPosition = {
      left,
      top: opensUp ? rect.top - panelHeight - 6 : rect.bottom + 6,
    };
  }
}
