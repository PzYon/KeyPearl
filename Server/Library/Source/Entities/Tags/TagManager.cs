using System;
using System.Collections.Generic;
using System.Linq;
using KeyPearl.Library.Persistance;

namespace KeyPearl.Library.Entities.Tags
{
  public static class TagManager
  {
    public const char Separator = ';';
    public const string PathSeparator = "/";

    public static void EnsureTags(IDbContext dbContext, ITaggable taggable, params Tag[] tags)
    {
      if (tags == null)
      {
        return;
      }

      foreach (Tag tag in tags)
      {
        EnsureTag(dbContext, taggable, tag);
      }
    }

    public static void EnsureTag(IDbContext dbContext, ITaggable taggable, Tag tag)
    {
      string currentTagString = taggable.TagString ?? String.Empty;
      bool hasTags = !String.IsNullOrEmpty(currentTagString);

      string tagPath = GetTagPath(dbContext, tag);

      if (hasTags && currentTagString.Contains(tagPath))
      {
        return;
      }

      taggable.TagString = hasTags
                             ? String.Concat(currentTagString, Separator, tagPath)
                             : tagPath;
    }

    private static string GetTagPath(IDbContext dbContext, Tag tag)
    {
      Tag[] allTags = dbContext.Tags.ToArray();
      Tag current = tag;

      var tagIds = new List<int>();
      while (current != null)
      {
        tagIds.Add(current.Id);
        current = allTags.SingleOrDefault(t => t.Id == current.ParentId);
      }

      tagIds.Reverse();

      return String.Concat(PathSeparator,
                           String.Join(PathSeparator, tagIds),
                           PathSeparator);
    }
  }
}