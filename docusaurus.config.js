/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: "Sparkle",
  url: "https://your-docusaurus-test-site.com",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/logo.svg",
  organizationName: "elimerl", // Usually your GitHub org/user name.
  projectName: "sparkle", // Usually your repo name.
  themeConfig: {
    navbar: {
      title: "Sparkle",
      logo: {
        alt: "Site Logo",
        src: "img/logo.svg",
      },
      items: [
        {
          to: "/",
          activeBasePath: "docs",
          label: "Docs",
          position: "left",
        },
        {
          href: "https://github.com/elimerl/sparkle",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Getting Started",
              to: "/",
            },
          ],
        },
        {
          items: [
            {
              label: "GitHub",
              href: "https://github.com/elimerl/sparkle",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} <a href="https://github.com/elimerl">elimerl</a>. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          editUrl: "https://github.com/elimerl/sparkle/edit/master/docs/",
          routeBasePath: "/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],
};
