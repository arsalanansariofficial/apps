import Link from 'next/link';
import Image from 'next/image';

import {
  Card,
  CardTitle,
  CardHeader,
  CardFooter,
  CardContent,
  CardDescription
} from './ui/card';
import { Button } from './ui/button';
import { formatCurrency } from '@/lib/utils';

export function ProductCard(props: {
  id: string;
  name: string;
  imagePath: string;
  description: string;
  priceInCents: number;
}) {
  return (
    <Card className="flex flex-col overflow-hidden">
      <div className="relative aspect-video h-auto w-full">
        <Image src={props.imagePath} fill alt={props.name} />
      </div>
      <CardHeader>
        <CardTitle>{props.name}</CardTitle>
        <CardDescription>
          {formatCurrency(props.priceInCents / 100)}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="line-clamp-4">{props.description}</p>
      </CardContent>
      <CardFooter>
        <Button asChild size="lg" className="w-full">
          <Link href={`/products/${props.id}/purchase`}>Purchase</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export function ProductCardStructure() {
  return (
    <Card className="flex animate-pulse flex-col overflow-hidden">
      <div className="aspect-video w-full bg-gray-300"></div>
      <CardHeader>
        <CardTitle>
          <div className="h-6 w-3/4 rounded-full bg-gray-300"></div>
        </CardTitle>
        <CardDescription>
          <span className="h-4 w-1/2 rounded-full bg-gray-300"></span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="h-4 w-full rounded-full bg-gray-300"></div>
        <div className="h-4 w-full rounded-full bg-gray-300"></div>
        <div className="h-4 w-3/4 rounded-full bg-gray-300"></div>
      </CardContent>
      <CardFooter>
        <Button disabled size="lg" className="w-full"></Button>
      </CardFooter>
    </Card>
  );
}
