import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CustomMaskInputComponent } from './custom-mask-input.component';
import { cardTypeValidator } from './commonValidator';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CustomMaskInputComponent],
  templateUrl: './app.component.new.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  cardControl = new FormControl('', {
    validators: [cardTypeValidator()],
    updateOn: 'change',
  });

  anotherCardControl = new FormControl('', {
    validators: [cardTypeValidator()],
    updateOn: 'change',
  });

  submittedCardNumber = '';
  submittedCardNumber2 = '';

  submitCard(): void {
    this.submittedCardNumber = String(this.cardControl.value ?? '');
    this.submittedCardNumber2 = String(this.anotherCardControl.value ?? '');
  }
}
