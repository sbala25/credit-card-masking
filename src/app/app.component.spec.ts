import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should reveal only the last typed digit for 200ms', fakeAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input');
    input.value = '4111';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(fixture.componentInstance.cardNumber).toBe('4111');
    expect(fixture.componentInstance.displayValue).toBe('***1');

    tick(201);
    fixture.detectChanges();

    expect(fixture.componentInstance.displayValue).toBe('****');
  }));

  it('should mask all digits when input is shortened', fakeAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input');
    input.value = '4111';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // Simulate the user deleting one digit
    input.value = '411';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(fixture.componentInstance.cardNumber).toBe('411');
    expect(fixture.componentInstance.displayValue).toBe('***');

    tick(201);
    fixture.detectChanges();

    expect(fixture.componentInstance.displayValue).toBe('***');
  }));

  it('should toggle full visibility and submit the real card number', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input');
    input.value = '4111111111111111';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(fixture.componentInstance.cardNumber).toBe('4111111111111111');

    const toggle = fixture.nativeElement.querySelector('button.toggle-visibility');
    toggle.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.displayValue).toBe('4111111111111111');

    const submit = fixture.nativeElement.querySelector('button.submit-card');
    submit.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.submittedCardNumber).toBe('4111111111111111');
  });
});
