import { Component } from '@angular/core';
import { Sidebar } from '../sidebar/sidebar';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-shell',
  imports: [RouterOutlet, Sidebar],
  templateUrl: './main-shell.html',
  styleUrl: './main-shell.scss',
})
export class MainShell {}
