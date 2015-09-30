using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web.Http;
using KeyPearl.Library.Entities.Serialization;
using KeyPearl.Library.Entities.Tags;

namespace KeyPearl.WebApi.Controllers
{
  public class TagController : BaseDbContextApiController
  {
    private const string controllerUrl = "tags";

    [Route(controllerUrl)]
    public HttpResponseMessage Get()
    {
      return GetResponse<List<Tag>, NullInfo>(result => result.Data = GetAllTags());
    }

    [Route(controllerUrl)]
    public HttpResponseMessage Post(List<Tag> tags)
    {
      return GetResponse<List<Tag>, TagModificationInfo>(result => Post(tags, result));
    }

    [Route(controllerUrl + "/{id}")]
    public HttpResponseMessage Delete(int id)
    {
      return GetResponse<List<Tag>, TagModificationInfo>(result => Delete(id, result));
    }

    private void Post(List<Tag> tags, ResponseData<List<Tag>, TagModificationInfo> result)
    {
      result.Info = TagManager.UpdateTags(DbContext, tags);
      result.Data = SaveAndGetAllTags();
    }

    private void Delete(int id, ResponseData<List<Tag>, TagModificationInfo> result)
    {
      result.Info = TagManager.DeleteTag(DbContext, id);
      result.Data = SaveAndGetAllTags();
    }

    private List<Tag> SaveAndGetAllTags()
    {
      DbContext.SaveChanges();
      return GetAllTags();
    }

    private List<Tag> GetAllTags()
    {
      return DbContext.Tags.ToList();
    }
  }
}