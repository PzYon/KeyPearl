using System;
using System.Diagnostics;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using KeyPearl.Library.Entities.Serialization;
using KeyPearl.Library.Persistance;

namespace KeyPearl.WebApi.Controllers
{
  public abstract class BaseDbContextApiController : ApiController
  {
    protected readonly IDbContext DbContext;

    protected BaseDbContextApiController()
    {
      DbContext = new KeyPearlDbContext(WebConfigReader.GetConnectionString("KeyPearl"),
                                        WebConfigReader.Get<bool>("LogSqlQueries"));
    }

    protected HttpResponseMessage GetResponse<TData, TInfo>(Action<ResponseData<TData, TInfo>> processAction)
      where TInfo : class, new()
      where TData : class, new()
    {
      var watch = new Stopwatch();
      watch.Start();

      var responseData = new ResponseData<TData, TInfo>();

      HttpResponseMessage response;
      try
      {
        processAction(responseData);
        response = Request.CreateResponse(HttpStatusCode.OK, responseData);
      }
      catch (Exception ex)
      {
        responseData.ErrorMessage = string.Format("{0}: '{1}'", ex.GetType().Name, ex.Message);
        response = Request.CreateResponse(HttpStatusCode.InternalServerError, responseData);
      }

      responseData.ServerTimeInMs = watch.ElapsedMilliseconds;

      return response;
    }

    protected override void Dispose(bool disposing)
    {
      if (DbContext != null)
      {
        DbContext.Dispose();
      }

      base.Dispose(disposing);
    }
  }
}