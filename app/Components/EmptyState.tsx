"use client";

import Link from "next/link";
import Button from "./Button";

interface EmptyStateProps {
  title: string;
  subtitle: string;
  actionLabel?: string;
  actionHref?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  subtitle,
  actionLabel,
  actionHref,
}) => (
  <div className="flex h-[60vh] flex-col items-center justify-center">
    <div className="text-center">
      <h3 className="mt-2 text-xl font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
      {actionLabel && actionHref && (
        <div className="mt-6">
          <Link href={actionHref} passHref>
            <Button
              label={actionLabel}
              outline
              small
              onClick={(e) => {
                e.preventDefault();
                window.location.href = actionHref;
              }}
            />
          </Link>
        </div>
      )}
    </div>
  </div>
);
export default EmptyState;
