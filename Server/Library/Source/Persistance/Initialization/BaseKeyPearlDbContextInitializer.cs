using System.Data.Entity;
using KeyPearl.Library.Entities.Links;
using KeyPearl.Library.Entities.Tags;

namespace KeyPearl.Library.Persistance.Initialization
{
  public class BaseKeyPearlDbContextInitializer : DropCreateDatabaseIfModelChanges<KeyPearlDbContext>
  {
    protected static Tag AddTag(KeyPearlDbContext dbContext, string name, int parentId = 0)
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

    protected static void AddLink(KeyPearlDbContext dbContext,
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
