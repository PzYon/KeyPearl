using System.Collections.Generic;
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

    public T Update<T>(T entity) where T : class, IEntity
    {
      DbSet<T> dbSet = Set<T>();

      T existingEntity = dbSet.FirstOrDefault(s => s.Id == entity.Id);

      if (existingEntity == null)
      {
        dbSet.Add(entity);
      }
      else
      {
        Entry(existingEntity).CurrentValues.SetValues(entity);
      }

      return entity;
    }

    public List<T> BatchUpdate<T>(List<T> entities) where T : class, IEntity
    {
      foreach (T entity in entities)
      {
        Update(entity);
      }
      return entities;
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