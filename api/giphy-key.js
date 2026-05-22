export default function handler(req, res) {
  // Add a caching header to keep the endpoint fast and optimized
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
  res.status(200).json({
    key: process.env.NEXT_PUBLIC_GIPHY_KEY || "ncPJZIopUbyDU1R3KfSFqP2TR2shfx4L"
  });
}
