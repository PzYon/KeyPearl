using System.Linq;
using KeyPearl.Library.Entities.Links;
using KeyPearl.Library.Entities.Tags;
using KeyPearl.Library.Tests.TestTypes;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace KeyPearl.Library.Tests.UnitTests
{
  [TestClass]
  public class TaggerTests
  {
    private TestDbContext dbContext;

    [TestInitialize]
    public void Setup()
    {
      dbContext = new TestDbContext
      {
        Tags = new TestDbSet<Tag>
        {
          GetFirstLevelTag(),
          GetSecondLevelTag(),
          GetThirdLevelTag()
        }
      };
    }

    [TestMethod]
    public void EnsureTag_TagStringStartsWithPathSeparator()
    {
      var taggable = new Link();

      Tagger.EnsureTag(dbContext, taggable, new Tag { Id = 1, ParentId = 0 });

      Assert.IsTrue(taggable.TagString.StartsWith(Tagger.PathSeparator));
    }

    [TestMethod]
    public void EnsureTag_TagStringEndsWithPathSeparator()
    {
      var taggable = new Link();

      Tagger.EnsureTag(dbContext, taggable, new Tag { Id = 1, ParentId = 0 });

      Assert.IsTrue(taggable.TagString.EndsWith(Tagger.PathSeparator));
    }

    [TestMethod]
    public void EnsureTag_SetsFirstLevelTagString()
    {
      var taggable = new Link();

      Tagger.EnsureTag(dbContext, taggable, GetFirstLevelTag());

      Assert.AreEqual("/1/", taggable.TagString);
    }

    [TestMethod]
    public void EnsureTag_SetsSecondLevelTagString()
    {
      var taggable = new Link();

      Tagger.EnsureTag(dbContext, taggable, GetSecondLevelTag());

      Assert.AreEqual("/1/2/", taggable.TagString);
    }

    [TestMethod]
    public void EnsureTag_SetsThirdLevelTagString()
    {
      var taggable = new Link();

      Tagger.EnsureTag(dbContext, taggable, GetThirdLevelTag());

      Assert.AreEqual("/1/2/3/", taggable.TagString);
    }

    [TestMethod]
    public void EnsureTag_SetsTagOnlyOnce()
    {
      var taggable = new Link();

      Tag tag = GetFirstLevelTag();
      Tagger.EnsureTag(dbContext, taggable, tag);
      Tagger.EnsureTag(dbContext, taggable, tag);

      Assert.AreEqual("/1/", taggable.TagString);
    }

    [TestMethod]
    public void EnsureTag_SetsTwoDifferentTags()
    {
      var taggable = new Link();

      Tagger.EnsureTag(dbContext, taggable, GetFirstLevelTag());
      Tagger.EnsureTag(dbContext, taggable, GetSecondLevelTag());

      string[] tagStrings = taggable.TagString.Split(Tagger.Separator);

      Assert.IsTrue(tagStrings.Contains("/1/"));
      Assert.IsTrue(tagStrings.Contains("/1/2/"));
    }

    [TestMethod]
    public void EnsureTag_DoesNotDestroyExistingTags()
    {
      const string originalTagString = "/100/101/102/";

      var taggable = new Link {TagString = originalTagString};

      Tagger.EnsureTag(dbContext, taggable, GetSecondLevelTag());

      string[] tagStrings = taggable.TagString.Split(Tagger.Separator);
      Assert.IsTrue(tagStrings.Contains(originalTagString));
      Assert.IsTrue(tagStrings.Contains("/1/2/"));
    }

    private static Tag GetFirstLevelTag()
    {
      return new Tag { ParentId = 0, Id = 1 };
    }

    private static Tag GetSecondLevelTag()
    {
      return new Tag { ParentId = 1, Id = 2 };
    }

    private static Tag GetThirdLevelTag()
    {
      return new Tag { ParentId = 2, Id = 3 };
    }
  }
}
