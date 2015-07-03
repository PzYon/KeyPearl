﻿using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Linq.Expressions;

namespace KeyPearl.Library.Tests.TestTypes
{
  public class TestDbSet<TEntity> : DbSet<TEntity>, IQueryable, IEnumerable<TEntity>, IDbAsyncEnumerable<TEntity>
    where TEntity : class
  {
    private readonly ObservableCollection<TEntity> _data;
    private readonly IQueryable _query;

    public TestDbSet()
    {
      _data = new ObservableCollection<TEntity>();
      _query = _data.AsQueryable();
    }

    public override TEntity Add(TEntity item)
    {
      _data.Add(item);
      return item;
    }

    public override TEntity Remove(TEntity item)
    {
      _data.Remove(item);
      return item;
    }

    public override TEntity Attach(TEntity item)
    {
      _data.Add(item);
      return item;
    }

    public override TEntity Create()
    {
      return Activator.CreateInstance<TEntity>();
    }

    public override TDerivedEntity Create<TDerivedEntity>()
    {
      return Activator.CreateInstance<TDerivedEntity>();
    }

    public override ObservableCollection<TEntity> Local
    {
      get { return _data; }
    }

    Type IQueryable.ElementType
    {
      get { return _query.ElementType; }
    }

    Expression IQueryable.Expression
    {
      get { return _query.Expression; }
    }

    IQueryProvider IQueryable.Provider
    {
      get { return new TestDbAsyncQueryProvider<TEntity>(_query.Provider); }
    }

    IEnumerator IEnumerable.GetEnumerator()
    {
      return _data.GetEnumerator();
    }

    IEnumerator<TEntity> IEnumerable<TEntity>.GetEnumerator()
    {
      return _data.GetEnumerator();
    }

    IDbAsyncEnumerator<TEntity> IDbAsyncEnumerable<TEntity>.GetAsyncEnumerator()
    {
      return new TestDbAsyncEnumerator<TEntity>(_data.GetEnumerator());
    }
  }
}
