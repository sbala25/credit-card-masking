import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { OnlyNumberDirective } from './only-number.directive';
import { cardTypeValidator } from './commonValidator';

@Component({
  selector: 'app-custom-mask-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, OnlyNumberDirective],
  templateUrl: './custom-mask-input.component.html',
  styleUrls: ['./custom-mask-input.component.scss'],
})
export class CustomMaskInputComponent implements OnInit, OnDestroy {
  @Input() control = new FormControl('', { validators: [cardTypeValidator()] });
  @Input() label = 'Card number';
  @Input() placeholder = 'Enter card number';

  inputId = `card-number-${Math.random().toString(36).slice(2, 8)}`;
  displayValue = '';
  cardNumber = '';
  showFullNumber = false;

  private revealMostRecentDigit = false;
  private revealTimer?: ReturnType<typeof setTimeout>;
  private activeInput?: HTMLInputElement;
  // private controlSub?: Subscription;

  ngOnInit(): void {
    this.cardNumber = this.sanitizeCardNumber(String(this.control.value ?? ''));
    this.refreshDisplay(this.cardNumber);

    // this.controlSub = this.control.valueChanges.subscribe((value) => {
    //   const sanitized = this.sanitizeCardNumber(String(value ?? ''));
    //   if (sanitized !== this.cardNumber) {
    //     this.cardNumber = sanitized;
    //   }
    //   this.refreshDisplay(this.cardNumber);
    // });
  }

  ngOnDestroy(): void {
    // if (this.controlSub) {
    //   this.controlSub.unsubscribe();
    // }
    if (this.revealTimer) {
      clearTimeout(this.revealTimer);
    }
  }

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    console.log(event);
    this.activeInput = input;
    console.log('p', this.cardNumber.length);
    const previousLength = this.cardNumber.length;
    this.cardNumber = this.sanitizeCardNumber(input.value);
    console.log('c', this.cardNumber.length);
    this.control.setValue(this.cardNumber, { emitEvent: true });
    const caretPosition = Math.min(this.cardNumber.length, input.selectionStart ?? this.cardNumber.length);
    // console.log('previousLength', previousLength);
    // console.log('current', this.cardNumber.length);
    this.revealMostRecentDigit = this.cardNumber.length >= previousLength;
    this.refreshDisplay(this.cardNumber, caretPosition);
    this.scheduleMaskReset();
  }

  toggleVisibility(): void {
    this.showFullNumber = !this.showFullNumber;
    this.refreshDisplay(this.cardNumber);
  }

  get showError(): boolean {
    return this.control.invalid && (this.control.touched || this.control.dirty);
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
      this.displayValue = Array.from(cardNumber)
        .map((digit, index) => (index === lastTypedIndex ? digit : '*'))
        .join('');
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
