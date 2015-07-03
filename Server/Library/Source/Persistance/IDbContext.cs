using System;
using System.Data.Entity;
using KeyPearl.Library.Entities.Links;
using KeyPearl.Library.Entities.Tags;

namespace KeyPearl.Library.Persistance
{
  public interface IDbContext : IDisposable
  {
    DbSet<Tag> Tags { get; set; }
    DbSet<Link> Links { get; set; }
  }
}