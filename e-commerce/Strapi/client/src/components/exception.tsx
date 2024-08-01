import { Show, Each } from '@/lib/views';
import { App_Exception } from '@/lib/types';

type App_Exception_Component = { exception: App_Exception | null };

export default function Exception({ exception }: App_Exception_Component) {
  return (
    <div>
      <h3>Something went wrong!</h3>
      <p>Status: {exception?.status}</p>
      <p>Message: {exception?.message}</p>
      <Show>
        <Show.When isTrue={!!exception?.details?.errors?.length}>
          <Each
            of={exception?.details?.errors || []}
            render={function (exception, index) {
              return (
                <p key={index}>
                  {exception.name}: {exception.message}
                </p>
              );
            }}
          />
        </Show.When>
      </Show>
    </div>
  );
}
