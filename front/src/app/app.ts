import { Component, signal } from '@angular/core';

import { ContactListComponent } from "./components/contact-list/contact-list/contact-list.component";

@Component({
  selector: 'app-root',
  imports: [ ContactListComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('contact');
}
