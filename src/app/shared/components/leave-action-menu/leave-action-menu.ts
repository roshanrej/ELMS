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
import { LeaveRequestActionEnum } from '../../../core/types-enums/leave-request-action.enum';
import { getLeaveRequestActionMeta } from '../../models/leave-request-action-menu.model';
import { BodyAnchoredMenuDom } from '../../utils/body-anchored-menu.dom';

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
export class LeaveActionMenuComponent implements OnChanges, OnDestroy {
  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2,
  ) {}

  @Input({ required: true }) actions: readonly LeaveRequestActionEnum[] = [];
  @Input() disabled = false;
  @Input() pendingAction: LeaveRequestActionEnum | null = null;
  @Input() ariaLabel = 'Leave request actions';
  @Input() closeRequested = false;

  @Output() actionSelected = new EventEmitter<LeaveRequestActionEnum>();
  @Output() menuStateChanged = new EventEmitter<boolean>();

  @ViewChild('menuPanel', { static: false }) private panelRef?: ElementRef<HTMLElement>;

  isOpen = false;
  menuPosition: MenuPosition = { top: 0, left: 0 };

  private readonly bodyAnchor = new BodyAnchoredMenuDom();

  get visibleActions(): readonly LeaveRequestActionEnum[] {
    return this.actions ?? [];
  }

  get hasActions(): boolean {
    return this.visibleActions.length > 0;
  }

  get isDisabled(): boolean {
    return this.disabled || !this.hasActions;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['closeRequested']?.currentValue === true && this.isOpen) {
      this.closeMenu();
    }
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

  selectAction(action: LeaveRequestActionEnum, event: MouseEvent): void {
    event.stopPropagation();
    this.closeMenu();
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
      '.leave-action-menu__trigger',
    );

    if (!trigger) {
      return;
    }

    const rect = trigger.getBoundingClientRect();
    const viewportPadding = 8;
    const panelWidth = 224;
    const rowHeight = 38;
    const panelHeight = Math.max(this.visibleActions.length * rowHeight + 12, 48);
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