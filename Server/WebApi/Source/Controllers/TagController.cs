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
    public Tag[] Post(List<Tag> tags)
    {
      DbContext.BatchUpdate(tags);
      DbContext.SaveChanges();

      return Get();
    }
  }
}