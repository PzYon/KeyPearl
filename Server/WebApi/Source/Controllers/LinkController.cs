using System.Linq;
using System.Web.Http;
using KeyPearl.Library.Entities.Links;
using KeyPearl.Library.Queries;

namespace KeyPearl.WebApi.Controllers
{
  public class LinkController : BaseDbContextApiController
  {
    [Route("api/links/")]
    public Link[] Get(string queryString = null)
    {
      return (queryString == null
                ? DbContext.Links
                : QueryHandler.Execute(DbContext.Links, queryString)).ToArray();
    }
  }
}