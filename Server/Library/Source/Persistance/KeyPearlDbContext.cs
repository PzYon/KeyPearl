using System.Data.Entity;
using System.Diagnostics;
using System.Linq;
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
      DbSet<T> dbSet = Set<T>();

      T current = dbSet.FirstOrDefault(s => s.Id == t.Id);

      if (current == null)
      {
        dbSet.Add(t);
      }
      else
      {
        Entry(current).CurrentValues.SetValues(t);
      }

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