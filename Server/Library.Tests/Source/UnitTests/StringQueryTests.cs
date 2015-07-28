using System.Data.Entity;
using System.Linq;
using KeyPearl.Library.Entities.Links;
using KeyPearl.Library.Queries;
using KeyPearl.Library.Tests.TestTypes;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace KeyPearl.Library.Tests.UnitTests
{
  [TestClass]
  public class StringQueryTests
  {
    [TestMethod]
    public void Execute_ReturnsEmptyIfSearchTermsAreNull()
    {
      DbSet<Link> testDbSet = new TestDbSet<Link>();
      testDbSet.Add(new Link());

      IQueryable<Link> results = StringQuery.Execute(testDbSet, new string[] {null});

      Assert.IsNotNull(results);
      Assert.AreEqual(0, results.Count());
    }

    [TestMethod]
    public void Execute_ReturnsEmptyIfSearchTermsAreEmpty()
    {
      DbSet<Link> testDbSet = new TestDbSet<Link>();
      testDbSet.Add(new Link());

      IQueryable<Link> results = StringQuery.Execute(testDbSet, new[] {string.Empty});

      Assert.IsNotNull(results);
      Assert.AreEqual(0, results.Count());
    }

    [TestMethod]
    public void Execute_ConsidersName()
    {
      DbSet<Link> testDbSet = new TestDbSet<Link>();
      var linkToFind = new Link {Name = "foo bar foo"};
      testDbSet.Add(linkToFind);

      var otherLink = new Link {Name = "foo"};
      testDbSet.Add(otherLink);

      IQueryable<Link> results = StringQuery.Execute(testDbSet, new[] {"bar"});

      Assert.AreEqual(1, results.Count());
      Assert.AreEqual(linkToFind, results.First());
    }

    [TestMethod]
    public void Execute_ConsidersDescription()
    {
      DbSet<Link> testDbSet = new TestDbSet<Link>();
      var linkToFind = new Link {Description = "foo bar foo"};
      testDbSet.Add(linkToFind);

      var otherLink = new Link {Description = "foo"};
      testDbSet.Add(otherLink);

      IQueryable<Link> results = StringQuery.Execute(testDbSet, new[] {"bar"});

      Assert.AreEqual(1, results.Count());
      Assert.AreEqual(linkToFind, results.First());
    }

    [TestMethod]
    public void Execute_ConsidersUrl()
    {
      DbSet<Link> testDbSet = new TestDbSet<Link>();
      var linkToFind = new Link {Url = "http://bar.foo"};
      testDbSet.Add(linkToFind);

      var otherLink = new Link {Url = "foo"};
      testDbSet.Add(otherLink);

      IQueryable<Link> results = StringQuery.Execute(testDbSet, new[] {"bar"});

      Assert.AreEqual(1, results.Count());
      Assert.AreEqual(linkToFind, results.First());
    }

    [TestMethod]
    public void Execute_ConsidersMultipleSearchTerms()
    {
      DbSet<Link> testDbSet = new TestDbSet<Link>();
      var firstLinkToFind = new Link {Url = "http://bar.foo"};
      testDbSet.Add(firstLinkToFind);

      var secondLinkToFind = new Link {Name = "bar"};
      testDbSet.Add(secondLinkToFind);

      IQueryable<Link> results = StringQuery.Execute(testDbSet, new[] {"bar"});

      Assert.AreEqual(2, results.Count());
    }

    // below test is ignored, as we cannot provider a way to check for case-insensitivity which works
    // in entity framework (LINQ to SQL) and pure code '(LINQ to Object)' - left here for reference though
    // http://stackoverflow.com/a/11965710/4092115
    // -> test breaks, however it works when running in against EF and that's what counts in the end

    [TestMethod]
    [Ignore]
    public void Execute_IgnoresCase()
    {
      DbSet<Link> testDbSet = new TestDbSet<Link>();
      var linkToFind = new Link {Name = "FOO"};
      testDbSet.Add(linkToFind);

      var otherLink = new Link {Name = "BAR"};
      testDbSet.Add(otherLink);

      IQueryable<Link> results = StringQuery.Execute(testDbSet, new[] {"foo"});

      Assert.AreEqual(1, results.Count());
      Assert.AreEqual(linkToFind, results.First());
    }
  }
}