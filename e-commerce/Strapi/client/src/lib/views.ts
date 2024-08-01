import { Children, ReactNode } from 'react';

type App_Show = {
  children: any;
};

type App_Each<T> = {
  of: T[];
  render: (item: T, index: number) => ReactNode;
};

type App_Else = {
  render?: any;
  children?: any;
};

type App_When = {
  children: any;
  isTrue: boolean;
};

export function Each<T>({ of, render }: App_Each<T>) {
  return Children.toArray(
    of.map(function (item: T, index: number) {
      return render(item, index);
    })
  );
}

export function Show(props: App_Show) {
  let when: any = null;
  let otherwise: any = null;

  Children.forEach(props.children, function (children) {
    if (children.props.isTrue === undefined) otherwise = children;
    if (!when && children.props.isTrue) when = children;
  });

  return when || otherwise;
}

Show.When = function ({ isTrue, children }: App_When) {
  return isTrue && children;
};

Show.Else = function ({ render, children }: App_Else) {
  return render || children;
};
