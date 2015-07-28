using System;
using System.Collections.Generic;
using KeyPearl.Library.Entities.Links;
using KeyPearl.Library.Entities.Tags;

namespace KeyPearl.Library.Persistance.Initialization
{
  public class KeyPearlDbContextLoadInitializer : BaseKeyPearlDbContextInitializer
  {
    private const int numberOfTags = 1000;
    private const int numberOfLinks = 1000;

    private readonly Random random = new Random();

    protected override void Seed(KeyPearlDbContext dbContext)
    {
      AddTags(dbContext);
      dbContext.SaveChanges();

      AddLinks(dbContext);
      dbContext.SaveChanges();
    }

    private void AddLinks(IDbContext dbContext)
    {
      for (var i = 1; i <= numberOfLinks; i++)
      {
        var link = new Link
          {
            Description = GetRandomString(20),
            Id = i,
            Name = GetRandomString(5),
            TagIds = GetRandomTagIds()
          };

        TagManager.SyncTagStringWithTagIds(dbContext, link, true);

        dbContext.Links.Add(link);
      }
    }

    private void AddTags(IDbContext dbContext)
    {
      for (var i = 1; i <= numberOfTags; i++)
      {
        var tag = new Tag
          {
            Id = i,
            Name = "Random Tag " + i,
            ParentId = random.Next(i)
          };

        dbContext.Tags.Add(tag);
      }
    }

    private int[] GetRandomTagIds()
    {
      var tagIds = new List<int>();
      for (var j = 0; j < random.Next(10); j++)
      {
        tagIds.Add(random.Next(1, numberOfTags));
      }
      return tagIds.ToArray();
    }

    private string GetRandomString(int maxLength)
    {
      var randomWords = new List<string>();
      for (var j = 0; j < random.Next(2, maxLength); j++)
      {
        randomWords.Add(words[random.Next(words.Length)]);
      }
      return string.Join(" ", randomWords);
    }

    // added at the bottom of the file to increase readability
    private readonly string[] words =
      {
        "Fusce",
        "id",
        "nibh",
        "ac",
        "diam",
        "sollicitudin",
        "eleifend",
        "vel",
        "iaculis",
        "leo",
        "Aliquam",
        "eget",
        "diam",
        "interdum",
        "pharetra",
        "dolor",
        "et",
        "auctor",
        "neque",
        "Suspendisse",
        "dapibus",
        "congue",
        "rutrum",
        "Donec",
        "lobortis",
        "eros",
        "dolor",
        "non",
        "ornare",
        "sapien",
        "interdum",
        "vitae",
        "Interdum",
        "et",
        "malesuada",
        "fames",
        "ac",
        "ante",
        "ipsum",
        "primis",
        "in",
        "faucibus",
        "Pellentesque"
      };
  }
}