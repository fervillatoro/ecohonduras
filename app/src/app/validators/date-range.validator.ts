import { AbstractControl, ValidationErrors, ValidatorFn, FormGroup } from '@angular/forms';
import { format, parseISO } from 'date-fns';

export function dateRangeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control instanceof FormGroup) {
      const billingDateFrom = format( parseISO( control.get('billing_date_from')?.value ), 'yyyy-MM-dd');
      const billingDateTo = format( parseISO( control.get('billing_date_to')?.value), 'yyyy-MM-dd');

      if (billingDateFrom && billingDateTo) {
        const from = new Date(billingDateFrom);
        const to = new Date(billingDateTo);
        const diffTime = to.getTime() - from.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 30) {
          return { dateRangeInvalid: true };
        }
      }
    }
    return null;
  };
}
