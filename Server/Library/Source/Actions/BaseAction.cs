using System;
using System.Diagnostics;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http;
using KeyPearl.Library.Persistance;

namespace KeyPearl.Library.Actions
{
  public abstract class BaseAction<TData, TInfo> : IHttpActionResult
    where TData : class, new()
    where TInfo : BaseInfo, new()
  {
    protected IDbContext DbContext;
    protected HttpRequestMessage Request;

    protected BaseAction(HttpRequestMessage request, IDbContext dbContext)
    {
      Request = request;
      DbContext = dbContext;
    }

    protected abstract void Execute(ActionResult<TData, TInfo> actionResult);

    public Task<HttpResponseMessage> ExecuteAsync(CancellationToken cancellationToken)
    {
      var watch = new Stopwatch();
      watch.Start();

      HttpStatusCode statusCode;
      var actionResult = new ActionResult<TData, TInfo>();

      try
      {
        Execute(actionResult);
        statusCode = HttpStatusCode.OK;
      }
      catch (Exception ex)
      {
        actionResult.ErrorMessage = string.Format("{0}: '{1}'", ex.GetType().Name, ex.Message);
        statusCode = HttpStatusCode.InternalServerError;
      }

      actionResult.ServerTimeInMs = watch.ElapsedMilliseconds;

      return Task.FromResult(Request.CreateResponse(statusCode, actionResult));
    }
  }
}