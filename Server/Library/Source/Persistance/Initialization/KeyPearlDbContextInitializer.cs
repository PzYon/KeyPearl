using KeyPearl.Library.Entities.Tags;

namespace KeyPearl.Library.Persistance.Initialization
{
  public class KeyPearlDbContextInitializer : BaseKeyPearlDbContextInitializer
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
  }
}