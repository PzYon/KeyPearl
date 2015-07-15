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
    public Tag[] Post(List<Tag> tags)
    {
      DbContext.BatchUpdate(tags);
      DbContext.SaveChanges();

      // we return all tags in order to be able to recreate the tag tree from scratch
      // on the client without needing to be sure to insert everything in the right place.
      return Get();
    }
  }
}