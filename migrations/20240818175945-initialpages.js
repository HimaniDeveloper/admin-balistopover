module.exports = {
  async up(db, client) {
    const admin = await db
      .collection("users")
      .findOne({ username: "baalistopover" });

    if (!admin) {
      throw new Error(
        "admin user not found. Make sure the admin user exists before running this migration.",
      );
    }

    const userId = admin._id;

    const pages = [
      {
        title: "About Us",
        slug: "about-us",
        metaTags: "about us, company, information",
        metaDescription:
          "Learn more about our company, our mission, and our values.",
        content:
          "<p>Welcome to our company! Here is some information about us.</p>",
        createdBy: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Privacy Policy",
        slug: "privacy-policy",
        metaTags: "privacy, policy, data protection",
        metaDescription:
          "Read our privacy policy to understand how we protect your data.",
        content:
          "<p>Your privacy is important to us. Here's how we protect it.</p>",
        createdBy: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Terms and Conditions",
        slug: "terms-conditions",
        metaTags: "terms, conditions, usage",
        metaDescription:
          "Review our terms and conditions for using our services.",
        content:
          "<p>These are the terms and conditions for using our services.</p>",
        createdBy: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Refund Policy",
        slug: "refund-policy",
        metaTags: "refund, policy, returns",
        metaDescription:
          "Understand our refund policy and how to return products.",
        content:
          "<p>Our refund policy explains how to return products and get a refund.</p>",
        createdBy: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Site Map",
        slug: "site-map",
        metaTags: "site, map, navigation",
        metaDescription: "Find your way around our website with our site map.",
        content: "<p>Here's a map of our website to help you navigate.</p>",
        createdBy: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await db.collection("pages").insertMany(pages);
  },

  async down(db, client) {
    await db.collection("pages").deleteMany({
      slug: {
        $in: [
          "about-us",
          "privacy-policy",
          "terms-conditions",
          "refund-policy",
          "site-map",
        ],
      },
    });
  },
};
