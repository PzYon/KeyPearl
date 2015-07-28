using KeyPearl.Library.Queries;
using KeyPearl.Library.Queries.Exceptions;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace KeyPearl.Library.Tests.UnitTests
{
  [TestClass]
  public class QueryParamsTests
  {
    [TestMethod]
    [ExpectedException(typeof (InvalidQueryException))]
    public void Parse_ThrowsWhenEmptyQueryString()
    {
      QueryParams.Parse(string.Empty);
    }

    [TestMethod]
    [ExpectedException(typeof (InvalidQueryException))]
    public void Parse_ThrowsWhenNullQueryString()
    {
      QueryParams.Parse(null);
    }

    [TestMethod]
    [ExpectedException(typeof (InvalidQueryException))]
    public void Parse_ThrowsWhenInvalidQueryString()
    {
      QueryParams.Parse("$this(is wrong)");
    }

    [TestMethod]
    public void Parse_OnlySetsTagIdsProperty()
    {
      QueryParams result = QueryParams.Parse("$tagIds(1)");

      Assert.AreEqual(result.TagIds, "1");
      Assert.AreEqual(result.SearchStrings, null);
    }

    [TestMethod]
    public void Parse_OnlySetsSearchStringProperty()
    {
      QueryParams result = QueryParams.Parse("$searchString(foo)");

      Assert.AreEqual(result.TagIds, null);
      Assert.AreEqual(result.SearchStrings.Length, 1);
      Assert.AreEqual(result.SearchStrings[0], "foo");
    }

    [TestMethod]
    public void Parse_SetsBothProperties()
    {
      QueryParams result = QueryParams.Parse("$tagIds(1)$searchString(foo)");

      Assert.AreEqual(result.TagIds, "1");
      Assert.AreEqual(result.SearchStrings.Length, 1);
      Assert.AreEqual(result.SearchStrings[0], "foo");
    }

    [TestMethod]
    public void Parse_OrderDoesNotMatter()
    {
      QueryParams result = QueryParams.Parse("$searchString(foo)$tagIds(1)");

      Assert.AreEqual(result.TagIds, "1");
      Assert.AreEqual(result.SearchStrings.Length, 1);
      Assert.AreEqual(result.SearchStrings[0], "foo");
    }

    [TestMethod]
    public void Parse_SearchStringsPropertyConsidersWhitespaces()
    {
      QueryParams result = QueryParams.Parse("$searchString(foo bar)");

      Assert.AreEqual(result.TagIds, null);
      Assert.AreEqual(result.SearchStrings.Length, 2);
      Assert.AreEqual(result.SearchStrings[0], "foo");
      Assert.AreEqual(result.SearchStrings[1], "bar");
    }
  }
}