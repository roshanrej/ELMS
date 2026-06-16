import { Renderer2 } from '@angular/core';

/**
 * Moves a dropdown panel to document.body so it is not clipped by table overflow.
 * Tracks DOM state so rapid open/close across multiple row menus stays consistent.
 */
export class BodyAnchoredMenuDom {
  private originalParent: Node | null = null;
  private isAppendedToBody = false;

  append(renderer: Renderer2, panelEl: HTMLElement | undefined): void {
    if (!panelEl) {
      return;
    }

    if (this.isAppendedToBody) {
      if (document.body.contains(panelEl)) {
        return;
      }
      this.reset();
    }

    this.originalParent = panelEl.parentNode;
    if (!this.originalParent) {
      return;
    }

    renderer.appendChild(document.body, panelEl);
    this.isAppendedToBody = true;
  }

  restore(renderer: Renderer2, panelEl: HTMLElement | undefined): void {
    if (!panelEl || !this.isAppendedToBody || !this.originalParent) {
      this.reset();
      return;
    }

    renderer.appendChild(this.originalParent, panelEl);
    this.reset();
  }

  reset(): void {
    this.isAppendedToBody = false;
    this.originalParent = null;
  }
}