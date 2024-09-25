import { Button } from '@/components/ui/button';

interface SubmitButtonProps {
  status: string;
  inviteStatus: string | null;
  children: React.ReactNode;
}

export function SubmitButton({
  status,
  inviteStatus,
  children,
}: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      className={`w-full max-w-56 capitalize ${!!inviteStatus && 'bg-success'}`}
      disabled={status === 'executing' || !!inviteStatus}
    >
      {children}
    </Button>
  );
}
