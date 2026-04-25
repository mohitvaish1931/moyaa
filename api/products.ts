export default async (_req: any, res: any) => {
  // Mock products data for Vercel deployment
  const products = [
    {
      id: 1,
      name: 'CHERISH EARRING',
      price: 799,
      originalPrice: 1200,
      image: 'https://images.pexels.com/photos/1191536/pexels-photo-1191536.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'earrings',
      sale: true,
      description: 'Premium gold earrings',
      features: ['14K Gold', 'Diamond Cut'],
      materials: ['Gold', 'Diamond'],
      careInstructions: ['Handle with care']
    }
  ];
  
  res.json(products);
};
