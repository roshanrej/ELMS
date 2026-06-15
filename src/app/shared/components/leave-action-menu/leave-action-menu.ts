import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, Output, Renderer2, ViewChild } from '@angular/core';
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
export class LeaveActionMenuComponent implements OnDestroy {
  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2
  ) {}

  @Input({ required: true }) actions: readonly LeaveRequestActionEnum[] = [];
  @Input() disabled = false;
  @Input() pendingAction: LeaveRequestActionEnum | null = null;
  @Input() ariaLabel = 'Leave request actions';

  @Output() actionSelected = new EventEmitter<LeaveRequestActionEnum>();
  @Output() menuStateChanged = new EventEmitter<boolean>();

  @ViewChild('menuPanel', { static: false }) private panelRef?: ElementRef<HTMLElement>;

  isOpen = false;
  menuPosition: MenuPosition = { top: 0, left: 0 };

  private originalParent: Node | null = null;
  private isAppendedToBody = false;

  get visibleActions(): readonly LeaveRequestActionEnum[] {
    return this.actions ?? [];
  }

  get hasActions(): boolean {
    return this.visibleActions.length > 0;
  }

  get isDisabled(): boolean {
    return this.disabled || !this.hasActions;
  }

  private isClickInside(target: EventTarget | null): boolean {
    if (!target) return false;
    const node = target as Node;
    const host = this.elementRef.nativeElement;
    if (host.contains(node)) return true;
    if (this.panelRef && this.panelRef.nativeElement.contains(node)) return true;
    return false;
  }

  private appendPanelToBody(): void {
    if (!this.panelRef || this.isAppendedToBody) return;
    const panelEl = this.panelRef.nativeElement;
    this.originalParent = panelEl.parentNode;
    if (this.originalParent) {
      this.renderer.appendChild(document.body, panelEl);
      this.isAppendedToBody = true;
    }
  }

  private restorePanelToOriginalParent(): void {
    if (!this.panelRef || !this.isAppendedToBody || !this.originalParent) return;
    const panelEl = this.panelRef.nativeElement;
    this.renderer.appendChild(this.originalParent, panelEl);
    this.isAppendedToBody = false;
  }

  @HostListener('document:click', ['$event'])
  closeOnOutsideClick(event: MouseEvent): void {
    if (!this.isClickInside(event.target)) {
      if (this.isOpen) {
        this.isOpen = false;
        this.restorePanelToOriginalParent();
        this.menuStateChanged.emit(false);
      }
    }
  }

  @HostListener('keydown.escape')
  closeOnEscape(): void {
    if (this.isOpen) {
      this.isOpen = false;
      this.restorePanelToOriginalParent();
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
      Promise.resolve().then(() => this.appendPanelToBody());
    } else {
      this.restorePanelToOriginalParent();
    }
    this.menuStateChanged.emit(this.isOpen);
  }

  selectAction(action: LeaveRequestActionEnum): void {
    this.isOpen = false;
    this.restorePanelToOriginalParent();
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

  ngOnDestroy(): void {
    this.restorePanelToOriginalParent();
  }
}
