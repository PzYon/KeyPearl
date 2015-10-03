using System.Net.Http;
using KeyPearl.Library.Entities.Links;
using KeyPearl.Library.Persistance;

namespace KeyPearl.Library.Actions.Links
{
  public class DeleteLinkAction : BaseAction<Link, NullInfo>
  {
    private readonly int id;

    public DeleteLinkAction(HttpRequestMessage request, IDbContext dbContext, int id)
      : base(request, dbContext)
    {
      this.id = id;
    }

    protected override void Execute(ActionResult<Link, NullInfo> actionResult)
    {
      DbContext.Delete<Link>(id);
      DbContext.SaveChanges();
    }
  }
}