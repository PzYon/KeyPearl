using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using KeyPearl.Library.Entities.Tags;

namespace KeyPearl.WebApi.Controllers
{
  public class TagController : BaseDbContextApiController
  {
    [Route("api/tags")]
    public Tag[] Get()
    {
      return DbContext.Tags
                      .ToArray();
    }

    [Route("api/tags/")]
    public UpdateTagsResult Post(List<Tag> tags)
    {
      UpdateTagsResult result = TagManager.UpdateTags(DbContext, tags);
      DbContext.SaveChanges();

      result.Tags = Get();

      return result;
    }
  }
}