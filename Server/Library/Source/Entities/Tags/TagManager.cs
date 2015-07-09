using System;
using System.Collections.Generic;
using System.Linq;
using KeyPearl.Library.Entities.Links;
using KeyPearl.Library.Persistance;

namespace KeyPearl.Library.Entities.Tags
{
  public static class TagManager
  {
    public const char Separator = ';';
    public const char PathSeparator = '/';
    public const char PathStarter = '[';
    public const char PathEnder = ']';

    public static int[] GetIdsFromTagString(string tagString)
    {
      if (String.IsNullOrEmpty(tagString))
      {
        return new int[0];
      }

      return tagString.Split(Separator)
                      .Select(p => Int32.Parse(p.Trim(PathStarter, PathEnder)
                                                .Split(new[] {PathSeparator},
                                                       StringSplitOptions.RemoveEmptyEntries)
                                                .Last()))
                      .Distinct()
                      .OrderBy(i => i)
                      .ToArray();
    }

    public static void SyncTagStringWithTagIds(IDbContext dbContext, Link link)
    {
      Link existingLink = dbContext.Links.FirstOrDefault(l => l.Id == link.Id);
      if (existingLink != null && existingLink.TagIds.SequenceEqual(link.TagIds))
      {
        return;
      }

      Tag[] allTags = dbContext.Tags.ToArray();

      foreach (Tag tag in link.TagIds
                              .Select(tagId => allTags.FirstOrDefault(t => t.Id == tagId))
                              .Where(t => t != null))
      {
        EnsureTag(allTags, link, tag);
      }
    }

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
      EnsureTag(dbContext.Tags.ToArray(), taggable, tag);
    }

    public static void EnsureTag(Tag[] allTags, ITaggable taggable, Tag tag)
    {
      string currentTagString = taggable.TagString ?? String.Empty;
      bool hasTags = !String.IsNullOrEmpty(currentTagString);

      string tagPath = GetTagPath(allTags, tag);

      if (hasTags && currentTagString.Contains(tagPath))
      {
        return;
      }

      taggable.TagString = hasTags
                             ? String.Concat(currentTagString, Separator, tagPath)
                             : tagPath;
    }

    private static string GetTagPath(Tag[] allTags, Tag tag)
    {
      Tag current = tag;

      var tagIds = new List<int>();
      while (current != null)
      {
        tagIds.Add(current.Id);
        current = allTags.SingleOrDefault(t => t.Id == current.ParentId);
      }

      tagIds.Reverse();

      return String.Concat(PathStarter,
                           String.Join(PathSeparator.ToString(), tagIds),
                           PathEnder);
    }
  }
}