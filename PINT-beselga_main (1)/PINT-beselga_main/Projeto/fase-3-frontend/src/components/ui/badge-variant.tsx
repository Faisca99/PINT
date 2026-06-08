import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { t } from "@/lib/i18n";

const statusBadgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        open: "bg-muted text-muted-foreground",
        submitted: "bg-info/10 text-info",
        in_validation: "bg-warning/10 text-warning",
        approved: "bg-success/10 text-success",
        rejected: "bg-destructive/10 text-destructive",
        pending: "bg-muted text-muted-foreground",
        premium: "gradient-badge-gold text-white",
      },
    },
    defaultVariants: {
      variant: "open",
    },
  }
);

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadgeVariants> {
  label?: string;
}

export function StatusBadge({ className, variant, label, ...props }: StatusBadgeProps) {
  const labelKeys: Record<string, string> = {
    open:          "label.open",
    submitted:     "label.submitted",
    in_validation: "label.inValidation",
    approved:      "label.approved",
    rejected:      "label.rejected",
    pending:       "label.pending",
    premium:       "badge.premium",
  };

  return (
    <span className={cn(statusBadgeVariants({ variant }), className)} {...props}>
      {label || t(labelKeys[variant || "open"] ?? "label.open")}
    </span>
  );
}
