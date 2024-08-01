import { Children } from 'react';

export default function Each({ of, render }) {
  return Children.toArray(
    of.map(function (item) {
      return render(item, item.id);
    })
  );
}
