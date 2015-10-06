using System.Collections.Generic;
using System.Web.Http;
using KeyPearl.Library.Actions.Tags;
using KeyPearl.Library.Entities.Tags;

namespace KeyPearl.WebApi.Controllers
{
  public class TagController : BaseDbContextApiController
  {
    private const string controllerUrl = "tags";

    [Route(controllerUrl)]
    public IHttpActionResult Get()
    {
      return new GetTagsAction(Request, DbContext);
    }

    [Route(controllerUrl)]
    public IHttpActionResult Post(List<Tag> tags)
    {
      return new UpdateTagsAction(Request, DbContext, tags);
    }

    [Route(controllerUrl + "/{id}")]
    public IHttpActionResult Delete(int id)
    {
      return new DeleteTagAction(Request, DbContext, id);
    }

    [HttpGet]
    [Route(controllerUrl + "/statistics/{tagId}")]
    public IHttpActionResult Statistics(int tagId)
    {
      return new GetTagStatisticsAction(Request, DbContext, tagId);
    }
  }
}