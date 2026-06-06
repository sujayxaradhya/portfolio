import type { AnchorHTMLAttributes, ReactNode } from "react";
import type { VariantProps } from "class-variance-authority";
import { Button, buttonVariants } from "@/components/ui/button";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> &
  VariantProps<typeof buttonVariants> & { children?: ReactNode };

export function LinkButton({
  variant,
  size,
  className,
  children,
  ...anchorProps
}: Props) {
  return (
    <Button
      nativeButton={false}
      variant={variant}
      size={size}
      className={className}
      render={<a {...anchorProps} />}
    >
      {children}
    </Button>
  );
}
