using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using KeyPearl.Library.Entities.Links;
using KeyPearl.Library.Queries;
using KeyPearl.Library.Tests.TestTypes;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace KeyPearl.Library.Tests.UnitTests
{
  [TestClass]
  public class QueryExecutorTests
  {
    [TestMethod]
    public void Execute_ConsidersStringSearch()
    {
      Assert.AreEqual(1, GetFilteredData(null, "foo").Count());
    }

    [TestMethod]
    public void Execute_ConsidersTags()
    {
      Assert.AreEqual(1, GetFilteredData("4;3", null).Count());
    }

    [TestMethod]
    public void Execute_ConsidersStringSearchAndTags()
    {
      Assert.AreEqual(1, GetFilteredData("4", "X").Count());
    }

    [TestMethod]
    public void Execute_ConsidersStringSearch_Negative()
    {
      Assert.AreEqual(0, GetFilteredData(null, "bar").Count());
    }

    [TestMethod]
    public void Execute_ConsidersTags_Negative()
    {
      Assert.AreEqual(0, GetFilteredData("4;3;7", null).Count());
    }

    [TestMethod]
    public void Execute_ConsidersStringSearchAndTags_Negative()
    {
      Assert.AreEqual(0, GetFilteredData("4", "Z").Count());
    }

    [TestMethod]
    public void Execute_GetsMultipleItems()
    {
      Assert.AreEqual(5, GetFilteredData(null, "test").Count());
    }

    private static IEnumerable<Link> GetFilteredData(string tagIds, string searchString)
    {
      DbSet<Link> links = GetTestData("foo X", String.Empty, null, "/1/2/3/;/1/2/4/");
      return QueryExecutor.Execute(links, GetQueryString(tagIds, searchString));
    }

    private static DbSet<Link> GetTestData(string name, string description, string url, string tagString)
    {
      DbSet<Link> testDbSet = new TestDbSet<Link>();

      testDbSet.Add(new Link
      {
        TagString = tagString,
        Description = description,
        Url = url,
        Name = name
      });

      // add some dummy links
      for (int i = 0; i < 5; i++)
      {
        string test = "test link " + i;
        testDbSet.Add(new Link()
        {
          Description = test,
          Name = test,
          TagString = "/5/6/7/"
        });
      }

      return testDbSet;
    }

    private static string GetQueryString(string tagIds, string searchString)
    {
      var query = new StringBuilder();

      if (!String.IsNullOrEmpty(tagIds))
      {
        query.AppendFormat("$tagIds({0})", tagIds);
      }

      if (!String.IsNullOrEmpty(searchString))
      {
        query.AppendFormat("$searchString({0})", searchString);
      }

      return query.ToString();
    }
  }
}