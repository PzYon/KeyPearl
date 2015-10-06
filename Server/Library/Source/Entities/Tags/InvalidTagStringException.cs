using System;

namespace KeyPearl.Library.Entities.Tags
{
  public class InvalidTagStringException : Exception
  {
    public InvalidTagStringException(string tagString)
      : base(string.Format("'{0}' is not a valid tag string.", tagString))
    {
    }
  }
}