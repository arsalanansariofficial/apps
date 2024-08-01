import { Children } from 'react';

export function Show(props) {
  let when = null;
  let otherwise = null;

  Children.forEach(props.children, function (children) {
    if (children.props.isTrue === undefined) otherwise = children;
    if (!when && children.props.isTrue) when = children;
  });

  return when || otherwise;
}

Show.When = function ({ isTrue, children }) {
  return isTrue && children;
};

Show.Else = function ({ render, children }) {
  return render || children;
};
