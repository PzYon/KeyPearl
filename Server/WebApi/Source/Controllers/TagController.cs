using System.Collections.Generic;
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
      ModifyTagsResult result = TagManager.UpdateTags(DbContext, tags);
      DbContext.SaveChanges();

      result.Tags = Get();

      return result;
    }

    [Route(controllerUrl + "/{id}")]
    public ModifyTagsResult Delete(int id)
    {
      ModifyTagsResult result = TagManager.DeleteTag(DbContext, id);
      DbContext.SaveChanges();

      result.Tags = Get();

      return result;
    }
  }
}