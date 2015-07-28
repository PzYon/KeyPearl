using System.Text.RegularExpressions;
using KeyPearl.Library.Queries.Exceptions;

namespace KeyPearl.Library.Queries
{
  public class QueryParams
  {
    public string TagIds { get; private set; }
    public string[] SearchStrings { get; private set; }

    private QueryParams()
    {
    }

    // format: $tagIds(1;2;3)$searchString(foo)
    private static readonly Regex queryRegex = new Regex(@"\$(searchString|tagIds)(\(.*?\))", RegexOptions.Compiled);

    // todo: what about %20 and special chars [$, ;, (, )] - do we need to escape or remove them?
    // --> %20 seems to work, other chars might need to be removed on client?

    public static QueryParams Parse(string queryString)
    {
      if (string.IsNullOrEmpty(queryString))
      {
        throw new InvalidQueryException(queryString);
      }

      MatchCollection matches = queryRegex.Matches(queryString);
      if (matches.Count == 0)
      {
        throw new InvalidQueryException(queryString);
      }

      var queryParams = new QueryParams();

      foreach (Match match in matches)
      {
        string key = match.Groups[1].Value;

        // value is never null due to RegEx
        string value = Trim(match.Groups[2].Value);

        switch (key)
        {
          case "tagIds":
            queryParams.TagIds = value;
            break;
          case "searchString":
            queryParams.SearchStrings = value.Split(' ');
            break;
          default:
            // we don't do anthing, as this never happens due to RegEx
            break;
        }
      }

      return queryParams;
    }

    private static string Trim(string value)
    {
      return string.IsNullOrEmpty(value)
               ? value
               : value.Trim('(', ')');
    }
  }
}