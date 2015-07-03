using System;
using System.Collections.Generic;
using System.Linq;
using KeyPearl.Library.Entities.Links;

namespace KeyPearl.Library.Queries
{
  public static class QueryHandler
  {
    public static IEnumerable<Link> Execute(IQueryable<Link> links, string queryString)
    {
      QueryParams q = QueryParams.Parse(queryString);
      
      IQueryable<Link> results = links;

      if (q.SearchStrings != null)
      {
        results = StringQuery.Execute(results, q.SearchStrings);
      }

      if (!String.IsNullOrEmpty(q.TagIds))
      {
        results = TagQuery.Execute(results, q.TagIds);
      }

      return results;
    }
  }
}
