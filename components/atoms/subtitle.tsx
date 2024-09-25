interface SubtitleProps {
  children: React.ReactNode;
}

export function Subtitle({ children }: SubtitleProps) {
  return <p className="text-muted-foreground">{children}</p>;
}
