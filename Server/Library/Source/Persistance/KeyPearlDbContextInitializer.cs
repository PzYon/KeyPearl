using System.Data.Entity;
using KeyPearl.Library.Entities.Links;
using KeyPearl.Library.Entities.Tags;

namespace KeyPearl.Library.Persistance
{
  public class KeyPearlDbContextInitializer : DropCreateDatabaseIfModelChanges<KeyPearlDbContext>
  {
    protected override void Seed(KeyPearlDbContext dbContext)
    {
      Tag classification = AddTag(dbContext, "classification");
      int classificationId = classification.Id;
      Tag mustRead = AddTag(dbContext, "must read", classificationId);
      Tag forTheRecord = AddTag(dbContext, "for the record", classificationId);

      Tag technical = AddTag(dbContext, "technical");
      Tag blogs = AddTag(dbContext, "blogs", technical.Id);
      Tag development = AddTag(dbContext, "development", technical.Id);
      int developmentId = development.Id;
      Tag cSharp = AddTag(dbContext, "C#", developmentId);
      Tag javaScript = AddTag(dbContext, "JavaScript", developmentId);
      Tag sharePoint = AddTag(dbContext, "SharePoint", developmentId);

      Tag funTag = AddTag(dbContext, "fun");

      AddLink(dbContext, "9gag", "http://www.9gag.com", "End of the internet.. If there's nothing else to do.", funTag);
      AddLink(dbContext, "GitHub", "http://www.github.com", "Where all good stuff comes from!", technical);
      AddLink(dbContext, "MSDN", "http://msdn.com", "Resources for C# devlopment", cSharp);
      AddLink(dbContext, "DailyJS", "http://dailyjs.com/", "Daily JavaScript news..", cSharp);
      AddLink(dbContext,
              "40 Blogs Every Software Developer Should Be Reading",
              "http://www.securityinnovationeurope.com/blog/40-blogs-every-software-developer-should-be-reading",
              "Great blog overview over of development-related blogs.",
              blogs,
              mustRead);

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