import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription
} from '@/components/ui/card';
import prisma from '@/db/db';
import { formatNumber, formatCurrency } from '@/lib/utils';

async function getSalesData() {
  const data = await prisma.order.aggregate({
    _sum: { pricePaidInCents: true },
    _count: true
  });

  return {
    amount: data._sum.pricePaidInCents || 0,
    numberOfSales: data._count
  };
}

async function getUserData() {
  let averageValuePerUser = 0;
  const [userCount, orderData] = await Promise.all([
    prisma.user.count(),
    prisma.order.aggregate({
      _sum: { pricePaidInCents: true }
    })
  ]);

  if (userCount)
    (averageValuePerUser = orderData._sum.pricePaidInCents || 0) / userCount;

  return {
    userCount,
    averageValuePerUser
  };
}

async function getProductData() {
  const [activeCount, inactiveCount] = await Promise.all([
    prisma.product.count({ where: { isAvailableForPurchase: true } }),
    prisma.product.count({ where: { isAvailableForPurchase: false } })
  ]);

  return { activeCount, inactiveCount };
}

export default async function AdminDashboard() {
  const [salesData, userData, productData] = await Promise.all([
    getSalesData(),
    getUserData(),
    getProductData()
  ]);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <AppCard
        title="Sales"
        subtitle={`${formatNumber(salesData.numberOfSales)} orders`}
        body={formatCurrency(salesData.amount / 100)}
      />
      <AppCard
        title="Customers"
        subtitle={`${formatCurrency(userData.averageValuePerUser / 100)} Average Value`}
        body={formatNumber(userData.userCount)}
      />
      <AppCard
        title="Active Products"
        subtitle={`${formatNumber(productData.inactiveCount)} inactive`}
        body={formatNumber(productData.activeCount)}
      />
    </div>
  );
}

export function AppCard(props: {
  body: string;
  title: string;
  subtitle: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{props.title}</CardTitle>
        <CardDescription>{props.subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{props.body}</p>
      </CardContent>
    </Card>
  );
}
