using KeyPearl.Library.Entities.Tags;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace KeyPearl.Library.Tests.UnitTests
{
  [TestClass]
  public class TagStringValidationTests
  {
    [TestMethod]
    [ExpectedException(typeof (InvalidTagStringException))]
    public void EnsureValidTagString_ThrowsWhenSimpleDigit()
    {
      TagManager.EnsureValidTagString("1");
    }

    [TestMethod]
    [ExpectedException(typeof (InvalidTagStringException))]
    public void EnsureValidTagString_ThrowsWhenLetter()
    {
      TagManager.EnsureValidTagString("[/1/a/]");
    }

    [TestMethod]
    [ExpectedException(typeof (InvalidTagStringException))]
    public void EnsureValidTagString_ThrowsWhenPathStarterAndEnderIsMissing()
    {
      TagManager.EnsureValidTagString("/1/2/");
    }

    [TestMethod]
    [ExpectedException(typeof (InvalidTagStringException))]
    public void EnsureValidTagString_ThrowsWhenPathSeparatorsAreMissingButEndersAreThere()
    {
      TagManager.EnsureValidTagString("[1/2]");
    }

    [TestMethod]
    [ExpectedException(typeof (InvalidTagStringException))]
    public void EnsureValidTagString_ThrowsWhenStartingPathSeparatorIsMissing()
    {
      TagManager.EnsureValidTagString("1/2/");
    }

    [TestMethod]
    [ExpectedException(typeof (InvalidTagStringException))]
    public void EnsureValidTagString_ThrowsWhenEndingPathSeparatorIsMissing()
    {
      TagManager.EnsureValidTagString("/1/2");
    }

    [TestMethod]
    [ExpectedException(typeof (InvalidTagStringException))]
    public void EnsureValidTagString_ThrowsWhenMissingStartElement()
    {
      TagManager.EnsureValidTagString("/1/2/]");
    }

    [TestMethod]
    [ExpectedException(typeof (InvalidTagStringException))]
    public void EnsureValidTagString_ThrowsWhenMissingEndElement()
    {
      TagManager.EnsureValidTagString("[/1/2/");
    }

    [TestMethod]
    [ExpectedException(typeof (InvalidTagStringException))]
    public void EnsureValidTagString_ThrowsWhenMissingPathEndElement()
    {
      TagManager.EnsureValidTagString("[1/2/]");
    }

    [TestMethod]
    [ExpectedException(typeof (InvalidTagStringException))]
    public void EnsureValidTagString_ThrowsWhenMissingPathStartElement()
    {
      TagManager.EnsureValidTagString("[/1/2]");
    }

    [TestMethod]
    [ExpectedException(typeof (InvalidTagStringException))]
    public void EnsureValidTagString_ThrowsWhenErrorInOnlyOneSegment()
    {
      TagManager.EnsureValidTagString("[/1/2/];[/1/2]");
    }

    [TestMethod]
    [ExpectedException(typeof (InvalidTagStringException))]
    public void EnsureValidTagString_ThrowsWhenSeparatorIsMissing()
    {
      TagManager.EnsureValidTagString("[/1/2/][/1/2/]");
    }

    [TestMethod]
    [ExpectedException(typeof (InvalidTagStringException))]
    public void EnsureValidTagString_ThrowsWhenStringEndsWithSeparator()
    {
      TagManager.EnsureValidTagString("[/1/2/];[/1/2/];");
    }

    [TestMethod]
    [ExpectedException(typeof (InvalidTagStringException))]
    public void EnsureValidTagString_ThrowsWhenStringStartsWithSeparator()
    {
      TagManager.EnsureValidTagString(";[/1/2/];[/1/2/]");
    }

    [TestMethod]
    [ExpectedException(typeof (InvalidTagStringException))]
    public void EnsureValidTagString_ThrowsWhenThereIsSpaceSomeWhere()
    {
      TagManager.EnsureValidTagString("[/1/2/] [/1/2/]");
    }

    [TestMethod]
    [ExpectedException(typeof (InvalidTagStringException))]
    public void EnsureValidTagString_ThrowsWhenThereIsSpaceAtTheEnd()
    {
      TagManager.EnsureValidTagString("[/1/2/];[/1/2/] ");
    }

    [TestMethod]
    public void EnsureValidTagString_WorksWhenIdNumbersHaveMoreThanTwoDigits()
    {
      TagManager.EnsureValidTagString("[/123/123456/];[/1/22/333/4444/55555/]");
    }

    [TestMethod]
    public void EnsureValidTagString_WorksWhenEmpty()
    {
      TagManager.EnsureValidTagString("");
    }

    [TestMethod]
    public void EnsureValidTagString_WorksWhenNull()
    {
      TagManager.EnsureValidTagString(null);
    }
  }
}