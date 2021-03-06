﻿using System.Collections.Generic;
using System.Linq;
using KeyPearl.Library.Entities.Links;

namespace KeyPearl.Library.Queries
{
  public static class QueryExecutor
  {
    public static IEnumerable<Link> Execute(IQueryable<Link> links, string queryString)
    {
      QueryParams q = QueryParams.Parse(queryString);

      IQueryable<Link> results = links;

      if (q.SearchStrings != null)
      {
        results = StringQuery.Execute(results, q.SearchStrings);
      }

      if (!string.IsNullOrEmpty(q.TagIds))
      {
        results = TagQuery.Execute(results, q.TagIds);
      }

      return results;
    }
  }
}