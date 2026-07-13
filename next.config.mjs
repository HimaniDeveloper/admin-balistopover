/** @type {import('next').NextConfig} */
const nextConfig = {
  // jodit-react creates an imperative editor instance in an effect, which React
  // StrictMode double-invokes in dev — that leaves a broken/duplicate editor and
  // makes content vanish or reset while editing. Disabling Strict Mode keeps a
  // single, stable Jodit instance.
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: "/static/developmentme/envscrtcrd",
        destination: "/api/me/mycred",
      },
    ];
  },
};

export default nextConfig;
