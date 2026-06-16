import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { OnlyNumberDirective } from './only-number.directive';
import { cardTypeValidator } from './commonValidator';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, OnlyNumberDirective],
  templateUrl: './app.component.new.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnDestroy {
  cardControl = new FormControl('', { validators: [cardTypeValidator()], updateOn: 'change' });
  cardNumber = '';
  displayValue = '';
  submittedCardNumber = '';
  showFullNumber = false;
  private revealMostRecentDigit = false;
  private revealTimer?: ReturnType<typeof setTimeout>;
  private activeInput?: HTMLInputElement;

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.activeInput = input;

    const previousLength = this.cardNumber.length;
    this.cardNumber = this.sanitizeCardNumber(input.value);
    this.cardControl.setValue(this.cardNumber, { emitEvent: false });
    const caretPosition = Math.min(this.cardNumber.length, input.selectionStart ?? this.cardNumber.length);

    this.revealMostRecentDigit = this.cardNumber.length >= previousLength;
    this.refreshDisplay(this.cardNumber, caretPosition);

    this.scheduleMaskReset();
  }

  toggleVisibility(): void {
    this.showFullNumber = !this.showFullNumber;
    this.refreshDisplay(this.cardNumber);
  }

  submitCard(): void {
    this.submittedCardNumber = this.cardNumber;
  }

  ngOnDestroy(): void {
    if (this.revealTimer) {
      clearTimeout(this.revealTimer);
    }
  }

  private sanitizeCardNumber(value: string): string {
    return value.replace(/\D/g, '');
  }



  private refreshDisplay(cardNumber: string, caretPosition = cardNumber.length): void {
    if (!cardNumber) {
      this.displayValue = '';
      return;
    }

    if (this.showFullNumber) {
      this.displayValue = cardNumber;
      return;
    }

    if (this.revealMostRecentDigit) {
      const lastTypedIndex = Math.max(0, Math.min(cardNumber.length - 1, caretPosition - 1));
      const masked = Array.from(cardNumber)
        .map((digit, index) => (index === lastTypedIndex ? digit : '*'))
        .join('');
      this.displayValue = masked;
      return;
    }

    this.displayValue = '*'.repeat(cardNumber.length);
  }

  private scheduleMaskReset(): void {
    if (this.revealTimer) {
      clearTimeout(this.revealTimer);
    }

    this.revealTimer = setTimeout(() => {
      this.revealMostRecentDigit = false;
      this.refreshDisplay(this.cardNumber);

      if (this.activeInput) {
        this.activeInput.value = this.cardNumber;
      }
    }, 200);
  }
}
