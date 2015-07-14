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
                      .OrderBy(t => t.ParentId)
                      .ToArray();
    }

    [Route("api/tags/")]
    public List<Tag> Post(List<Tag> tags)
    {
      List<Tag> updatedTags = DbContext.BatchUpdate(tags);
      DbContext.SaveChanges();

      return updatedTags;
    }
  }
}