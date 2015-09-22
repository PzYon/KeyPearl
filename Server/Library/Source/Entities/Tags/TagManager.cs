using System;
using System.Collections.Generic;
using System.Linq;
using KeyPearl.Library.Entities.Links;
using KeyPearl.Library.Entities.Serialization;
using KeyPearl.Library.Persistance;

namespace KeyPearl.Library.Entities.Tags
{
  // todo: consider adding unit tests which check count (tags and links)!?
  // --> methods: UpdateTags, DeleteTag

  public static class TagManager
  {
    public const char Separator = ';';
    public const char PathSeparator = '/';
    public const char PathStarter = '[';
    public const char PathEnder = ']';

    public static TagModificationInfo UpdateTags(IDbContext dbContext, List<Tag> changedTags)
    {
      dbContext.BatchUpdate(changedTags);

      int updatedLinksCount = UpdateTagStrings(dbContext, changedTags);

      return new TagModificationInfo
        {
          ModifiedLinksCount = updatedLinksCount,
          ModifiedTagsCount = changedTags.Count
        };
    }

    public static TagModificationInfo DeleteTag(IDbContext dbContext, int tagId)
    {
      Link[] taggedLinks = GetTaggedLinks(dbContext, tagId);
      foreach (Link link in taggedLinks)
      {
        RemoveTag(link, tagId);
      }

      int deletedTagsCount = DeleteTagRecursive(dbContext, tagId);

      return new TagModificationInfo
        {
          ModifiedLinksCount = taggedLinks.Length,
          ModifiedTagsCount = deletedTagsCount
        };
    }

    public static void RemoveTag(ITaggable taggable, int tagId)
    {
      if (taggable == null || string.IsNullOrEmpty(taggable.TagString))
      {
        return;
      }

      taggable.TagString = string.Join(Separator.ToString(),
                                       taggable.TagString.Split(Separator)
                                               .Where(s => !s.Contains(JoinTagPathElements(tagId))));
    }

    public static int[] GetIdsFromTagString(string tagString)
    {
      if (string.IsNullOrEmpty(tagString))
      {
        return new int[0];
      }

      return tagString.Split(Separator)
                      .Select(p => int.Parse(p.Trim(PathStarter, PathEnder)
                                              .Split(new[] {PathSeparator},
                                                     StringSplitOptions.RemoveEmptyEntries)
                                              .Last()))
                      .Distinct()
                      .OrderBy(i => i)
                      .ToArray();
    }

    public static void SyncTagStringWithTagIds(IDbContext dbContext, Link link)
    {
      SyncTagStringWithTagIds(dbContext, dbContext.Tags.ToArray(), link);
    }

    public static void SyncTagStringWithTagIds(IDbContext dbContext, Tag[] allTags, Link link)
    {
      link.ClearTagString();

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
      // we change taggable (e.g. Link) but do not call dbContext.Update as this is done
      // by caller. this way we can prevent Modified-property on taggable being updated, 
      // just because TagString changed (e.g. when tag hierarchy has changed). if we add
      // a tag to a taggable, dbContext.Update should be called by caller, as he is actually
      // changing the taggable.

      string currentTagString = taggable.TagString ?? string.Empty;
      bool hasTags = !string.IsNullOrEmpty(currentTagString);

      string tagPath = GetTagPath(allTags, tag);

      if (hasTags && currentTagString.Contains(tagPath))
      {
        return;
      }

      taggable.TagString = hasTags
                             ? string.Concat(currentTagString, Separator, tagPath)
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

      return string.Concat(PathStarter, JoinTagPathElements(tagIds.ToArray()), PathEnder);
    }

    private static string JoinTagPathElements(params int[] tagIds)
    {
      return string.Concat(PathSeparator.ToString(),
                           string.Join(PathSeparator.ToString(), tagIds),
                           PathSeparator.ToString());
    }

    private static int UpdateTagStrings(IDbContext dbContext, List<Tag> changedTags)
    {
      Link[] taggedLinks = GetTaggedLinks(dbContext, changedTags.Select(t => t.Id).ToArray());
      Tag[] allTags = dbContext.Tags.ToArray();

      foreach (Link link in taggedLinks)
      {
        SyncTagStringWithTagIds(dbContext, allTags, link);
      }

      return taggedLinks.Length;
    }

    private static Link[] GetTaggedLinks(IDbContext dbContext, params int[] changedTagIds)
    {
      string[] patterns = changedTagIds.Select(t => JoinTagPathElements(t))
                                       .ToArray();

      // .ToArray() is required in order to prevent entity framework exception
      return dbContext.Links
                      .Where(l => patterns.Any(p => l.TagString.Contains(p)))
                      .ToArray();
    }

    private static int DeleteTagRecursive(IDbContext dbContext, int tagId)
    {
      int count = dbContext.Tags
                           .Where(t => t.ParentId == tagId)
                           .ToList()
                           .Sum(childTag => DeleteTagRecursive(dbContext, childTag.Id));

      count++;
      dbContext.Delete<Tag>(tagId);

      return count;
    }
  }
}