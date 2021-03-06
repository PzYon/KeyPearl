﻿using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Diagnostics;
using System.Linq;
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
      // we always need to set Created and Modified as they are not returned from the client
      DateTime currentDate = DateTime.Now;
      entity.Modified = currentDate;

      DbSet<T> dbSet = Set<T>();
      T existingEntity = dbSet.FirstOrDefault(e => e.Id == entity.Id);

      if (existingEntity == null)
      {
        entity.Created = currentDate;

        dbSet.Add(entity);
      }
      else
      {
        entity.Created = existingEntity.Created;

        Entry(existingEntity).CurrentValues.SetValues(entity);
      }

      return entity;
    }

    public void Delete<T>(int id) where T : class, IEntity
    {
      DbSet<T> dbSet = Set<T>();

      T existingEntity = dbSet.FirstOrDefault(e => e.Id == id);
      if (existingEntity != null)
      {
        dbSet.Remove(existingEntity);
      }
    }

    public List<T> BatchUpdate<T>(List<T> entities) where T : class, IEntity
    {
      foreach (T entity in entities)
      {
        Update(entity);
      }
      return entities;
    }

    public KeyPearlDbContext(string connectionString, bool logSqlQueries) : base(connectionString)
    {
      if (logSqlQueries)
      {
        Database.Log = s => Debug.WriteLine(s);
      }
    }
  }
}