﻿using System.Linq;
using System.Text.RegularExpressions;
using KeyPearl.Library.Entities.Tags;
using KeyPearl.Library.Queries.Exceptions;

namespace KeyPearl.Library.Queries
{
  public static class TagQuery
  {
    private static readonly Regex isValidTagQuery = new Regex(@"^[\d+" + TagManager.Separator + "+]+$",
                                                              RegexOptions.Compiled);

    public static IQueryable<T> Execute<T>(IQueryable<T> taggables, string tagQuery) where T : class, ITaggable
    {
      if (tagQuery == null || !isValidTagQuery.IsMatch(tagQuery))
      {
        throw new InvalidTagQueryException(tagQuery);
      }

      string[] tagIds = tagQuery.Split(TagManager.Separator);
      string pathSeparator = TagManager.PathSeparator.ToString();

      return taggables.Where(l => tagIds.Distinct()
                                        .All(tagId => !string.IsNullOrEmpty(l.TagString)
                                                      && l.TagString.Contains(pathSeparator + tagId + pathSeparator)))
                      .OfType<T>();
    }
  }
}