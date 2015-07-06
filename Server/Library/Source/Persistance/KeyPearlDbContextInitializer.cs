using System.Data.Entity;
using KeyPearl.Library.Entities.Links;
using KeyPearl.Library.Entities.Tags;

namespace KeyPearl.Library.Persistance
{
  public class KeyPearlDbContextInitializer : DropCreateDatabaseIfModelChanges<KeyPearlDbContext>
  {
    protected override void Seed(KeyPearlDbContext dbContext)
    {
      Tag classificationTag = AddTag(dbContext, "classification");

      int parentTagId = classificationTag.Id;
      Tag urgentTag = AddTag(dbContext, "urgent", parentTagId);
      Tag forTheRecordTag = AddTag(dbContext, "for the record", parentTagId);

      Tag fooTag = AddTag(dbContext, "foo");
      
      AddLink(dbContext, "Google", "http://www.google.ch", "Entrypoint of the internet...", forTheRecordTag);
      AddLink(dbContext, "9gag", "http://www.9gag.com", "End of the internet...", urgentTag);
      AddLink(dbContext, "GitHub", "http://www.github.com", "Where all good stuff comes from!", forTheRecordTag, fooTag);

      dbContext.SaveChanges();
    }

    private static Tag AddTag(KeyPearlDbContext dbContext, string name, int parentId = 0)
    {
      var tag = new Tag
      {
        Name = name,
        ParentId = parentId
      };

      dbContext.Tags.Add(tag);

      dbContext.SaveChanges();

      return tag;
    }

    private static void AddLink(KeyPearlDbContext dbContext,
                                string name,
                                string url,
                                string description = null,
                                params Tag[] tags)
    {
      var link = new Link
      {
        Name = name,
        Url = url,
        Description = description
      };

      TagManager.EnsureTags(dbContext, link, tags);

      dbContext.Links.Add(link);
    }
  }
}