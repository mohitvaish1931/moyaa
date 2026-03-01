export default async (_req: any, res: any) => {
  const banners = [
    {
      id: '1',
      text: 'FREE SHIPPING ON ORDERS OVER $100',
      type: 'info'
    },
    {
      id: '2',
      text: 'LIMITED TIME: 30% OFF ON SELECTED ITEMS',
      type: 'hot'
    },
    {
      id: '3',
      text: 'NEW COLLECTION JUST ARRIVED',
      type: 'new'
    }
  ];
  res.json(banners);
};
