import FramerCheckbox from '../atoms/framer-checkbox';

interface PostContentProps {
  id: string;
  content: string;
  status: boolean;
  onChangeStatus: (post_id: string, status: boolean) => void;
  disabled: boolean;
}

export default function PostContent({
  id,
  content,
  status,
  onChangeStatus,
  disabled,
}: PostContentProps) {
  return (
    <div className="flex gap-2 items-center">
      <FramerCheckbox
        id={id}
        checked={status}
        onClick={() => onChangeStatus(id, !status)}
        disabled={disabled}
      >
        <FramerCheckbox.Indicator />
        <FramerCheckbox.Label>{content}</FramerCheckbox.Label>
      </FramerCheckbox>
    </div>
  );
}
