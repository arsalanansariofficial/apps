import { useFormStatus } from 'react-dom';

export type App_Button = {
  text: string;
  fallback: string;
  type: 'submit' | 'reset' | 'button' | undefined;
};

export default function Button({ text, type, fallback }: App_Button) {
  const formStatus = useFormStatus();

  return <button type={type}>{formStatus.pending ? fallback : text}</button>;
}
