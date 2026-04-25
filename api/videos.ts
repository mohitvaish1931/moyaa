export default async (_req: any, res: any) => {
  const videos = [
    {
      id: '1',
      title: 'Elegant Gold Collection',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      id: '2',
      title: 'Diamond Showcase',
      url: 'https://www.youtube.com/embed/jNQXAC9IVRw'
    },
    {
      id: '3',
      title: 'Luxury Bracelets Tour',
      url: 'https://www.youtube.com/embed/9bZkp7q19f0'
    }
  ];
  res.json(videos);
};
