using System;
using System.Collections.Generic;
using System.Data.Entity;
using KeyPearl.Library.Entities.Links;
using KeyPearl.Library.Entities.Tags;

namespace KeyPearl.Library.Persistance
{
  public interface IDbContext : IDisposable
  {
    DbSet<Tag> Tags { get; set; }

    DbSet<Link> Links { get; set; }

    T Update<T>(T entity) where T : class, IEntity;

    List<T> BatchUpdate<T>(List<T> entities) where T : class, IEntity;

    int SaveChanges();
  }
}