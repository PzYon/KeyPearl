using System;

namespace KeyPearl.Library.Queries.Exceptions
{
  public class InvalidQueryException : Exception
  {
    public InvalidQueryException(string queryString)
      : base(String.Format("'{0}' is not a valid query string.", queryString))
    {
    }
  }
}