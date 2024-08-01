'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

import { deleteOrder } from '../../_actions/orders';

export function DeleteDropdownItem(props: { id: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <DropdownMenuItem
      variant="destructive"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await deleteOrder(props.id);
          router.refresh();
        });
      }}
    >
      Delete
    </DropdownMenuItem>
  );
}
