using System.Collections.Generic;
using System.Linq;
using KeyPearl.Library.Entities.Links;
using KeyPearl.Library.Entities.Tags;
using KeyPearl.Library.Tests.TestTypes;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace KeyPearl.Library.Tests.UnitTests
{
  // todo: consider adding CompareTagStrings(s1, s2) method
  // either simply for unit tests (in this class) or in TagManager

  [TestClass]
  public class TagManagerTests
  {
    private TestDbContext dbContext;

    private const string lv1TagString = "[/1/]";
    private const string lv2TagString = "[/1/2/]";
    private const string lv3TagString = "[/1/2/3/]";
    private const string otherLv1TagString = "[/4/]";
    private const string otherLv2TagString = "[/4/5/]";

    [TestInitialize]
    public void Setup()
    {
      dbContext = new TestDbContext
        {
          Tags = new TestDbSet<Tag>
            {
              GetLv1Tag(),
              GetLv2Tag(),
              GetLv3Tag(),
              GetOtherLv1Tag(),
              GetOtherLv2Tag()
            },
          Links = new TestDbSet<Link>
            {
              new Link {Id = 1, TagString = lv2TagString}
            }
        };
    }

    [TestMethod]
    public void UpdateTags_TagStringIsUpdatedWhenTagHierarchyOfLeafChildChanges()
    {
      Tag tagToUpdate = GetLv2Tag();
      tagToUpdate.ParentId = 4;

      TagManager.UpdateTags(dbContext, new List<Tag> {tagToUpdate});

      Link link = dbContext.Links.FirstOrDefault(l => l.Id == 1);
      Assert.AreEqual("[/4/2/]", link.TagString);
    }

    [TestMethod]
    public void UpdateTags_TagStringIsUpdatedWhenTagHierarchyOfNonLeafChildChanges()
    {
      Tag tagToUpdate = GetLv1Tag();
      tagToUpdate.ParentId = 4;

      TagManager.UpdateTags(dbContext, new List<Tag> {tagToUpdate});

      Link link = dbContext.Links.FirstOrDefault(l => l.Id == 1);
      Assert.AreEqual("[/4/1/2/]", link.TagString);
    }

    [TestMethod]
    public void GetIdsFromTagString_ReturnsEmptyWhenEmpty()
    {
      Assert.AreEqual(0,
                      TagManager.GetIdsFromTagString(string.Empty)
                                .Length);
    }

    [TestMethod]
    public void GetIdsFromTagString_ReturnsEmptyWhenNull()
    {
      Assert.AreEqual(0,
                      TagManager.GetIdsFromTagString(null)
                                .Length);
    }

    [TestMethod]
    public void GetIdsFromTagString_ReturnIdFromSingleTag()
    {
      int[] tagIds = TagManager.GetIdsFromTagString("[/123/]");
      Assert.AreEqual(1, tagIds.Length);
      Assert.AreEqual(123, tagIds[0]);
    }

    [TestMethod]
    public void GetIdsFromTagString_ReturnIdFromTagPath()
    {
      int[] tagIds = TagManager.GetIdsFromTagString(lv3TagString);
      Assert.AreEqual(1, tagIds.Length);
      Assert.AreEqual(3, tagIds[0]);
    }

    [TestMethod]
    public void GetIdsFromTagString_ReturnIdsFromTagPath()
    {
      int[] tagIds = TagManager.GetIdsFromTagString(lv3TagString + ";" + otherLv2TagString);
      Assert.AreEqual(2, tagIds.Length);
      Assert.AreEqual(3, tagIds[0]);
      Assert.AreEqual(5, tagIds[1]);
    }

    [TestMethod]
    public void GetIdsFromTagString_ReturnsSortedIds()
    {
      int[] tagIds = TagManager.GetIdsFromTagString("[/30/];[/50/];[/10/]");
      Assert.AreEqual(3, tagIds.Length);
      Assert.AreEqual(10, tagIds[0]);
      Assert.AreEqual(30, tagIds[1]);
      Assert.AreEqual(50, tagIds[2]);
    }

    [TestMethod]
    public void SyncTagStringWithTagIds_TagStringMatchesAfterSyncWithOneTag()
    {
      var updatedTaggable = new Link {Id = 1, TagIds = new[] {3}};
      TagManager.SyncTagStringWithTagIds(dbContext, updatedTaggable);

      Assert.AreEqual(lv3TagString, updatedTaggable.TagString);
    }

    [TestMethod]
    public void SyncTagStringWithTagIds_TagStringMatchesAfterSyncWithTwoTags()
    {
      var updatedTaggable = new Link {Id = 1, TagIds = new[] {3, 1}};
      TagManager.SyncTagStringWithTagIds(dbContext, updatedTaggable);

      string[] tagPaths = updatedTaggable.TagString.Split(TagManager.Separator);
      Assert.IsTrue(tagPaths.Contains(lv1TagString));
      Assert.IsTrue(tagPaths.Contains(lv3TagString));
    }

    [TestMethod]
    public void SyncTagStringWithTagIds_PreviousTagsAreRemovedIfNotInTagIds()
    {
      var updatedTaggable = new Link {Id = 1, TagString = lv2TagString, TagIds = new[] {1}};
      TagManager.SyncTagStringWithTagIds(dbContext, updatedTaggable);

      string[] tagPaths = updatedTaggable.TagString.Split(TagManager.Separator);
      Assert.AreEqual(1, tagPaths.Length);
      Assert.IsTrue(tagPaths.Contains(lv1TagString));
    }

    [TestMethod]
    public void EnsureTag_TagStringStartsWithPathStarterAndPathSeparator()
    {
      var taggable = new Link();

      TagManager.EnsureTag(dbContext, taggable, new Tag {Id = 1, ParentId = 0});

      Assert.IsTrue(taggable.TagString.StartsWith(TagManager.PathStarter.ToString() + TagManager.PathSeparator));
    }

    [TestMethod]
    public void EnsureTag_TagStringEndsWithPathSeparatorAndPathEnder()
    {
      var taggable = new Link();

      TagManager.EnsureTag(dbContext, taggable, new Tag {Id = 1, ParentId = 0});

      Assert.IsTrue(taggable.TagString.EndsWith(TagManager.PathSeparator + TagManager.PathEnder.ToString()));
    }

    [TestMethod]
    public void EnsureTag_SetsFirstLevelTagString()
    {
      var taggable = new Link();

      TagManager.EnsureTag(dbContext, taggable, GetLv1Tag());

      Assert.AreEqual(lv1TagString, taggable.TagString);
    }

    [TestMethod]
    public void EnsureTag_SetsSecondLevelTagString()
    {
      var taggable = new Link();

      TagManager.EnsureTag(dbContext, taggable, GetLv2Tag());

      Assert.AreEqual(lv2TagString, taggable.TagString);
    }

    [TestMethod]
    public void EnsureTag_SetsThirdLevelTagString()
    {
      var taggable = new Link();

      TagManager.EnsureTag(dbContext, taggable, GetLv3Tag());

      Assert.AreEqual(lv3TagString, taggable.TagString);
    }

    [TestMethod]
    public void EnsureTag_SetsTagOnlyOnce()
    {
      var taggable = new Link();

      Tag tag = GetLv1Tag();
      TagManager.EnsureTag(dbContext, taggable, tag);
      TagManager.EnsureTag(dbContext, taggable, tag);

      Assert.AreEqual(lv1TagString, taggable.TagString);
    }

    [TestMethod]
    public void EnsureTag_SetsTwoDifferentTags()
    {
      var taggable = new Link();

      TagManager.EnsureTag(dbContext, taggable, GetLv1Tag());
      TagManager.EnsureTag(dbContext, taggable, GetOtherLv2Tag());

      string[] tagStrings = taggable.TagString.Split(TagManager.Separator);
      Assert.IsTrue(tagStrings.Contains(lv1TagString));
      Assert.IsTrue(tagStrings.Contains(otherLv2TagString));
    }

    [TestMethod]
    public void EnsureTag_DoesNotDestroyExistingTags()
    {
      const string originalTagString = "[/100/101/102/]";

      var taggable = new Link {TagString = originalTagString};

      TagManager.EnsureTag(dbContext, taggable, GetLv2Tag());

      string[] tagStrings = taggable.TagString.Split(TagManager.Separator);
      Assert.IsTrue(tagStrings.Contains(originalTagString));
      Assert.IsTrue(tagStrings.Contains(lv2TagString));
    }

    [TestMethod]
    public void EnsureTag_SetsParentTagOfAlreadySetTag()
    {
      var taggable = new Link {TagString = lv3TagString};

      TagManager.EnsureTag(dbContext, taggable, GetLv1Tag());

      string[] tagPaths = taggable.TagString.Split(TagManager.Separator);
      Assert.AreEqual(2, tagPaths.Length);
      Assert.IsTrue(tagPaths.Contains(lv3TagString));
      Assert.IsTrue(tagPaths.Contains(lv1TagString));
    }

    [TestMethod]
    public void EnsureTag_SetsChildTagOfAlreadySetTag()
    {
      var taggable = new Link {TagString = lv1TagString};

      TagManager.EnsureTag(dbContext, taggable, GetLv3Tag());

      string[] tagPaths = taggable.TagString.Split(TagManager.Separator);
      Assert.AreEqual(2, tagPaths.Length);
      Assert.IsTrue(tagPaths.Contains(lv3TagString));
      Assert.IsTrue(tagPaths.Contains(lv1TagString));
    }

    [TestMethod]
    public void TagStringToTagIdsToTagString_ProducesOriginalTagString()
    {
      string originalTagString = lv1TagString + TagManager.Separator + otherLv2TagString;

      var firstTaggable = new Link {TagString = originalTagString};
      int[] tagIds = TagManager.GetIdsFromTagString(firstTaggable.TagString);

      var secondTaggable = new Link {TagIds = tagIds};
      TagManager.SyncTagStringWithTagIds(dbContext, secondTaggable);

      Assert.AreEqual(originalTagString, secondTaggable.TagString);
    }

    [TestMethod]
    public void RemoveTag_RemovesAppliedTag()
    {
      var originalTagString = "[/1/2/3/];[/4/5/6/]";
      var taggable = new Link {TagString = originalTagString};
      TagManager.RemoveTag(taggable, 3);

      Assert.AreEqual("[/4/5/6/]", taggable.TagString);
    }

    [TestMethod]
    public void RemoveTag_RemovesInheritedTag()
    {
      var originalTagString = "[/1/2/3/];[/4/5/6/]";
      var taggable = new Link { TagString = originalTagString };
      TagManager.RemoveTag(taggable, 2);

      Assert.AreEqual("[/4/5/6/]", taggable.TagString);
    }

    [TestMethod]
    public void RemoveTag_RemovesMultipleInheritedTag()
    {
      var originalTagString = "[/1/2/3/];[/1/2/15/];[/4/5/6/]";
      var taggable = new Link { TagString = originalTagString };
      TagManager.RemoveTag(taggable, 2);

      Assert.AreEqual("[/4/5/6/]", taggable.TagString);
    }

    private static Tag GetLv1Tag()
    {
      return new Tag {ParentId = 0, Id = 1};
    }

    private static Tag GetLv2Tag()
    {
      return new Tag {ParentId = 1, Id = 2};
    }

    private static Tag GetLv3Tag()
    {
      return new Tag {ParentId = 2, Id = 3};
    }

    private static Tag GetOtherLv1Tag()
    {
      return new Tag {ParentId = 0, Id = 4};
    }

    private static Tag GetOtherLv2Tag()
    {
      return new Tag {ParentId = 4, Id = 5};
    }
  }
}