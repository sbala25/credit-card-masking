import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import creditCardType from 'credit-card-type';

export function cardTypeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const cardNumber = control.value;


        if (!cardNumber) {
            return null // No value, no validation error (can use Validators.required separately)
        }
        const cardTypes = creditCardType(cardNumber);
        if (cardTypes.length === 1) {
            const lengths = cardTypes[0].lengths;
            const type = cardTypes[0].type;


            // check the credit card number length
            if (!lengths.includes(cardNumber.length))
                return { invalidCardNumber: true }


        } else
            return { invalidCardNumber: true } // check the cardTypes multiple



        return null; // Date is valid
    };
}