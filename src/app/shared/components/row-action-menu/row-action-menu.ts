import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { BodyAnchoredMenuDom } from '../../utils/body-anchored-menu.dom';

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
export class RowActionMenuComponent implements OnChanges, OnDestroy {
  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2,
  ) {}

  @Input({ required: true }) ariaLabel = 'Row actions';
  @Input() disabled = false;
  @Input() actions: readonly { id: string; label: string; danger?: boolean }[] = [];
  @Input() pendingAction: string | null = null;
  @Input() closeRequested = false;

  @Output() actionSelected = new EventEmitter<string>();
  @Output() menuStateChanged = new EventEmitter<boolean>();

  @ViewChild('menuPanel', { static: false }) private panelRef?: ElementRef<HTMLElement>;

  isOpen = false;
  menuPosition: MenuPosition = { top: 0, left: 0 };

  private readonly bodyAnchor = new BodyAnchoredMenuDom();

  get isDisabled(): boolean {
    return this.disabled || this.actions.length === 0;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['closeRequested']?.currentValue === true && this.isOpen) {
      this.closeMenu();
    }
  }

  isActionPending(actionId: string): boolean {
    return this.pendingAction === actionId;
  }

  isDanger(action: { id: string; label: string; danger?: boolean }): boolean {
    return !!action.danger;
  }

  private isClickInside(target: EventTarget | null): boolean {
    if (!target) {
      return false;
    }

    const node = target as Node;
    const host = this.elementRef.nativeElement;
    if (host.contains(node)) {
      return true;
    }

    return !!this.panelRef?.nativeElement.contains(node);
  }

  @HostListener('document:click', ['$event'])
  closeOnOutsideClick(event: MouseEvent): void {
    if (!this.isOpen || this.isClickInside(event.target)) {
      return;
    }

    this.closeMenu();
  }

  @HostListener('keydown.escape')
  closeOnEscape(): void {
    if (this.isOpen) {
      this.closeMenu();
    }
  }

  @HostListener('window:resize')
  @HostListener('window:scroll')
  repositionOpenMenu(): void {
    if (this.isOpen) {
      this.setMenuPosition();
    }
  }

  toggleMenu(event: MouseEvent): void {
    event.stopPropagation();

    if (this.isDisabled) {
      return;
    }

    if (this.isOpen) {
      this.closeMenu();
      return;
    }

    this.openMenu();
  }

  selectAction(actionId: string, event: MouseEvent): void {
    event.stopPropagation();
    this.closeMenu();
    this.actionSelected.emit(actionId);
  }

  ngOnDestroy(): void {
    this.bodyAnchor.restore(this.renderer, this.panelRef?.nativeElement);
    this.bodyAnchor.reset();
  }

  private openMenu(): void {
    this.isOpen = true;
    this.setMenuPosition();
    this.menuStateChanged.emit(true);
    Promise.resolve().then(() => this.bodyAnchor.append(this.renderer, this.panelRef?.nativeElement));
  }

  private closeMenu(): void {
    if (!this.isOpen) {
      this.bodyAnchor.reset();
      return;
    }

    this.bodyAnchor.restore(this.renderer, this.panelRef?.nativeElement);
    this.isOpen = false;
    this.menuStateChanged.emit(false);
  }

  private setMenuPosition(): void {
    const trigger = this.elementRef.nativeElement.querySelector<HTMLButtonElement>(
      '.row-action-menu__trigger',
    );

    if (!trigger) {
      return;
    }

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
}