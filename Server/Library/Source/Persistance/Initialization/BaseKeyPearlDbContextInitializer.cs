using System.Data.Entity;
using KeyPearl.Library.Entities.Links;
using KeyPearl.Library.Entities.Tags;

namespace KeyPearl.Library.Persistance.Initialization
{
  public class BaseKeyPearlDbContextInitializer : DropCreateDatabaseIfModelChanges<KeyPearlDbContext>
  {
    protected static Tag AddTag(IDbContext dbContext, string name, int parentId = 0)
    {
      Tag tag = dbContext.Update(new Tag
        {
          Name = name,
          ParentId = parentId
        });

      dbContext.SaveChanges();

      return tag;
    }

    protected static void AddLink(IDbContext dbContext,
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

      dbContext.Update(link);
    }
  }
}