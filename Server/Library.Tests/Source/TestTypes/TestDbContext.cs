using System.Data.Entity;
using KeyPearl.Library.Entities.Links;
using KeyPearl.Library.Entities.Tags;
using KeyPearl.Library.Persistance;

namespace KeyPearl.Library.Tests.TestTypes
{
  // we use a "fake" DbContext for unit testing, based on:
  // https://msdn.microsoft.com/en-us/data/dn314431.aspx

  public class TestDbContext : IDbContext
  {
    public DbSet<Tag> Tags { get; set; }
    public DbSet<Link> Links { get; set; }

    public TestDbContext()
    {
      Links = new TestDbSet<Link>
      {
        new Link {TagString = "/1/2/3/"},
        new Link {TagString = "/1/2/"},
        new Link {TagString = "/1/"}
      };

    }

  

    public void Dispose()
    {
      // not required for unit tests
    }
  }
}