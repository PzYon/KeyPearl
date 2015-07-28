using System;

namespace KeyPearl.Library.Queries.Exceptions
{
  public class InvalidTagQueryException : Exception
  {
    public InvalidTagQueryException(string tagQuery)
      : base(string.Format("'{0}' is not a valid tag query.", tagQuery))
    {
    }
  }
}