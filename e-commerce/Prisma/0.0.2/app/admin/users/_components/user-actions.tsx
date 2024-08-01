'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

import { deleteUser } from '../../_actions/users';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

export function DeleteDropdownItem(props: { id: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <DropdownMenuItem
      variant="destructive"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await deleteUser(props.id);
          router.refresh();
        });
      }}
    >
      Delete
    </DropdownMenuItem>
  );
}
