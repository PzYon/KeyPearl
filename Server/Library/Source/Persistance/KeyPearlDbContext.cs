using System.Data.Entity;
using System.Diagnostics;
using KeyPearl.Library.Configuration;
using KeyPearl.Library.Entities.Links;
using KeyPearl.Library.Entities.Tags;

namespace KeyPearl.Library.Persistance
{
  public class KeyPearlDbContext : DbContext, IDbContext
  {
    public DbSet<Tag> Tags { get; set; }
    public DbSet<Link> Links { get; set; }

    public T Update<T>(T t) where T: class, IEntity
    {
      Entry(t).State = t.Id == 0
                         ? EntityState.Added
                         : EntityState.Modified;

      SaveChanges();

      return t;
    }

    public KeyPearlDbContext() : base(KeyPearlConfiguration.ConnectionString)
    {
      if (KeyPearlConfiguration.LogSqlQueries)
      {
        Database.Log = s => Debug.WriteLine(s);
      }
    }
  }
}