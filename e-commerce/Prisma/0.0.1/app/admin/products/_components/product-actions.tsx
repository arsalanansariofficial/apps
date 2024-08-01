'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

import {
  deleteProduct,
  toggleProductAvailability
} from '../../_actions/products';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

export function ActiveToggleDropdownItem(props: {
  id: string;
  isAvailableForPurchase: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  return (
    <DropdownMenuItem
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await toggleProductAvailability(
            props.id,
            !props.isAvailableForPurchase
          );
          router.refresh();
        });
      }}
    >
      {props.isAvailableForPurchase ? 'Deactivate' : 'Activate'}
    </DropdownMenuItem>
  );
}

export function DeleteDropdownItem(props: { id: string; disabled: boolean }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  return (
    <DropdownMenuItem
      variant="destructive"
      disabled={props.disabled || isPending}
      onClick={() => {
        startTransition(async () => {
          await deleteProduct(props.id);
          router.refresh();
        });
      }}
    >
      Delete
    </DropdownMenuItem>
  );
}
