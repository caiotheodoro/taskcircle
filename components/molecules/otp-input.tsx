import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp';

import { FormField, FormItem } from '@/components/ui/form';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';

interface OtpInputProps {
  control: any; // Replace 'any' with the appropriate type from react-hook-form
}

export function OtpInput({ control }: OtpInputProps) {
  return (
    <FormField
      name="otp"
      control={control}
      render={({ field }) => (
        <FormItem>
          <InputOTP
            inputMode="text"
            maxLength={5}
            pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
            className="text-3xl"
            {...field}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
            </InputOTPGroup>
          </InputOTP>
        </FormItem>
      )}
    />
  );
}
