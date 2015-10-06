using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
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
          new Link {TagString = "[/1/2/3/]"},
          new Link {TagString = "[/1/2/]"},
          new Link {TagString = "[/1/]"}
        };
    }

    public T Update<T>(T entity) where T : class, IEntity
    {
      return entity;
    }

    // this is so f*cking ugly, but it works and for the moment,
    // I don't know how to do it better.. :-S
    public List<T> BatchUpdate<T>(List<T> updated) where T : class, IEntity
    {
      return (updated.First() is Tag
                ? BatchUpdateTags(updated.OfType<Tag>()
                                         .ToList())
                    .OfType<T>()
                : BatchUpdateLinks(updated.OfType<Link>()
                                          .ToList())
                    .OfType<T>())
        .ToList();
    }

    public void Delete<T>(int id) where T : class, IEntity
    {
      throw new NotImplementedException();
    }

    public int SaveChanges()
    {
      throw new NotImplementedException();
    }

    public void Dispose()
    {
      // not required for unit tests
    }

    private List<Tag> BatchUpdateTags(List<Tag> updatedTags)
    {
      List<Tag> tags = Tags.ToList();
      foreach (Tag tag in tags)
      {
        Tag updatedTag = updatedTags.FirstOrDefault(e => e.Id == tag.Id);
        if (updatedTag != null)
        {
          Tags.Remove(tag);
          Tags.Add(updatedTag);
        }
      }

      return Tags.ToList();
    }

    private List<Link> BatchUpdateLinks(List<Link> updatedLinks)
    {
      List<Link> links = Links.ToList();
      foreach (Link link in links)
      {
        Link updatedLink = updatedLinks.FirstOrDefault(e => e.Id == link.Id);
        if (updatedLink != null)
        {
          Links.Remove(link);
          Links.Add(updatedLink);
        }
      }

      return Links.ToList();
    }
  }
}