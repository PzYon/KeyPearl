using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using KeyPearl.Library.Entities;
using KeyPearl.Library.Entities.Serialization;
using KeyPearl.Library.Entities.Tags;

namespace KeyPearl.WebApi.Controllers
{
  public class TagController : BaseDbContextApiController
  {
    private const string controllerUrl = "tags";

    [Route(controllerUrl)]
    public ServerResult<List<Tag>, NullInfo> Get()
    {
      return CreateResult<List<Tag>, NullInfo>(result => result.Data = GetAllTags());
    }

    [Route(controllerUrl)]
    public ServerResult<List<Tag>, TagModificationInfo> Post(List<Tag> tags)
    {
      return CreateResult<List<Tag>, TagModificationInfo>(result => Post(tags, result));
    }

    [Route(controllerUrl + "/{id}")]
    public ServerResult<List<Tag>, TagModificationInfo> Delete(int id)
    {
      return CreateResult<List<Tag>, TagModificationInfo>(result => Delete(id, result));
    }

    private void Post(List<Tag> tags, ServerResult<List<Tag>, TagModificationInfo> result)
    {
      result.Info = TagManager.UpdateTags(DbContext, tags);
      DbContext.SaveChanges();
      result.Data = GetAllTags();
    }

    private void Delete(int id, ServerResult<List<Tag>, TagModificationInfo> result)
    {
      result.Info = TagManager.DeleteTag(DbContext, id);
      DbContext.SaveChanges();
      result.Data = GetAllTags();
    }

    private List<Tag> GetAllTags()
    {
      return DbContext.Tags.ToList();
    }
  }
}