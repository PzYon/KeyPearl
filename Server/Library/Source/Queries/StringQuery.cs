using System;
using System.Linq;
using KeyPearl.Library.Entities.Links;

namespace KeyPearl.Library.Queries
{
  public static class StringQuery
  {
    public static IQueryable<Link> Execute(IQueryable<Link> links, string[] terms)
    {
      string[] cleanedSearchTerms = terms.Where(s => !String.IsNullOrEmpty(s)).ToArray();
      if (!cleanedSearchTerms.Any())
      {
        return Enumerable.Empty<Link>()
                         .AsQueryable();
      }

      IQueryable<Link> results = links;
      foreach (string term in cleanedSearchTerms)
      {
        results = FilterBySearchTerm(results, term);
      }
      return results;
    }

    private static IQueryable<Link> FilterBySearchTerm(IQueryable<Link> stringSearchables, string term)
    {
      return stringSearchables.Where(s => !String.IsNullOrEmpty(s.Name) && s.Name.Contains(term)
                                          || !String.IsNullOrEmpty(s.Description) && s.Description.Contains(term)
                                          || !String.IsNullOrEmpty(s.Url) && s.Url.Contains(term));
    }
  }
}