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

    public static UpdateTagsResult UpdateTags(IDbContext dbContext, List<Tag> changedTags)
    {
      dbContext.BatchUpdate(changedTags);

      // todo: would be nice if logic is only done for tags which actually have changed hieararchy
      // how? do server side? rely on flag from client?
      int numberOfUpdatedLinks = UpdateLinkTagStrings(dbContext, changedTags);

      return new UpdateTagsResult
        {
          NumberOfUpdatedLinks = numberOfUpdatedLinks,
          NumberOfUpdatedTags = changedTags.Count
        };
    }

    private static int UpdateLinkTagStrings(IDbContext dbContext, List<Tag> changedTags)
    {
      string[] patterns = changedTags.Select(t => JoinTagPathElements(t.Id))
                                     .ToArray();

      // .ToList() is required in order to prevent entity framework exception
      List<Link> linksToUpdate = dbContext.Links
                                          .Where(l => patterns.Any(p => l.TagString.Contains(p)))
                                          .ToList();

      foreach (Link link in linksToUpdate)
      {
        SyncTagStringWithTagIds(dbContext, link, true);
      }

      return linksToUpdate.Count;
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

    public static void SyncTagStringWithTagIds(IDbContext dbContext, Link link, bool force = false)
    {
      Link existingLink = dbContext.Links.FirstOrDefault(l => l.Id == link.Id);
      if (existingLink != null && !force && existingLink.TagIds.SequenceEqual(link.TagIds))
      {
        return;
      }

      link.ClearTagString();

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
  }
}