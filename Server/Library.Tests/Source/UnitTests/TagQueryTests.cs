using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using KeyPearl.Library.Entities.Links;
using KeyPearl.Library.Entities.Tags;
using KeyPearl.Library.Queries;
using KeyPearl.Library.Queries.Exceptions;
using KeyPearl.Library.Tests.TestTypes;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace KeyPearl.Library.Tests.UnitTests
{
  [TestClass]
  public class TagQueryTests
  {
    private const string tagString1 = "[/1/]";
    private const string tagString2 = "[/1/2/]";
    private const string tagString3 = "[/1/2/3/]";
    private const string tagString4 = "[/1/2/4/]";
    private const string tagString5 = "[/1/2/5/]";
    private const string tagString11 = "[/11/]";

    [TestMethod]
    [ExpectedException(typeof(InvalidTagQueryException))]
    public void Execute_TagQueryContainingLettersThrowsException()
    {
      TagQuery.Execute(GetTaggableDbSet(tagString3, tagString2), "3;a"); 
    }

    [TestMethod]
    [ExpectedException(typeof(InvalidTagQueryException))]
    public void Execute_TagQueryContainingSpacesThrowsException()
    {
      TagQuery.Execute(GetTaggableDbSet(tagString3, tagString2), "1; 2");
    }

    [TestMethod]
    [ExpectedException(typeof(InvalidTagQueryException))]
    public void Execute_EmptyTagQueryThrowsException()
    {
      TagQuery.Execute(GetTaggableDbSet(tagString3, tagString2), "");
    }

    [TestMethod]
    [ExpectedException(typeof(InvalidTagQueryException))]
    public void Execute_NullTagQueryThrowsException()
    {
      TagQuery.Execute(GetTaggableDbSet(tagString3, tagString2), null);
    }

    [TestMethod]
    public void Execute_FiltersTaggablesWithOneCondition()
    {
      DbSet<Link> taggables = GetTaggableDbSet(tagString3, tagString2);
      IEnumerable<ITaggable> filtered = TagQuery.Execute(taggables, "3");

      Assert.AreEqual(1, filtered.Count());
    }

    [TestMethod]
    public void Execute_FiltersTaggablesWithTwoConditions()
    {
      DbSet<Link> taggables = GetTaggableDbSet(tagString3 + ";" + tagString4, tagString5);
      IEnumerable<ITaggable> filtered = TagQuery.Execute(taggables, "3;4");

      Assert.AreEqual(1, filtered.Count());
    }

    [TestMethod]
    public void Execute_FiltersByInheritedTags()
    {
      DbSet<Link> taggables = GetTaggableDbSet(tagString3 + ";" + tagString4, tagString5);
      IEnumerable<ITaggable> filtered = TagQuery.Execute(taggables, "2");

      Assert.AreEqual(2, filtered.Count());
    }

    [TestMethod]
    public void Execute_ReturnsEmptyIfNoConditionMatches()
    {
      DbSet<Link> taggables = GetTaggableDbSet(tagString2, tagString3);
      IEnumerable<ITaggable> filtered = TagQuery.Execute(taggables, "4");

      Assert.AreEqual(0, filtered.Count());
    }

    [TestMethod]
    public void Execute_ReturnsEmptyIfNotAllConditionsMatch()
    {
      DbSet<Link> taggables = GetTaggableDbSet(tagString2, tagString4);
      IEnumerable<ITaggable> filtered = TagQuery.Execute(taggables, "2;3");

      Assert.AreEqual(0, filtered.Count());
    }

    [TestMethod]
    public void Execute_ReturnsEmptyIfTagStringIsNullOrEmpty()
    {
      DbSet<Link> taggables = GetTaggableDbSet("", null);
      IEnumerable<ITaggable> filtered = TagQuery.Execute(taggables, "1");

      Assert.AreEqual(0, filtered.Count());
    }

    [TestMethod]
    public void Execute_MatchesOnlyWholeId()
    {
      DbSet<Link> taggables = GetTaggableDbSet(tagString11);
      IEnumerable<ITaggable> filtered = TagQuery.Execute(taggables, "1");

      Assert.AreEqual(0, filtered.Count());
    }

    private static DbSet<Link> GetTaggableDbSet(params string[] tagStrings)
    {
      DbSet<Link> testDbSet = new TestDbSet<Link>();
      foreach (string tagString in tagStrings)
      {
        testDbSet.Add(new Link { TagString = tagString });
      }
      return testDbSet;
    }
  }
}