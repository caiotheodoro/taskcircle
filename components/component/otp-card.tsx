import { Button } from '@/components/ui/button';

import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp';

export function OtpCard() {
  return (
    <div className="mx-auto max-w-md space-y-6 p-4 w-full  fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-bold">Group Claimed!</h1>
        <p className="text-muted-foreground">
          Enter the group code to join the group
        </p>
      </div>
      <div className="space-y-4">
        <InputOTP
          maxLength={5}
          pattern="^[a-zA-Z0-9_.-]*$"
          className="text-3xl"
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
          </InputOTPGroup>
        </InputOTP>
        <Button type="submit" className="w-full">
          Join Group
        </Button>
      </div>
    </div>
  );
}
