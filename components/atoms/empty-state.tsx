interface EmptyStateProps {
  title: string;
  description?: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center p-8 text-center">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">{title}</h3>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
    </div>
  );
}
