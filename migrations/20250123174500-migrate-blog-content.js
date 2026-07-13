module.exports = {
    async up(db, client) {
      const blogPages = await db.collection('blogs').find({}).toArray();
  
      for (const blog of blogPages) {
        if (blog.content) {
          const { insertedId } = await db.collection('blogcontents').insertOne({
            content: blog.content,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
  
          await db.collection('blogs').updateOne(
            { _id: blog._id },
            { $set: { content: insertedId } }
          );
        }
      }
    },
  
    async down(db, client) {
      const blogContents = await db.collection('blogcontents').find({}).toArray();
  
      for (const blogContent of blogContents) {
        const { _id, content } = blogContent;
        await db.collection('blogs').updateOne(
          { content: _id },
          { $set: { content } }
        );
      }
  
      await db.collection('blogcontents').deleteMany({});
    },
  };
  