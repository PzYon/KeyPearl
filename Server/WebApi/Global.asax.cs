using System.Data.Entity;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;
using KeyPearl.Library.Persistance;
using Newtonsoft.Json.Serialization;

namespace KeyPearl.WebApi
{
  public class WebApiApplication : HttpApplication
  {
    protected void Application_Start()
    {
      GlobalConfiguration.Configure(RegisterWebApiRoutes);

      Database.SetInitializer(new KeyPearlDbContextInitializer());
    }

    private static void RegisterWebApiRoutes(HttpConfiguration config)
    {
      // required in order to enable client from different domain (i.e. different port) call the web service
      // consider: removing this for production or at least make it configurable.
      config.EnableCors(new EnableCorsAttribute("*", "*", "*"));

      // we want to use lowercase properties in JavaScript
      config.Formatters.JsonFormatter.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();

      // all routes are defined on the controller-methods themselves
      config.MapHttpAttributeRoutes();
    }
  }
}