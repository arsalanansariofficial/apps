import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ExpiredPage() {
  return (
    <>
      <h1 className="mb-4 text-4xl">Downlaod link expired!</h1>
      <Button asChild size="lg">
        <Link href="/orders">Get New Link</Link>
      </Button>
    </>
  );
}
