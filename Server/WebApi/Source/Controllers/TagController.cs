using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Web.Http;
using KeyPearl.Library.Entities.Tags;

namespace KeyPearl.WebApi.Controllers
{
  public class TagController : BaseDbContextApiController
  {
    private const string controllerUrl = "tags";

    [Route(controllerUrl)]
    public Tag[] Get()
    {
      return DbContext.Tags
                      .ToArray();
    }

    [Route(controllerUrl)]
    public ModifyTagsResult Post(List<Tag> tags)
    {
      return PerformTagModification(() => TagManager.UpdateTags(DbContext, tags));
    }

    [Route(controllerUrl + "/{id}")]
    public ModifyTagsResult Delete(int id)
    {
      return PerformTagModification(() => TagManager.DeleteTag(DbContext, id));
    }

    private ModifyTagsResult PerformTagModification(Func<ModifyTagsResult> modificationFunction)
    {
      var watch = new Stopwatch();
      watch.Start();

      ModifyTagsResult result = modificationFunction();
      DbContext.SaveChanges();

      result.ServerTimeInMs = watch.ElapsedMilliseconds;
      result.Tags = Get();

      return result;
    }
  }
}