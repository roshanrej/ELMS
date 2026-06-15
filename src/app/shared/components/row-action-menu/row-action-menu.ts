import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, Output, Renderer2, ViewChild } from '@angular/core';

interface MenuPosition {
  top: number;
  left: number;
}

@Component({
  selector: 'app-row-action-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './row-action-menu.html',
  styleUrl: './row-action-menu.scss',
})
export class RowActionMenuComponent implements OnDestroy {
  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2
  ) {}

  @Input({ required: true }) ariaLabel = 'Row actions';
  @Input() disabled = false;
  @Input() actions: readonly { id: string; label: string; danger?: boolean }[] = [];
  @Input() pendingAction: string | null = null;

  @Output() actionSelected = new EventEmitter<string>();
  @Output() menuStateChanged = new EventEmitter<boolean>();

  @ViewChild('menuPanel', { static: false }) private panelRef?: ElementRef<HTMLElement>;

  isOpen = false;
  menuPosition: MenuPosition = { top: 0, left: 0 };

  private originalParent: Node | null = null;
  private isAppendedToBody = false;

  get isDisabled(): boolean {
    return this.disabled || this.actions.length === 0;
  }

  isActionPending(actionId: string): boolean {
    return this.pendingAction === actionId;
  }

  isDanger(action: { id: string; label: string; danger?: boolean }): boolean {
    return !!action.danger;
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
      this.menuStateChanged.emit(false);
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
    this.setMenuPosition();
  }

  toggleMenu(): void {
    if (this.isDisabled) return;
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.setMenuPosition();
      // Use microtask to ensure the panel is in DOM before moving
      Promise.resolve().then(() => this.appendPanelToBody());
    } else {
      this.restorePanelToOriginalParent();
    }
    this.menuStateChanged.emit(this.isOpen);
  }

  selectAction(actionId: string): void {
    this.actionSelected.emit(actionId);
    this.isOpen = false;
    this.restorePanelToOriginalParent();
    this.menuStateChanged.emit(false);
  }

  private setMenuPosition(): void {
    const trigger = this.elementRef.nativeElement.querySelector<HTMLButtonElement>(
      '.row-action-menu__trigger',
    );

    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const viewportPadding = 8;
    const panelWidth = 210;
    const rowHeight = 38;
    const panelHeight = Math.max(this.actions.length * rowHeight + 12, 48);
    const spaceBelow = window.innerHeight - rect.bottom;
    const opensUp = spaceBelow < panelHeight + viewportPadding && rect.top > panelHeight;

    const left = Math.min(
      Math.max(rect.right - panelWidth, viewportPadding),
      window.innerWidth - panelWidth - viewportPadding,
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
